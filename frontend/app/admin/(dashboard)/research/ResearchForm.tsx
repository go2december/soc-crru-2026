'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ExternalLink,
  FileText,
  FlaskConical,
  Info,
  Loader2,
  MapPin,
  MapPinned,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  formatResearchStaffName,
  getResearchPublicAssetUrl,
  getResearchMemberRoleOptions,
  getResearchStatusOptions,
  RESEARCH_SDG_DESCRIPTIONS,
  RESEARCH_MEMBER_ROLE_LABELS,
  RESEARCH_STATUS_LABELS,
  RESEARCH_ATTACHMENT_TYPE_LABELS,
  ResearchAttachmentType,
  ResearchMemberRole,
  ResearchProjectAttachment,
  ResearchProjectDetail,
  ResearchProjectLocation,
  ResearchProjectMember,
  ResearchProjectOutput,
  ResearchProjectStatus,
  ResearchStaffOption,
} from '@/lib/research';

export type ResearchFormValues = {
  slug: string;
  titleTh: string;
  titleEn: string;
  abstractTh: string;
  abstractEn: string;
  year: number;
  budget: string;
  fundingSource: string;
  status: ResearchProjectStatus;
  isSocialService: boolean;
  isCommercial: boolean;
  coverImageUrl: string;
  keywords: string[];
  isPublished: boolean;
  members: ResearchProjectMember[];
  locations: ResearchProjectLocation[];
  sdgIds: number[];
  outputs: ResearchProjectOutput[];
  attachments: ResearchProjectAttachment[];
};

interface ResearchFormProps {
  mode: 'create' | 'edit';
  initialData?: ResearchProjectDetail | null;
  onSubmit: (data: ResearchFormValues) => Promise<void>;
  submitting: boolean;
}

const defaultValues: ResearchFormValues = {
  slug: '',
  titleTh: '',
  titleEn: '',
  abstractTh: '',
  abstractEn: '',
  year: new Date().getFullYear(),
  budget: '',
  fundingSource: '',
  status: 'ONGOING',
  isSocialService: false,
  isCommercial: false,
  coverImageUrl: '',
  keywords: [],
  isPublished: true,
  members: [],
  locations: [],
  sdgIds: [],
  outputs: [],
  attachments: [],
};

const emptyMember = (): ResearchProjectMember => ({
  role: 'CO_RESEARCHER',
  staffProfileId: '',
  externalName: '',
  sortOrder: 0,
});

const emptyLocation = (): ResearchProjectLocation => ({
  subDistrict: '',
  district: '',
  province: 'เชียงราย',
  lat: undefined,
  lng: undefined,
});

const emptyOutput = (): ResearchProjectOutput => ({
  outputType: '',
  title: '',
  journalName: '',
  publicationDate: '',
  volume: '',
  issue: '',
  pages: '',
  citation: '',
  doiUrl: '',
  tciUrl: '',
  externalUrl: '',
  tier: '',
});

const emptyAttachment = (): ResearchProjectAttachment => ({
  fileName: '',
  fileType: '',
  fileUrl: '',
  downloadCount: 0,
});

function parseGoogleMapsCoordinates(input: string): { lat: number; lng: number } | null {
  const decoded = decodeURIComponent(input.trim());

  const atMatch = decoded.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    return {
      lat: Number(atMatch[1]),
      lng: Number(atMatch[2]),
    };
  }

  const queryMatch = decoded.match(/[?&](?:q|query)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (queryMatch) {
    return {
      lat: Number(queryMatch[1]),
      lng: Number(queryMatch[2]),
    };
  }

  const plainMatch = decoded.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (plainMatch) {
    return {
      lat: Number(plainMatch[1]),
      lng: Number(plainMatch[2]),
    };
  }

  return null;
}

