'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ACADEMIC_SERVICE_TYPES, ACADEMIC_SERVICE_STATUSES } from '@/lib/academic-services';
import { toast } from 'sonner';
import {
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  X,
  Loader2,
  ExternalLink,
  Coins,
  MapPin,
  Users,
  Target,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Save,
  Info,
} from 'lucide-react';
import { RESEARCH_SDG_DESCRIPTIONS, SDG_COLORS } from '@/lib/research';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const formatStaffName = (staff: any) => {
  if (!staff) return '';
  const prefix = staff.prefix || '';
  const firstName = staff.firstNameTh || '';
  const lastName = staff.lastNameTh || '';
  return `${prefix}${firstName} ${lastName}`.trim();
};

export default function AcademicServiceForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [staffOptions, setStaffOptions] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: 'SOCIAL_SERVICE',
    area: '',
    status: 'ONGOING',
    coverImageUrl: '',
    galleryImages: [] as string[],
    isPublished: true,
    budget: '',
    fundingSource: '',
    sdgIds: [] as number[],
    documentUrl: '',
    members: [] as { staffId: string; role: string }[],
  });

  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/staff?page=1&limit=200`);
        if (res.ok) {
          const json = await res.json();
          setStaffOptions(json.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setStaffLoading(false);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        serviceType: initialData.serviceType || 'SOCIAL_SERVICE',
        area: initialData.area || '',
        status: initialData.status || 'ONGOING',
        coverImageUrl: initialData.coverImageUrl || '',
        galleryImages: initialData.galleryImages || [],
        isPublished: initialData.isPublished ?? true,
        budget: initialData.budget || '',
        fundingSource: initialData.fundingSource || '',
        sdgIds: initialData.sdgIds || [],
        documentUrl: initialData.documentUrl || '',
        members: initialData.members || [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const deleteNewsFileOnServer = async (url: string) => {
    if (!url) return;
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${API_URL}/api/upload/news`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
    } catch (err) {
      console.error('Failed to delete file on server:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('admin_token');
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload/news`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, coverImageUrl: data.url }));
        toast.success('อัปโหลดรูปภาพหน้าปกเสร็จสมบูรณ์');
      } else {
        toast.error('อัปโหลดรูปภาพล้มเหลว');
      }
    } catch (err) {
      console.error('Upload error', err);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    const oldUrl = formData.coverImageUrl;
    setFormData((prev) => ({ ...prev, coverImageUrl: '' }));
    if (oldUrl) {
      await deleteNewsFileOnServer(oldUrl);
      toast.success('ลบรูปภาพหน้าปกเรียบร้อยแล้ว');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem('admin_token');

    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadData = new FormData();
        uploadData.append('file', file);

        const res = await fetch(`${API_URL}/api/upload/news`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });

        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newImages],
      }));
      toast.success(`อัปโหลดรูปแกลเลอรีสำเร็จ ${newImages.length} ภาพ`);
    } catch (err) {
      console.error('Gallery upload error', err);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพแกลเลอรี');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = async (indexToRemove: number) => {
    const oldUrl = formData.galleryImages[indexToRemove];
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== indexToRemove),
    }));
    if (oldUrl) {
      await deleteNewsFileOnServer(oldUrl);
      toast.success('ลบรูปภาพแกลเลอรีเรียบร้อยแล้ว');
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('admin_token');
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload/news/attachment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, documentUrl: data.fileUrl }));
        toast.success('อัปโหลดไฟล์เอกสารประกอบโครงการเสร็จสมบูรณ์');
      } else {
        toast.error('อัปโหลดไฟล์เอกสารล้มเหลว');
      }
    } catch (err) {
      console.error('Document upload error', err);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์เอกสาร');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = async () => {
    const oldUrl = formData.documentUrl;
    setFormData((prev) => ({ ...prev, documentUrl: '' }));
    if (oldUrl) {
      await deleteNewsFileOnServer(oldUrl);
      toast.success('ลบไฟล์เอกสารเรียบร้อยแล้ว');
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'กรุณากรอกชื่อโครงการบริการวิชาการ';
    }
    if (!formData.serviceType) {
      errs.serviceType = 'กรุณาเลือกประเภทงานบริการ';
    }
    if (!formData.status) {
      errs.status = 'กรุณาเลือกสถานะโครงการ';
    }
    if (formData.budget && Number.isNaN(Number(formData.budget))) {
      errs.budget = 'งบประมาณต้องเป็นตัวเลขที่ถูกต้องเท่านั้น';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('กรุณาตรวจสอบข้อมูลที่จำเป็นในแบบฟอร์ม');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const url = initialData
        ? `${API_URL}/api/academic-services/${initialData.id}`
        : `${API_URL}/api/academic-services`;

      const cleanMembers = formData.members.filter((m) => m.staffId);

      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          members: cleanMembers,
          publishedAt:
            formData.isPublished && !initialData?.publishedAt
              ? new Date().toISOString()
              : initialData?.publishedAt,
        }),
      });

      if (res.ok) {
        toast.success('บันทึกข้อมูลบริการวิชาการเรียบร้อยแล้ว');
        router.push('/admin/academic-services');
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 0. FORM TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-sm gap-1.5 text-xs">
            <Link href="/admin/academic-services">
              <ArrowLeft className="h-3.5 w-3.5" /> กลับรายการ
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {initialData ? 'แก้ไขโครงการบริการวิชาการ' : 'เพิ่มโครงการบริการวิชาการใหม่'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {initialData && (
            <Button asChild variant="ghost" size="sm" className="rounded-sm text-xs gap-1.5 text-muted-foreground hover:text-foreground">
              <Link href={`/research/services/${initialData.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> ดูหน้าเว็บจริง
              </Link>
            </Button>
          )}

          <Button
            type="submit"
            disabled={saving || uploading}
            className="rounded-sm gap-1.5 text-xs font-semibold px-5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MAIN INFORMATION (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: ข้อมูลทั่วไปของโครงการ */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> ข้อมูลทั่วไปของโครงการ
              </CardTitle>
              <CardDescription className="text-xs">
                ระบุชื่อโครงการ ประเภทงานบริการ และสถานะการดำเนินงาน
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  ชื่อโครงการ / กิจกรรมบริการวิชาการ <span className="text-destructive">*</span>
                </Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="เช่น โครงการส่งเสริมและยกระดับเศรษฐกิจชุมชนฐานราก..."
                  className={`rounded-sm h-10 text-sm ${
                    validationErrors.title ? 'border-destructive focus-visible:ring-destructive' : ''
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {validationErrors.title}
                  </p>
                )}
              </div>

              {/* Service Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    ประเภทงานบริการ <span className="text-destructive">*</span>
                  </Label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {ACADEMIC_SERVICE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    สถานะโครงการ <span className="text-destructive">*</span>
                  </Label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {ACADEMIC_SERVICE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-scholar-accent" /> พื้นที่ดำเนินการ (Target Area / Community)
                </Label>
                <Input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="เช่น ต.บ้านดู่ อ.เมือง จ.เชียงราย หรือ ชุมชนลุ่มน้ำกก"
                  className="rounded-sm h-10 text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">รายละเอียดโครงการและเป้าหมาย</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="flex w-full rounded-sm border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring leading-relaxed"
                  placeholder="อธิบายรายละเอียดผลการดำเนินงาน กลุ่มเป้าหมาย หรือวัตถุประสงค์ของโครงการ..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: SDGs Mapping */}
          {/* CARD 2: SDGs Mapping with Tooltips and Concise Descriptions */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> เป้าหมายความยั่งยืนที่เกี่ยวข้อง (SDGs Mapping)
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    เลือกเป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs 1-17) ที่โครงการนี้ร่วมขับเคลื่อน (ชี้เมาส์เพื่อดูคำอธิบายย่อ)
                  </CardDescription>
                </div>
                {formData.sdgIds.length > 0 && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-sm shrink-0 self-start sm:self-center">
                    เลือกแล้ว {formData.sdgIds.length} เป้าหมาย
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => {
                  const isChecked = formData.sdgIds.includes(num);
                  const sdg = RESEARCH_SDG_DESCRIPTIONS[num] || { title: `SDG ${num}`, description: '' };
                  const color = SDG_COLORS[num];

                  return (
                    <label
                      key={num}
                      title={`${sdg.title}\n${sdg.description}`}
                      className={`relative flex items-center justify-between p-2.5 border rounded-sm cursor-pointer select-none text-xs transition-all group ${
                        isChecked
                          ? 'bg-primary/10 border-primary text-primary font-bold shadow-2xs'
                          : 'bg-background hover:bg-muted/40 border-input text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1 flex-grow">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="h-3.5 w-3.5 rounded-sm shrink-0"
                          onChange={() => {
                            setFormData((prev) => {
                              const nextSdg = prev.sdgIds.includes(num)
                                ? prev.sdgIds.filter((id) => id !== num)
                                : [...prev.sdgIds, num];
                              return { ...prev, sdgIds: nextSdg };
                            });
                          }}
                        />
                        <div className="min-w-0 flex items-center gap-1.5 flex-grow">
                          <span
                            className="inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-2xs shrink-0"
                            style={{
                              backgroundColor: color ? `${color.hex}20` : '#f1f5f9',
                              color: color ? color.hex : '#334155',
                            }}
                          >
                            SDG {num}
                          </span>
                          <span className="font-semibold text-slate-800 text-[11px] truncate flex-grow">
                            {sdg.title}
                          </span>
                        </div>
                      </div>

                      {/* Tooltip trigger icon */}
                      <span
                        className="text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0 ml-1"
                        title={`${sdg.title}: ${sdg.description}`}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Selected SDGs Quick Summary Pills */}
              {formData.sdgIds.length > 0 && (
                <div className="pt-3 border-t flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-muted-foreground mr-1">เป้าหมายที่เลือก:</span>
                  {formData.sdgIds.sort((a, b) => a - b).map((num) => {
                    const sdg = RESEARCH_SDG_DESCRIPTIONS[num];
                    return (
                      <span
                        key={num}
                        title={sdg?.description}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-muted text-[11px] font-medium border"
                      >
                        <strong className="text-primary">SDG {num}</strong>
                        <span className="text-muted-foreground text-[10px]">{sdg?.title}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 3: คณะทำงานและอาจารย์ผู้รับผิดชอบ */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> คณะทำงานผู้รับผิดชอบโครงการ
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  ระบุอาจารย์หรือบุคลากรของคณะที่เป็นหัวหน้าโครงการและผู้ร่วมงาน
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-sm text-xs"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    members: [...prev.members, { staffId: '', role: 'MEMBER' }],
                  }));
                }}
              >
                <Plus className="h-3.5 w-3.5" /> เพิ่มบุคลากร
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {formData.members.length === 0 ? (
                <div className="p-6 border-dashed border-2 rounded-sm text-center text-muted-foreground text-xs">
                  ยังไม่ได้ระบุรายชื่อคณะทำงาน คลิกปุ่ม &quot;เพิ่มบุคลากร&quot; ด้านบนเพื่อระบุผู้รับผิดชอบ
                </div>
              ) : (
                formData.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-muted/30 border rounded-sm"
                  >
                    <div className="flex-grow w-full space-y-1">
                      <Label className="text-[11px] text-muted-foreground">อาจารย์ / บุคลากร</Label>
                      <select
                        value={member.staffId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const nextMembers = [...prev.members];
                            nextMembers[index] = { ...nextMembers[index], staffId: val };
                            return { ...prev, members: nextMembers };
                          });
                        }}
                        className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">-- เลือกอาจารย์/บุคลากร --</option>
                        {staffOptions.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {formatStaffName(staff)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-48 space-y-1">
                      <Label className="text-[11px] text-muted-foreground">บทบาทในโครงการ</Label>
                      <select
                        value={member.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const nextMembers = [...prev.members];
                            nextMembers[index] = { ...nextMembers[index], role: val };
                            return { ...prev, members: nextMembers };
                          });
                        }}
                        className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="LEADER">หัวหน้าโครงการ (Leader)</option>
                        <option value="CO_LEADER">รองหัวหน้าโครงการ (Co-Leader)</option>
                        <option value="RESEARCHER">นักวิจัย/วิทยากร (Researcher)</option>
                        <option value="MEMBER">ผู้ร่วมโครงการ (Member)</option>
                      </select>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end sm:self-end h-9 w-9 text-destructive hover:bg-destructive/10 rounded-sm shrink-0"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          members: prev.members.filter((_, i) => i !== index),
                        }));
                      }}
                      title="ลบรายชื่อ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* CARD 4: แกลเลอรีรูปภาพกิจกรรม */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" /> คลังภาพกิจกรรมในพื้นที่ (Gallery)
              </CardTitle>
              <CardDescription className="text-xs">
                อัปโหลดรูปภาพบรรยากาศการดำเนินงานเพิ่มเติม (สามารถเลือกอัปโหลดหลายภาพพร้อมกันได้)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploading}
                  className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
              </div>

              {formData.galleryImages && formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formData.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video rounded-sm overflow-hidden border group">
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-destructive text-white p-1 rounded-sm text-xs transition-colors"
                        title="ลบภาพนี้"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: BUDGET & MEDIA & SETTINGS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 5: การเผยแพร่ (Publishing Status) */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold">การเผยแพร่ (Publishing)</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <label className="flex items-center gap-3 p-3 bg-muted/30 border rounded-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 rounded-sm"
                />
                <div>
                  <span className="text-xs font-bold block text-foreground">เผยแพร่สู่สาธารณะทันที</span>
                  <span className="text-[11px] text-muted-foreground">
                    เปิดให้ประชาชนและหน่วยงานทั่วไปมองเห็นหน้านี้
                  </span>
                </div>
              </label>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={saving || uploading}
                  className="w-full rounded-sm gap-2 text-xs font-semibold h-10"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกโครงการ'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CARD 6: งบประมาณและแหล่งทุน */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-500" /> งบประมาณและแหล่งทุน
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">งบประมาณโครงการ (บาท)</Label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="เช่น 150000"
                  className={`rounded-sm h-9 text-xs ${
                    validationErrors.budget ? 'border-destructive focus-visible:ring-destructive' : ''
                  }`}
                />
                {validationErrors.budget && (
                  <p className="text-[11px] text-destructive">{validationErrors.budget}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">แหล่งที่มาของงบประมาณ</Label>
                <Input
                  name="fundingSource"
                  value={formData.fundingSource}
                  onChange={handleChange}
                  placeholder="เช่น งบแผ่นดิน, งบรายได้คณะ"
                  className="rounded-sm h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 7: ภาพหน้าปก (Cover Image) */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" /> ภาพหน้าปก (Cover Image)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {formData.coverImageUrl ? (
                <div className="relative aspect-video rounded-sm overflow-hidden border group">
                  <img src={formData.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-destructive text-white p-1 rounded-sm text-xs transition-colors"
                    title="ลบภาพหน้าปก"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-video bg-muted/40 rounded-sm border-dashed border-2 flex items-center justify-center text-muted-foreground text-xs">
                  ยังไม่มีรูปภาพหน้าปก
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
              <p className="text-[10px] text-muted-foreground">แนะนำภาพสัดส่วน 16:9 ขนาดไม่เกิน 5MB</p>
            </CardContent>
          </Card>

          {/* CARD 8: เอกสารรายงานประกอบโครงการ (PDF Attachment) */}
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-600" /> เอกสารรายงานสรุปผล (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {formData.documentUrl ? (
                <div className="flex items-center gap-2.5 p-3 bg-red-50/40 rounded-sm border border-red-200/60 text-xs">
                  <span className="font-bold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded-sm">PDF</span>
                  <a
                    href={formData.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-700 font-medium hover:underline truncate flex-grow"
                  >
                    ดูไฟล์เอกสารที่อัปโหลด
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveDocument}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded-sm"
                    title="ลบไฟล์"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-muted/20 border-dashed border rounded-sm text-center text-muted-foreground text-xs">
                  ยังไม่มีไฟล์เอกสารแนบ
                </div>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleDocumentUpload}
                disabled={uploading}
                className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3.5 file:rounded-sm file:border file:border-red-200 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-600 hover:file:text-white hover:file:border-red-600 cursor-pointer transition-all duration-150"
              />
              <p className="text-[10px] text-muted-foreground">รองรับไฟล์ .PDF ขนาดไม่เกิน 10MB</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
