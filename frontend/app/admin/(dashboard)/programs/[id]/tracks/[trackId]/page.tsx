'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Plus,
  Layers,
  Image as ImageIcon,
  FileText,
  ShieldAlert,
  Share2,
  Video,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function TrackEditorPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  const trackId = params.trackId as string;
  const isNew = trackId === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [parentProgram, setParentProgram] = useState<any>(null);

  const [formData, setFormData] = useState({
    code: '',
    name_th: '',
    name_en: '',
    track_type: 'MAJOR' as 'MAJOR' | 'CONCENTRATION' | 'MINOR',
    study_plan_type: 'REGULAR_4YR' as 'REGULAR_4YR' | 'TRANSFER_2YR' | 'GRADUATE',
    degree_title_th: '',
    degree_title_en: '',
    description: '',
    admission_status: '',
    banner_url: '',
    curriculum_url: '',
    youtube_video_url: '',
    facebook_video_url: '',
    social_links: {
      facebook: '',
      tiktok: '',
      instagram: '',
      youtube: '',
      line: '',
    },
    gallery_images: [] as string[],
    attachments: [] as { originalName: string; fileUrl: string; size?: number; mimeType?: string }[],
    careers: [] as string[],
    highlights: [] as { title: string; description: string }[],
    structure: {
      totalCredits: 0,
      general: 0,
      major: 0,
      freeElective: 0,
    },
    sort_order: 0,
    is_active: true,
  });

  const [newCareer, setNewCareer] = useState('');
  const [newHighlight, setNewHighlight] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const token = localStorage.getItem('admin_token');

        // 1. Fetch current user profile for RBAC
        let userObj: any = null;
        if (token) {
          try {
            const profRes = await fetch(`${API_URL}/api/auth/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (profRes.ok) {
              userObj = await profRes.json();
              setCurrentUser(userObj);
            }
          } catch (e) {
            console.error('Failed to load profile', e);
          }
        }

        // 2. Fetch Parent Program
        const progRes = await fetch(`${API_URL}/api/programs/${programId}`);
        if (progRes.ok) {
          const pData = await progRes.json();
          setParentProgram(pData);
        }

        // 3. Fetch Existing Track data if not new
        if (!isNew) {
          const trackRes = await fetch(`${API_URL}/api/programs/tracks/${trackId}`);
          if (trackRes.ok) {
            const t = await trackRes.json();
            setFormData({
              code: t.code || '',
              name_th: t.nameTh || '',
              name_en: t.nameEn || '',
              track_type: t.trackType || 'MAJOR',
              study_plan_type: t.studyPlanType || 'REGULAR_4YR',
              degree_title_th: t.degreeTitleTh || '',
              degree_title_en: t.degreeTitleEn || '',
              description: t.description || '',
              admission_status: t.admissionStatus || '',
              banner_url: t.bannerUrl || '',
              curriculum_url: t.curriculumUrl || '',
              youtube_video_url: t.youtubeVideoUrl || '',
              facebook_video_url: t.facebookVideoUrl || '',
              social_links: t.socialLinks || {
                facebook: '',
                tiktok: '',
                instagram: '',
                youtube: '',
                line: '',
              },
              gallery_images: t.galleryImages || [],
              attachments: t.attachments || [],
              careers: t.careers || [],
              highlights: t.highlights || [],
              structure: t.structure || { totalCredits: 0, general: 0, major: 0, freeElective: 0 },
              sort_order: t.sortOrder ?? 0,
              is_active: t.isActive ?? true,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching track context:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
  }, [programId, trackId, isNew]);

  const isSuperAdmin = currentUser?.roles?.includes('ADMIN');
  const isDeptStaff = currentUser?.roles?.includes('STAFF') || currentUser?.roles?.includes('EDITOR');
  const hasEditPermission =
    isSuperAdmin ||
    (isDeptStaff && (!parentProgram?.departmentId || parentProgram?.departmentId === currentUser?.departmentId));

  const deleteManagedFile = async (url: string) => {
    if (!url?.startsWith('/uploads/programs/')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${API_URL}/api/upload/programs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error('Error deleting managed file:', error);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'banner_url' | 'curriculum_url',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('admin_token');
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload/programs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        if (formData[field]) {
          await deleteManagedFile(formData[field]);
        }
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      } else {
        alert('อัปโหลดไฟล์ไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('ไม่สามารถอัปโหลดไฟล์ได้');
    }
  };

  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const token = localStorage.getItem('admin_token');
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API_URL}/api/upload/programs`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      }
      setFormData((p) => ({
        ...p,
        gallery_images: [...p.gallery_images, ...newUrls],
      }));
    } catch (error) {
      console.error('Multi Upload Error:', error);
      alert('บางไฟล์อัปโหลดไม่สำเร็จ');
    }
  };

  const removeGalleryImage = async (indexToRemove: number) => {
    const targetUrl = formData.gallery_images[indexToRemove];
    if (targetUrl) {
      await deleteManagedFile(targetUrl);
    }
    setFormData((p) => ({
      ...p,
      gallery_images: p.gallery_images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    if (!hasEditPermission) {
      alert('คุณไม่มีสิทธิ์แก้ไขแขนงวิชานี้เนื่องจากสังกัดอยู่คนละสาขาวิชา');
      return;
    }

    if (!formData.code || !formData.name_th) {
      alert('กรุณากรอกรหัสแขนงวิชา (Code Slug) และชื่อภาษาไทยให้ครบถ้วน');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const payload = {
        code: formData.code.trim().toLowerCase(),
        name_th: formData.name_th.trim(),
        name_en: formData.name_en.trim() || null,
        track_type: formData.track_type,
        study_plan_type: formData.study_plan_type,
        degree_title_th: formData.degree_title_th.trim() || null,
        degree_title_en: formData.degree_title_en.trim() || null,
        description: formData.description,
        admission_status: formData.admission_status.trim() || null,
        banner_url: formData.banner_url || null,
        curriculum_url: formData.curriculum_url || null,
        youtube_video_url: formData.youtube_video_url || formData.social_links.youtube || null,
        facebook_video_url: formData.facebook_video_url || formData.social_links.facebook || null,
        social_links: formData.social_links,
        gallery_images: formData.gallery_images,
        attachments: formData.attachments,
        careers: formData.careers,
        highlights: formData.highlights,
        structure: formData.structure,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      };

      const url = isNew
        ? `${API_URL}/api/programs/${programId}/tracks`
        : `${API_URL}/api/programs/tracks/${trackId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`เกิดข้อผิดพลาดในการบันทึกแขนงวิชา: ${err}`);
        setSaving(false);
        return;
      }

      router.push(`/admin/programs/${programId}`);
      router.refresh();
    } catch (err) {
      console.error('Error saving track:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแขนงวิชา "${formData.name_th}"?`)) {
      return;
    }

    setDeleting(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/programs/tracks/${trackId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        router.push(`/admin/programs/${programId}`);
        router.refresh();
      } else {
        alert('ไม่สามารถลบแขนงวิชาได้');
      }
    } catch (err) {
      console.error('Error deleting track:', err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">กำลังโหลดข้อมูลแขนงวิชา...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/programs/${programId}`)}
            title="ย้อนกลับไปยังหลักสูตรหลัก"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {parentProgram?.nameTh || 'สาขาวิชา'}
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs font-medium text-muted-foreground">
                {formData.study_plan_type === 'TRANSFER_2YR' ? 'แผนเทียบโอน 2 ปีหลัง' : 'แผน 4 ปีปกติ'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {isNew ? 'เพิ่มแขนงวิชา / วิชาเอกใหม่' : `แก้ไขแขนงวิชา: ${formData.name_th}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting || !hasEditPermission}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? 'กำลังลบ...' : 'ลบแขนงวิชา'}</span>
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={saving || !hasEditPermission}
            className="gap-2 bg-primary text-white"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลแขนงวิชา'}</span>
          </Button>
        </div>
      </div>

      {/* Scope Warning Banner if staff is from another department */}
      {!hasEditPermission && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3 text-amber-900 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">จำกัดสิทธิ์การแก้ไข (Read-Only Mode)</p>
            <p className="text-xs text-amber-800 mt-0.5">
              คุณสังกัดสาขาวิชา ID: {currentUser?.departmentId} จึงไม่สามารถแก้ไขข้อมูลของแขนงวิชาในสาขาอื่นได้
            </p>
          </div>
        </div>
      )}

      {/* 1. Identity & Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>1. ข้อมูลพื้นฐานและการจำแนกประเภท</span>
          </CardTitle>
          <CardDescription>
            กำหนดชื่อ รหัสอ้างอิง URL และรูปแบบแผนการศึกษาของแขนงวิชาหรือวิชาเอกนี้
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="track_code">รหัส URL Slug ของแขนงวิชา*</Label>
              <Input
                id="track_code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    code: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  }))
                }
                placeholder="เช่น culinary-and-service, sociology-anthropology"
              />
              <p className="text-[11px] text-muted-foreground">
                จะใช้เป็น URL: /programs/{parentProgram?.code || '...'}/{formData.code || '[code]'}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="track_name_th">ชื่อแขนงวิชา / วิชาเอก (ภาษาไทย)*</Label>
              <Input
                id="track_name_th"
                value={formData.name_th}
                onChange={(e) => setFormData((p) => ({ ...p, name_th: e.target.value }))}
                placeholder="เช่น วิชาเอกการประกอบอาหารและบริการ หรือ แขนงวิชาสังคมวิทยาและมานุษยวิทยา"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="track_name_en">ชื่อแขนงวิชา (English)</Label>
              <Input
                id="track_name_en"
                value={formData.name_en}
                onChange={(e) => setFormData((p) => ({ ...p, name_en: e.target.value }))}
                placeholder="เช่น Culinary and Service"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track_type">ประเภทแขนงวิชา*</Label>
              <select
                id="track_type"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={formData.track_type}
                onChange={(e) => setFormData((p) => ({ ...p, track_type: e.target.value as any }))}
              >
                <option value="MAJOR">วิชาเอก (Major)</option>
                <option value="CONCENTRATION">แขนงวิชา (Concentration)</option>
                <option value="MINOR">วิชาโท (Minor)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="study_plan_type">รูปแบบแผนการศึกษา*</Label>
              <select
                id="study_plan_type"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                value={formData.study_plan_type}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, study_plan_type: e.target.value as any }))
                }
              >
                <option value="REGULAR_4YR">แผน 4 ปี ปกติ (รับ ม.6 / ปวช.)</option>
                <option value="TRANSFER_2YR">แผนเทียบโอน 2 ปีหลัง (รับ ปวส.)</option>
                <option value="GRADUATE">ระดับบัณฑิตศึกษา (ป.โท / ป.เอก)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor="degree_title_th">ชื่อย่อวุฒิการศึกษาเฉพาะแขนง (ภาษาไทย)</Label>
              <Input
                id="degree_title_th"
                value={formData.degree_title_th}
                onChange={(e) => setFormData((p) => ({ ...p, degree_title_th: e.target.value }))}
                placeholder="เช่น ศศ.บ. (คหกรรมศาสตร์) หรือ ศศ.บ. (สังคมศาสตร์)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree_title_en">ชื่อย่อวุฒิการศึกษาเฉพาะแขนง (English)</Label>
              <Input
                id="degree_title_en"
                value={formData.degree_title_en}
                onChange={(e) => setFormData((p) => ({ ...p, degree_title_en: e.target.value }))}
                placeholder="เช่น B.A. (Home Economics)"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="track_description">คำอธิบายและจุดมุ่งหมายของแขนงวิชา</Label>
            <Textarea
              id="track_description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="ระบุแนวคิดการจัดการศึกษา อัตลักษณ์ ทักษะเฉพาะทางที่นักศึกษาจะได้รับ..."
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Admission Status Specific to Track */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>2. สถานะการรับสมัครเฉพาะแขนง (Admission Status)</span>
          </CardTitle>
          <CardDescription>
            กำหนดข้อความแจ้งสถานะการรับสมัครที่แถบหัวข้อของหน้าแขนงวิชานี้ (หากเว้นว่าง ระบบจะดึงจากหลักสูตรหลักอัตโนมัติ)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                formData.admission_status?.includes('ปิด')
                  ? 'bg-rose-500'
                  : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <Input
              value={formData.admission_status}
              onChange={(e) => setFormData((p) => ({ ...p, admission_status: e.target.value }))}
              placeholder={`ค่าเริ่มต้นจากหลักสูตรหลัก: ${parentProgram?.admissionStatus || 'เปิดรับสมัครรอบปัจจุบัน (กู้ยืม กยศ. ได้ 100%)'}`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ตัวอย่าง: &quot;เปิดรับสมัครรอบปัจจุบัน (กู้ยืม กยศ. ได้ 100%)&quot; หรือ &quot;เปิดรับสมัครรอบโควตา 2 ปีหลัง (ปวส.)&quot;
          </p>
        </CardContent>
      </Card>

      {/* 3. Dedicated PR Media, Gallery & Social Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <span>3. สื่อประชาสัมพันธ์ รูปภาพแกลเลอรี และช่องทางโซเชียลเฉพาะแขนง</span>
          </CardTitle>
          <CardDescription>
            จุดเด่นสำคัญ: แต่ละแขนงวิชา/วิชาเอกสามารถมีรูปภาพ แกลเลอรีผลงาน และช่องทาง TikTok/FB เฉพาะตัวได้
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Banner & Video URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>รูปภาพ Banner แขนงวิชา</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.banner_url}
                  onChange={(e) => setFormData((p) => ({ ...p, banner_url: e.target.value }))}
                  placeholder="https://... หรืออัปโหลดภาพ"
                />
                <div className="relative shrink-0">
                  <Button variant="outline" type="button" className="cursor-pointer pointer-events-none">
                    <Upload className="w-4 h-4 mr-1" /> อัปโหลด
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'banner_url')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>ไฟล์เล่มหลักสูตรเฉพาะแขนง (PDF Curriculum)</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.curriculum_url}
                  onChange={(e) => setFormData((p) => ({ ...p, curriculum_url: e.target.value }))}
                  placeholder="https://... หรืออัปโหลด PDF"
                />
                <div className="relative shrink-0">
                  <Button variant="outline" type="button" className="cursor-pointer pointer-events-none">
                    <Upload className="w-4 h-4 mr-1" /> อัปโหลด
                  </Button>
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'curriculum_url')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels Dedicated to Track */}
          <div className="p-4 bg-slate-50 border rounded-lg space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" />
              <span>ช่องทางโซเชียลมีเดียเฉพาะแขนงวิชา / เพจประจำแล็บ</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">TikTok แขนงวิชา (เช่น ครัวคหกรรม, นักพัฒนา)</Label>
                <Input
                  value={formData.social_links.tiktok || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      social_links: { ...p.social_links, tiktok: e.target.value },
                    }))
                  }
                  placeholder="https://www.tiktok.com/@..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Facebook Page ประจำแขนงวิชา</Label>
                <Input
                  value={formData.social_links.facebook || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      social_links: { ...p.social_links, facebook: e.target.value },
                    }))
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Instagram แขนงวิชา</Label>
                <Input
                  value={formData.social_links.instagram || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      social_links: { ...p.social_links, instagram: e.target.value },
                    }))
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Line Official ประจำแขนงวิชา</Label>
                <Input
                  value={formData.social_links.line || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      social_links: { ...p.social_links, line: e.target.value },
                    }))
                  }
                  placeholder="https://line.me/ti/p/@..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิดีโอแนะนำแขนงวิชา (YouTube Video URL)</Label>
                <Input
                  value={formData.youtube_video_url}
                  onChange={(e) => setFormData((p) => ({ ...p, youtube_video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">วิดีโอ Facebook Reels / Clip URL</Label>
                <Input
                  value={formData.facebook_video_url}
                  onChange={(e) => setFormData((p) => ({ ...p, facebook_video_url: e.target.value }))}
                  placeholder="https://www.facebook.com/watch?v=..."
                />
              </div>
            </div>
          </div>

          {/* Multi-Image Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>แกลเลอรีภาพกิจกรรมและผลงานเฉพาะแขนง</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  อัปโหลดรูปภาพกิจกรรม การฝึกปฏิบัติ หรือบรรยากาศแล็บของแขนงวิชานี้ (เลือกได้หลายภาพพร้อมกัน)
                </p>
              </div>

              <div className="relative">
                <Button variant="outline" size="sm" type="button" className="cursor-pointer pointer-events-none gap-1.5">
                  <Upload className="w-4 h-4" /> เพิ่มรูปภาพแกลเลอรี
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleMultiFileUpload}
                />
              </div>
            </div>

            {formData.gallery_images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-slate-50 border rounded-lg">
                {formData.gallery_images.map((url, idx) => {
                  const fullUrl = url.startsWith('/') ? `${API_URL}${url}` : url;
                  return (
                    <div key={idx} className="relative group aspect-square rounded-md overflow-hidden bg-slate-200 border">
                      <Image
                        src={fullUrl}
                        alt={`ภาพกิจกรรม ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="ลบรูปภาพนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed rounded-lg text-xs text-muted-foreground bg-slate-50/50">
                ยังไม่มีรูปภาพในแกลเลอรีของแขนงวิชานี้ สามารถกดปุ่ม &quot;เพิ่มรูปภาพแกลเลอรี&quot; ด้านบนเพื่ออัปโหลด
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. Curriculum Structure, Credits & Careers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>4. โครงสร้างหน่วยกิต จุดเด่น และเส้นทางอาชีพ</span>
          </CardTitle>
          <CardDescription>
            ข้อมูลเฉพาะของแขนงวิชาสำหรับใช้คำนวณและแสดงผลในหน้ารายละเอียดหลักสูตร
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Credit Structure */}
          <div>
            <Label className="text-sm font-bold block mb-2">โครงสร้างหน่วยกิตเฉพาะแขนงวิชา</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-xs">หมวดศึกษาทั่วไป</Label>
                <Input
                  type="number"
                  value={formData.structure.general || 0}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      structure: { ...p.structure, general: parseInt(e.target.value, 10) || 0 },
                    }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">หมวดวิชาเฉพาะ</Label>
                <Input
                  type="number"
                  value={formData.structure.major || 0}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      structure: { ...p.structure, major: parseInt(e.target.value, 10) || 0 },
                    }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">หมวดวิชาเลือกเสรี</Label>
                <Input
                  type="number"
                  value={formData.structure.freeElective || 0}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      structure: {
                        ...p.structure,
                        freeElective: parseInt(e.target.value, 10) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-primary">หน่วยกิตรวมตลอดหลักสูตร</Label>
                <Input
                  type="number"
                  className="font-bold border-primary"
                  value={formData.structure.totalCredits || 0}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      structure: {
                        ...p.structure,
                        totalCredits: parseInt(e.target.value, 10) || 0,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Careers Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-bold">เส้นทางอาชีพหลังสำเร็จการศึกษา (Career Tags)</Label>
            <div className="flex gap-2">
              <Input
                value={newCareer}
                onChange={(e) => setNewCareer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newCareer.trim()) {
                      setFormData((p) => ({ ...p, careers: [...p.careers, newCareer.trim()] }));
                      setNewCareer('');
                    }
                  }
                }}
                placeholder="พิมพ์ชื่ออาชีพ เช่น เชฟประจำโรงแรม, ผู้ประกอบการร้านอาหาร แล้วกด Enter หรือคลิกเพิ่ม"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newCareer.trim()) {
                    setFormData((p) => ({ ...p, careers: [...p.careers, newCareer.trim()] }));
                    setNewCareer('');
                  }
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> เพิ่มอาชีพ
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {formData.careers.map((career, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs border"
                >
                  <span>{career}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        careers: p.careers.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-bold">จุดเด่นของแขนงวิชา (Highlights)</Label>
            <div className="p-3 bg-slate-50 border rounded-lg space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight((p) => ({ ...p, title: e.target.value }))}
                  placeholder="หัวข้อจุดเด่น เช่น ครัวมาตรฐานระดับสากล"
                />
                <Input
                  className="sm:col-span-2"
                  value={newHighlight.description}
                  onChange={(e) => setNewHighlight((p) => ({ ...p, description: e.target.value }))}
                  placeholder="คำอธิบายรายละเอียดจุดเด่น..."
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newHighlight.title.trim()) {
                    setFormData((p) => ({
                      ...p,
                      highlights: [...p.highlights, newHighlight],
                    }));
                    setNewHighlight({ title: '', description: '' });
                  }
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มจุดเด่น
              </Button>
            </div>

            {formData.highlights.length > 0 && (
              <div className="space-y-2">
                {formData.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 border rounded-md text-xs bg-white">
                    <div>
                      <p className="font-bold text-slate-900">{h.title}</p>
                      <p className="text-slate-600 mt-0.5">{h.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          highlights: p.highlights.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Floating/Fixed Save Bar */}
      <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/programs/${programId}`)}
        >
          ยกเลิก
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !hasEditPermission}
          className="gap-2 bg-primary text-white px-8"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลแขนงวิชา'}</span>
        </Button>
      </div>
    </div>
  );
}