function normalizeInitialData(initialData?: ResearchProjectDetail | null): ResearchFormValues {
  if (!initialData) return defaultValues;

  return {
    slug: initialData.slug || '',
    titleTh: initialData.titleTh,
    titleEn: initialData.titleEn || '',
    abstractTh: initialData.abstractTh || '',
    abstractEn: initialData.abstractEn || '',
    year: initialData.year,
    budget: initialData.budget || '',
    fundingSource: initialData.fundingSource || '',
    status: initialData.status,
    isSocialService: initialData.isSocialService,
    isCommercial: initialData.isCommercial,
    coverImageUrl: initialData.coverImageUrl || '',
    keywords: initialData.keywords || [],
    isPublished: initialData.isPublished,
    members: initialData.members?.map((member, index) => ({
      staffProfileId: member.staffProfileId || '',
      externalName: member.externalName || '',
      role: member.role,
      sortOrder: member.sortOrder ?? index,
    })) || [],
    locations: initialData.locations?.map((location) => ({
      subDistrict: location.subDistrict || '',
      district: location.district || '',
      province: location.province || 'เชียงราย',
      lat: location.lat,
      lng: location.lng,
    })) || [],
    sdgIds: initialData.sdgIds || [],
    outputs: initialData.outputs?.map((output) => ({
      outputType: output.outputType || '',
      title: output.title,
      journalName: output.journalName || '',
      publicationDate: output.publicationDate ? String(output.publicationDate).slice(0, 10) : '',
      volume: output.volume || '',
      issue: output.issue || '',
      pages: output.pages || '',
      citation: output.citation || '',
      doiUrl: output.doiUrl || '',
      tciUrl: output.tciUrl || '',
      externalUrl: output.externalUrl || '',
      tier: output.tier || '',
    })) || [],
    attachments: initialData.attachments?.map((attachment) => ({
      fileName: attachment.fileName,
      fileType: attachment.fileType || '',
      fileUrl: attachment.fileUrl,
      downloadCount: attachment.downloadCount || 0,
    })) || [],
  };
}

