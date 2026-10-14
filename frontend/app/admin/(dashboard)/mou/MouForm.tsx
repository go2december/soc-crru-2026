'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MOU_PARTNER_TYPES, MouItem } from '@/lib/mous';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  Building2,
  Calendar,
  FileText,
  Upload,
  X,
  Globe,
  Handshake,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function MouForm({ initialData }: { initialData?: MouItem }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    partnerName: '',
    partnerType: 'GOVERNMENT',
    partnerLogoUrl: '',
    scope: '',
    startDate: '',
    endDate: '',
    isActive: true,
    documentUrl: '',
    websiteUrl: '',
    isPublished: true,
    displayOrder: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        partnerName: initialData.partnerName || '',
        partnerType: initialData.partnerType || 'GOVERNMENT',
        partnerLogoUrl: initialData.partnerLogoUrl || '',
        scope: initialData.scope || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        isActive: initialData.isActive ?? true,
        documentUrl: initialData.documentUrl || '',
        websiteUrl: initialData.websiteUrl || '',
        isPublished: initialData.isPublished ?? true,
        displayOrder: initialData.displayOrder ?? 0,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
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
        setFormData((prev) => ({ ...prev, partnerLogoUrl: data.url }));
        toast.success('อัปโหลดโลโก้สำเร็จ');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'กรุณาระบุชื่อบันทึกข้อตกลง / โครงการความร่วมมือ';
    if (!formData.partnerName.trim()) errors.partnerName = 'กรุณาระบุชื่อองค์กร / หน่วยงานภาคี';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('admin_token');
    const isEdit = !!initialData?.id;
    const url = isEdit ? `${API_URL}/api/mous/${initialData.id}` : `${API_URL}/api/mous`;
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? 'บันทึกการแก้ไข MOU เรียบร้อยแล้ว' : 'เพิ่ม MOU ใหม่เรียบร้อยแล้ว');
        router.push('/admin/mou');
      } else {
        const err = await res.json();
        toast.error(err.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/mou" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {initialData ? 'แก้ไขบันทึกข้อตกลงความร่วมมือ (MOU)' : 'เพิ่มบันทึกข้อตกลงความร่วมมือ (MOU)'}
            </h1>
            <p className="text-sm text-slate-500">
              กรอกข้อมูลองค์กรภาคี ขอบเขตความร่วมมือ และเอกสารแนบ
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="bg-scholar-accent hover:bg-red-700 text-white min-w-[120px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล
            </>
          )}
        </Button>
      </div>

      {/* Main Info */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Handshake className="w-5 h-5 text-scholar-accent" /> ข้อมูลทั่วไปของบันทึกข้อตกลง
          </CardTitle>
          <CardDescription>ข้อมูลหัวข้อความร่วมมือและหน่วยงานพันธมิตร</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-semibold">
              ชื่อบันทึกข้อตกลง / โครงการความร่วมมือ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="เช่น บันทึกข้อตกลงความร่วมมือด้านการส่งเสริมและพัฒนานวัตกรรมชุมชนเชิงพื้นที่"
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-xs text-red-500">{validationErrors.title}</p>
            )}
          </div>

          {/* Partner Name & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="partnerName" className="text-sm font-semibold">
                ชื่อองค์กร / หน่วยงานภาคี <span className="text-red-500">*</span>
              </Label>
              <Input
                id="partnerName"
                name="partnerName"
                value={formData.partnerName}
                onChange={handleChange}
                placeholder="เช่น องค์การบริหารส่วนจังหวัดเชียงราย"
                className={validationErrors.partnerName ? 'border-red-500' : ''}
              />
              {validationErrors.partnerName && (
                <p className="text-xs text-red-500">{validationErrors.partnerName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partnerType" className="text-sm font-semibold">
                ประเภทภาคีเครือข่าย <span className="text-red-500">*</span>
              </Label>
              <select
                id="partnerType"
                name="partnerType"
                value={formData.partnerType}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-scholar-accent"
              >
                {MOU_PARTNER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">โลโก้องค์กร / ภาพสัญลักษณ์หน่วยงาน</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                {formData.partnerLogoUrl ? (
                  <>
                    <img
                      src={formData.partnerLogoUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, partnerLogoUrl: '' }))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="max-w-xs text-xs"
                  />
                  {uploading && <Loader2 className="w-4 h-4 animate-spin text-scholar-accent" />}
                </div>
                <p className="text-xs text-slate-500">
                  รองรับไฟล์ภาพ PNG, JPG, WebP แนะนำภาพโลโก้พื้นหลังโปร่งใสหรือคมชัด
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">หรือระบุ URL:</span>
                  <Input
                    name="partnerLogoUrl"
                    value={formData.partnerLogoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="h-8 text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scope / Description */}
          <div className="space-y-1.5">
            <Label htmlFor="scope" className="text-sm font-semibold">
              ขอบเขตความร่วมมือ / สาระสำคัญของบันทึกข้อตกลง
            </Label>
            <textarea
              id="scope"
              name="scope"
              rows={4}
              value={formData.scope}
              onChange={handleChange}
              placeholder="ระบุวัตถุประสงค์ ขอบข่ายการดำเนินงานร่วมกัน เช่น ร่วมกันพัฒนาหลักสูตรท้องถิ่น สนับสนุนการทำวิจัยร่วม และการพัฒนาศักยภาพชุมชน..."
              className="w-full p-3 text-sm bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-scholar-accent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Period & Links */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-scholar-accent" /> ระยะเวลาและเอกสารอ้างอิง
          </CardTitle>
          <CardDescription>กำหนดอายุสัญญาและลิงก์เอกสารฉบับเต็ม</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Start and End date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-sm font-semibold">
                วันที่เริ่มลงนาม / มีผลบังคับใช้
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-sm font-semibold">
                วันที่สิ้นสุด (เว้นว่างไว้หากเป็นสัญญาต่อเนื่อง)
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl" className="text-sm font-semibold">
                เว็บไซต์หน่วยงานพันธมิตร
              </Label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentUrl" className="text-sm font-semibold">
                ลิงก์ไฟล์เอกสาร / ข่าวประกาศ MOU ฉบับเต็ม
              </Label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="documentUrl"
                  name="documentUrl"
                  value={formData.documentUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/... หรือ URL เอกสาร"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Order & Status Flags */}
          <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder" className="text-sm font-semibold">
                ลำดับการแสดงผล (น้อยไปมาก)
              </Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-28"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-scholar-accent focus:ring-scholar-accent"
              />
              <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                สัญญายังมีผลบังคับใช้ (Active)
              </Label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 rounded text-scholar-accent focus:ring-scholar-accent"
              />
              <Label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                เผยแพร่บนหน้าเว็บไซต์สาธารณะ
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