export default function ResearchForm({ mode, initialData, onSubmit, submitting }: ResearchFormProps) {
  const [values, setValues] = useState<ResearchFormValues>(() => normalizeInitialData(initialData));
  const [initialSlug] = useState(() => initialData?.slug || '');
  const [keywordInput, setKeywordInput] = useState('');
  const [sdgInput, setSdgInput] = useState('');
  const [activeSdgInfo, setActiveSdgInfo] = useState<number | null>(null);
  const [showAllSdgInfo, setShowAllSdgInfo] = useState(false);
  const [staffOptions, setStaffOptions] = useState<ResearchStaffOption[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [locationMapInputs, setLocationMapInputs] = useState<Record<number, string>>({});
  const [attachmentUploading, setAttachmentUploading] = useState<Record<number, boolean>>({});

  const memberRoleOptions = useMemo(() => getResearchMemberRoleOptions(), []);
  const statusOptions = useMemo(() => getResearchStatusOptions(), []);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const initialCoverImageUrl = initialData?.coverImageUrl || '';

  useEffect(() => {
    let isMounted = true;

    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/staff?page=1&limit=200`);
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted) return;
        setStaffOptions((json.data || []) as ResearchStaffOption[]);
      } catch (error) {
        console.error('Failed to fetch staff options:', error);
      } finally {
        if (isMounted) setStaffLoading(false);
      }
    };

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const deleteResearchCover = async (url?: string | null) => {
    if (!url || !url.startsWith('/uploads/research/')) return;

    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${apiUrl}/api/upload/research`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error('Failed to delete research cover image:', error);
    }
  };

  const uploadResearchCover = async (file: File) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    setCoverUploading(true);
    try {
      const res = await fetch(`${apiUrl}/api/upload/research`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const nextUrl = data.url as string;
      const previousUrl = values.coverImageUrl;

      if (
        previousUrl &&
        previousUrl.startsWith('/uploads/research/') &&
        previousUrl !== initialCoverImageUrl
      ) {
        await deleteResearchCover(previousUrl);
      }

      setValues((prev) => ({ ...prev, coverImageUrl: nextUrl }));
    } catch (error) {
      console.error(error);
      alert('อัปโหลดรูปภาพปกไม่สำเร็จ');
    } finally {
      setCoverUploading(false);
    }
  };

  const deleteResearchAttachment = async (url?: string | null) => {
    if (!url || !url.startsWith('/uploads/research/')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${apiUrl}/api/upload/research`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error('Failed to delete research attachment:', error);
    }
  };

  const uploadResearchAttachment = async (file: File, index: number) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    setAttachmentUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch(`${apiUrl}/api/upload/research`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const nextUrl = data.url as string;

      const previousUrl = values.attachments[index]?.fileUrl;

      if (
        previousUrl &&
        previousUrl.startsWith('/uploads/research/')
      ) {
        await deleteResearchAttachment(previousUrl);
      }

      updateAttachment(index, 'fileUrl', nextUrl);
      if (!values.attachments[index]?.fileName) {
         updateAttachment(index, 'fileName', file.name);
      }
    } catch (error) {
      console.error(error);
      alert('อัปโหลดไฟล์เอกสารไม่สำเร็จ');
    } finally {
      setAttachmentUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const updateMember = (index: number, field: keyof ResearchProjectMember, value: string | number) => {
    setValues((prev) => {
      const next = [...prev.members];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, members: next };
    });
  };

  const updateLocation = (index: number, field: keyof ResearchProjectLocation, value: string | number | undefined) => {
    setValues((prev) => {
      const next = [...prev.locations];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, locations: next };
    });
  };

  const updateOutput = (index: number, field: keyof ResearchProjectOutput, value: string) => {
    setValues((prev) => {
      const next = [...prev.outputs];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, outputs: next };
    });
  };

  const updateAttachment = (index: number, field: keyof ResearchProjectAttachment, value: string | number) => {
    setValues((prev) => {
      const next = [...prev.attachments];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, attachments: next };
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: ResearchFormValues = {
      ...values,
      slug: values.slug.trim() || '',
      members: values.members.map((member, index) => ({
        ...member,
        staffProfileId: member.staffProfileId?.trim() || undefined,
        externalName: member.externalName?.trim() || undefined,
        sortOrder: member.sortOrder ?? index,
      })),
      locations: values.locations.map((location) => ({
        ...location,
        subDistrict: location.subDistrict?.trim() || undefined,
        district: location.district?.trim() || undefined,
        province: location.province?.trim() || undefined,
      })),
      outputs: values.outputs.map((output) => ({
        ...output,
        outputType: output.outputType?.trim() || undefined,
        journalName: output.journalName?.trim() || undefined,
        publicationDate: output.publicationDate?.trim() || undefined,
        volume: output.volume?.trim() || undefined,
        issue: output.issue?.trim() || undefined,
        pages: output.pages?.trim() || undefined,
        citation: output.citation?.trim() || undefined,
        doiUrl: output.doiUrl?.trim() || undefined,
        tciUrl: output.tciUrl?.trim() || undefined,
        externalUrl: output.externalUrl?.trim() || undefined,
        tier: output.tier?.trim() || undefined,
      })),
      attachments: values.attachments.map((attachment) => ({
        ...attachment,
        fileType: attachment.fileType?.trim() || undefined,
      })),
    };
    await onSubmit(payload);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <FlaskConical className="h-7 w-7 text-primary" />
          {mode === 'create' ? 'สร้างโครงการวิจัย' : 'แก้ไขโครงการวิจัย'}
        </h1>
        <p className="text-sm text-muted-foreground">
          จัดการฐานข้อมูลงานวิจัย ผลผลิตวิชาการ พื้นที่ดำเนินงาน และสมาชิกทีมวิจัยทั้งในและนอกระบบ
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>ชื่อโครงการ (ไทย)</Label>
                <Input required value={values.titleTh} onChange={(e) => setValues((prev) => ({ ...prev, titleTh: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>ชื่อโครงการ (อังกฤษ)</Label>
                <Input value={values.titleEn} onChange={(e) => setValues((prev) => ({ ...prev, titleEn: e.target.value }))} />
              </div>
            </div>

            {/* Slug management */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="slug-input">URL Slug</Label>
                {mode === 'edit' && initialSlug && (
                  <Link
                    href={`/research/database/${initialSlug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" /> ดูหน้าเว็บ
                  </Link>
                )}
              </div>
              <Input
                id="slug-input"
                value={values.slug}
                onChange={(e) => setValues((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') }))}
                placeholder={mode === 'create' ? 'สร้างอัตโนมัติจากชื่อเมื่อบันทึก' : 'เช่น research-chiang-rai-2568'}
                className={mode === 'edit' && values.slug && values.slug !== initialSlug ? 'border-amber-400 focus-visible:ring-amber-400' : ''}
              />
              <p className="text-xs text-muted-foreground">
                URL: <code className="rounded bg-muted px-1">/research/database/{values.slug || '...'}</code>
              </p>
              {mode === 'edit' && values.slug && initialSlug && values.slug !== initialSlug && (
                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-amber-500" />
                  <div className="text-sm">
                    <p className="font-medium">คำเตือน: URL จะเปลี่ยนแปลง</p>
                    <p className="mt-0.5 text-xs opacity-80">หากเคยแชร์ลิงก์ <code>{initialSlug}</code> ไปแล้ว ลิงก์เดิมจะใช้ไม่ได้ แนะให้ต้องการแน่ใจก่อนเปลี่ยน</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>ปีงบประมาณ</Label>
                <Input type="number" required value={values.year} onChange={(e) => setValues((prev) => ({ ...prev, year: Number(e.target.value) || new Date().getFullYear() }))} />
              </div>
              <div className="space-y-2">
                <Label>งบประมาณ</Label>
                <Input value={values.budget} onChange={(e) => setValues((prev) => ({ ...prev, budget: e.target.value }))} placeholder="เช่น 250000.00" />
              </div>
              <div className="space-y-2">
                <Label>แหล่งทุน</Label>
                <Input value={values.fundingSource} onChange={(e) => setValues((prev) => ({ ...prev, fundingSource: e.target.value }))} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>สถานะโครงการ</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={values.status}
                  onChange={(e) => setValues((prev) => ({ ...prev, status: e.target.value as ResearchProjectStatus }))}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{RESEARCH_STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>รูปภาพปก</Label>
                <div className="space-y-3 rounded-md border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      {coverUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={coverUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await uploadResearchCover(file);
                          e.currentTarget.value = '';
                        }}
                      />
                    </label>
                    {values.coverImageUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={async () => {
                          const previousUrl = values.coverImageUrl;
                          setValues((prev) => ({ ...prev, coverImageUrl: '' }));
                          if (
                            previousUrl &&
                            previousUrl.startsWith('/uploads/research/') &&
                            previousUrl !== initialCoverImageUrl
                          ) {
                            await deleteResearchCover(previousUrl);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> ลบรูปภาพ
                      </Button>
                    )}
                  </div>
                  {values.coverImageUrl && (
                    <div className="space-y-2">
                      <img
                        src={getResearchPublicAssetUrl(values.coverImageUrl) || values.coverImageUrl}
                        alt="Research cover preview"
                        className="h-40 w-full rounded-md object-cover border"
                      />
                      <p className="text-xs text-muted-foreground break-all">{values.coverImageUrl}</p>
                    </div>
                  )}
                  {!values.coverImageUrl && (
                    <p className="text-xs text-muted-foreground">ยังไม่มีรูปภาพปก</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>ตัวชี้วัดเชิงยุทธศาสตร์</Label>
                <div className="grid grid-cols-2 gap-3 rounded-md border p-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={values.isSocialService} onChange={(e) => setValues((prev) => ({ ...prev, isSocialService: e.target.checked }))} />
                    งานวิจัยรับใช้สังคม
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={values.isCommercial} onChange={(e) => setValues((prev) => ({ ...prev, isCommercial: e.target.checked }))} />
                    ต่อยอดเชิงพาณิชย์
                  </label>
                  <label className="col-span-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={values.isPublished} onChange={(e) => setValues((prev) => ({ ...prev, isPublished: e.target.checked }))} />
                    เผยแพร่บนหน้า public
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>บทคัดย่อ (ไทย)</Label>
              <Textarea rows={4} value={values.abstractTh} onChange={(e) => setValues((prev) => ({ ...prev, abstractTh: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>บทคัดย่อ (อังกฤษ)</Label>
              <Textarea rows={4} value={values.abstractEn} onChange={(e) => setValues((prev) => ({ ...prev, abstractEn: e.target.value }))} />
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label>คำสำคัญ</Label>
                  <p className="text-xs text-muted-foreground">กดเพิ่มทีละคำ เพื่อใช้ใน search/filter</p>
                </div>
                <div className="flex gap-2">
                  <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} placeholder="เช่น SDGs, GIS, ชุมชน" className="w-64" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const keyword = keywordInput.trim();
                      if (!keyword) return;
                      setValues((prev) => ({ ...prev, keywords: Array.from(new Set([...prev.keywords, keyword])) }));
                      setKeywordInput('');
                    }}
                  >
                    เพิ่มคำสำคัญ
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {values.keywords.map((keyword) => (
                  <span key={keyword} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                    {keyword}
                    <button type="button" onClick={() => setValues((prev) => ({ ...prev, keywords: prev.keywords.filter((item) => item !== keyword) }))}>×</button>
                  </span>
                ))}
                {values.keywords.length === 0 && <span className="text-sm text-muted-foreground">ยังไม่มีคำสำคัญ</span>}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>SDGs</Label>
                    <button type="button" onClick={() => setShowAllSdgInfo(true)} className="text-muted-foreground hover:text-primary transition-colors" title="ดูรายละเอียด SDGs 1-17 ทั้งหมด">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">กรอกหมายเลข 1-17 แล้วเพิ่ม หรือกดไอคอน (i) ดูรายละเอียดทั้งหมด</p>
                </div>
                <div className="flex gap-2">
                  <Input type="number" min={1} max={17} value={sdgInput} onChange={(e) => setSdgInput(e.target.value)} className="w-32" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const sdg = Number(sdgInput);
                      if (!sdg || sdg < 1 || sdg > 17) return;
                      setValues((prev) => ({ ...prev, sdgIds: Array.from(new Set([...prev.sdgIds, sdg])).sort((a, b) => a - b) }));
                      setSdgInput('');
                    }}
                  >
                    เพิ่ม SDG
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {values.sdgIds.map((sdgId) => (
                  <span key={sdgId} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                    SDG {sdgId}
                    <button type="button" aria-label={`ดูคำอธิบาย SDG ${sdgId}`} onClick={() => setActiveSdgInfo(sdgId)}>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button type="button" onClick={() => setValues((prev) => ({ ...prev, sdgIds: prev.sdgIds.filter((item) => item !== sdgId) }))}>×</button>
                  </span>
                ))}
                {values.sdgIds.length === 0 && <span className="text-sm text-muted-foreground">ยังไม่ได้ระบุ SDG</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 text-primary" />สมาชิกโครงการ</h2>
                <p className="text-sm text-muted-foreground">รองรับทั้ง staff ในระบบและสมาชิกภายนอกแบบ text</p>
              </div>
              <Button type="button" variant="outline" className="gap-2" onClick={() => setValues((prev) => ({ ...prev, members: [...prev.members, emptyMember()] }))}>
                <Plus className="h-4 w-4" /> เพิ่มสมาชิก
              </Button>
            </div>
            <div className="space-y-4">
              {values.members.map((member, index) => (
                <div key={`member-${index}`} className="rounded-lg border p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label>role</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value as ResearchMemberRole)}
                      >
                        {memberRoleOptions.map((role) => (
                          <option key={role} value={role}>{RESEARCH_MEMBER_ROLE_LABELS[role]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>เลือกจากบุคลากรในระบบ</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={member.staffProfileId || ''}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setValues((prev) => {
                            const next = [...prev.members];
                            next[index] = {
                              ...next[index],
                              staffProfileId: nextValue,
                              externalName: nextValue ? '' : next[index].externalName,
                            };
                            return { ...prev, members: next };
                          });
                        }}
                      >
                        <option value="">{staffLoading ? 'กำลังโหลดรายชื่อ...' : 'ไม่เลือก / ใช้สมาชิกภายนอก'}</option>
                        {staffOptions.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {formatResearchStaffName(staff)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>ชื่อสมาชิกภายนอก</Label>
                      <Input
                        value={member.externalName || ''}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setValues((prev) => {
                            const next = [...prev.members];
                            next[index] = {
                              ...next[index],
                              externalName: nextValue,
                              staffProfileId: nextValue.trim() ? '' : next[index].staffProfileId,
                            };
                            return { ...prev, members: next };
                          });
                        }}
                        placeholder="กรอกเมื่อไม่อยู่ในระบบ staff"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ลำดับแสดงผล</Label>
                      <Input type="number" value={member.sortOrder ?? index} onChange={(e) => updateMember(index, 'sortOrder', Number(e.target.value) || 0)} />
                    </div>
                  </div>
                  {member.staffProfileId && (
                    <p className="text-xs text-muted-foreground">
                      รูปแบบชื่อที่แสดง: {formatResearchStaffName(staffOptions.find((staff) => staff.id === member.staffProfileId)) || 'รอข้อมูลบุคลากร'}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={() => setValues((prev) => ({ ...prev, members: prev.members.filter((_, itemIndex) => itemIndex !== index) }))}>
                      <Trash2 className="h-4 w-4" /> ลบสมาชิก
                    </Button>
                  </div>
                </div>
              ))}
              {values.members.length === 0 && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">ยังไม่มีสมาชิกโครงการ</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold"><MapPin className="h-5 w-5 text-primary" />พื้นที่ดำเนินการ</h2>
                <p className="text-sm text-muted-foreground">ใช้สำหรับ map และ area-based reporting</p>
              </div>
              <Button type="button" variant="outline" className="gap-2" onClick={() => setValues((prev) => ({ ...prev, locations: [...prev.locations, emptyLocation()] }))}>
                <Plus className="h-4 w-4" /> เพิ่มพื้นที่
              </Button>
            </div>
            <div className="space-y-4">
              {values.locations.map((location, index) => (
                <div key={`location-${index}`} className="rounded-lg border p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label>ตำบล</Label>
                      <Input value={location.subDistrict || ''} onChange={(e) => updateLocation(index, 'subDistrict', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>อำเภอ</Label>
                      <Input value={location.district || ''} onChange={(e) => updateLocation(index, 'district', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>จังหวัด</Label>
                      <Input value={location.province || ''} onChange={(e) => updateLocation(index, 'province', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input type="number" step="any" value={location.lat ?? ''} onChange={(e) => updateLocation(index, 'lat', e.target.value === '' ? undefined : Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input type="number" step="any" value={location.lng ?? ''} onChange={(e) => updateLocation(index, 'lng', e.target.value === '' ? undefined : Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="rounded-md border p-3 space-y-3">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                      <Input
                        value={locationMapInputs[index] || ''}
                        onChange={(e) => setLocationMapInputs((prev) => ({ ...prev, [index]: e.target.value }))}
                        placeholder="วางลิงก์ Google Maps หรือพิกัด lat,lng เพื่อดึงค่า"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          const parsed = parseGoogleMapsCoordinates(locationMapInputs[index] || '');
                          if (!parsed) {
                            alert('ไม่พบพิกัดในลิงก์ Google Maps หรือข้อความที่วาง');
                            return;
                          }
                          setValues((prev) => {
                            const next = [...prev.locations];
                            next[index] = { ...next[index], lat: parsed.lat, lng: parsed.lng };
                            return { ...prev, locations: next };
                          });
                        }}
                      >
                        <MapPinned className="h-4 w-4" /> ดึงพิกัด
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2"
                        asChild
                      >
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([
                            location.subDistrict,
                            location.district,
                            location.province,
                          ].filter(Boolean).join(' '))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" /> เปิด Google Maps
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ปักหมุดใน Google Maps แล้วคัดลอกลิงก์มาใส่ จากนั้นกด “ดึงพิกัด” ระบบจะเติม Latitude และ Longitude ให้อัตโนมัติ
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={() => setValues((prev) => ({ ...prev, locations: prev.locations.filter((_, itemIndex) => itemIndex !== index) }))}>
                      <Trash2 className="h-4 w-4" /> ลบพื้นที่
                    </Button>
                  </div>
                </div>
              ))}
              {values.locations.length === 0 && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">ยังไม่มีข้อมูลพื้นที่ดำเนินการ</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold"><FlaskConical className="h-5 w-5 text-primary" />ผลผลิตและการตีพิมพ์</h2>
                <p className="text-sm text-muted-foreground">วารสาร ประชุมวิชาการ สิทธิบัตร หรือผลผลิตวิชาการอื่น</p>
              </div>
              <Button type="button" variant="outline" className="gap-2" onClick={() => setValues((prev) => ({ ...prev, outputs: [...prev.outputs, emptyOutput()] }))}>
                <Plus className="h-4 w-4" /> เพิ่มผลผลิต
              </Button>
            </div>
            <div className="space-y-4">
              {values.outputs.map((output, index) => (
                <div key={`output-${index}`} className="rounded-lg border p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2 lg:col-span-2">
                      <Label>ชื่อผลงาน</Label>
                      <Input required value={output.title} onChange={(e) => updateOutput(index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>ประเภทผลงาน</Label>
                      <Input value={output.outputType || ''} onChange={(e) => updateOutput(index, 'outputType', e.target.value)} placeholder="Journal Article" />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <Label>ชื่อวารสาร/แหล่งเผยแพร่</Label>
                      <Input value={output.journalName || ''} onChange={(e) => updateOutput(index, 'journalName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>วันที่เผยแพร่</Label>
                      <Input type="date" value={output.publicationDate || ''} onChange={(e) => updateOutput(index, 'publicationDate', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Volume</Label>
                      <Input value={output.volume || ''} onChange={(e) => updateOutput(index, 'volume', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Issue</Label>
                      <Input value={output.issue || ''} onChange={(e) => updateOutput(index, 'issue', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pages</Label>
                      <Input value={output.pages || ''} onChange={(e) => updateOutput(index, 'pages', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tier</Label>
                      <Input value={output.tier || ''} onChange={(e) => updateOutput(index, 'tier', e.target.value)} placeholder="TCI 1 / Scopus" />
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Citation</Label>
                      <Textarea rows={3} value={output.citation || ''} onChange={(e) => updateOutput(index, 'citation', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>DOI URL</Label>
                      <Input value={output.doiUrl || ''} onChange={(e) => updateOutput(index, 'doiUrl', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>TCI URL</Label>
                      <Input value={output.tciUrl || ''} onChange={(e) => updateOutput(index, 'tciUrl', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>External URL</Label>
                      <Input value={output.externalUrl || ''} onChange={(e) => updateOutput(index, 'externalUrl', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={() => setValues((prev) => ({ ...prev, outputs: prev.outputs.filter((_, itemIndex) => itemIndex !== index) }))}>
                      <Trash2 className="h-4 w-4" /> ลบผลผลิต
                    </Button>
                  </div>
                </div>
              ))}
              {values.outputs.length === 0 && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">ยังไม่มีผลผลิตวิจัย</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5 text-primary" />เอกสารแนบ</h2>
                <p className="text-sm text-muted-foreground">สามารถอัปโหลดไฟล์ลงเซิร์ฟเวอร์หรือวางลิงก์ภายนอกได้</p>
              </div>
              <Button type="button" variant="outline" className="gap-2" onClick={() => setValues((prev) => ({ ...prev, attachments: [...prev.attachments, emptyAttachment()] }))}>
                <Plus className="h-4 w-4" /> เพิ่มเอกสาร
              </Button>
            </div>
            <div className="space-y-4">
              {values.attachments.map((attachment, index) => (
                <div key={`attachment-${index}`} className="rounded-lg border p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>ชื่อไฟล์</Label>
                      <Input value={attachment.fileName} onChange={(e) => updateAttachment(index, 'fileName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>ประเภทไฟล์</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={attachment.fileType || ''}
                        onChange={(e) => updateAttachment(index, 'fileType', e.target.value as ResearchAttachmentType)}
                      >
                        <option value="">ไม่ระบุประเภท</option>
                        {(Object.entries(RESEARCH_ATTACHMENT_TYPE_LABELS) as [ResearchAttachmentType, string][]).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <Label>อัปโหลดเอกสาร / File URL</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={attachment.fileUrl} 
                          onChange={(e) => updateAttachment(index, 'fileUrl', e.target.value)} 
                          placeholder="/uploads/research/... หรือ external URL"
                          className="flex-1"
                        />
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90">
                          {attachmentUploading[index] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          <input
                            type="file"
                            className="hidden"
                            disabled={attachmentUploading[index]}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              await uploadResearchAttachment(file, index);
                              e.currentTarget.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>จำนวนดาวน์โหลดตั้งต้น</Label>
                      <Input type="number" min={0} value={attachment.downloadCount ?? 0} onChange={(e) => updateAttachment(index, 'downloadCount', Number(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="gap-2 text-destructive hover:text-destructive" 
                      onClick={async () => {
                        const attach = values.attachments[index];
                        if (attach.fileUrl && attach.fileUrl.startsWith('/uploads/research/')) {
                          await deleteResearchAttachment(attach.fileUrl);
                        }
                        setValues((prev) => ({ ...prev, attachments: prev.attachments.filter((_, itemIndex) => itemIndex !== index) }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> ลบเอกสาร
                    </Button>
                  </div>
                </div>
              ))}
              {values.attachments.length === 0 && <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">ยังไม่มีเอกสารแนบ</div>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button asChild type="button" variant="ghost">
            <Link href="/admin/research">ยกเลิก</Link>
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === 'create' ? 'บันทึกโครงการ' : 'บันทึกการแก้ไข'}
          </Button>
        </div>
      </form>

      <Dialog open={activeSdgInfo !== null} onOpenChange={(open) => { if (!open) setActiveSdgInfo(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeSdgInfo ? `SDG ${activeSdgInfo}: ${RESEARCH_SDG_DESCRIPTIONS[activeSdgInfo]?.title || ''}` : 'คำอธิบาย SDG'}
            </DialogTitle>
            <DialogDescription>
              {activeSdgInfo ? RESEARCH_SDG_DESCRIPTIONS[activeSdgInfo]?.description : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setActiveSdgInfo(null)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAllSdgInfo} onOpenChange={setShowAllSdgInfo}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียด SDGs ทั้ง 17 เป้าหมาย</DialogTitle>
            <DialogDescription>
              เป้าหมายการพัฒนาที่ยั่งยืน (Sustainable Development Goals)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(RESEARCH_SDG_DESCRIPTIONS).map(([id, sdg]) => (
              <div key={id} className="flex gap-4 p-4 rounded-lg border bg-base-50/50">
                <div className="flex-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {id}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base-content">{sdg.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sdg.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAllSdgInfo(false)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
