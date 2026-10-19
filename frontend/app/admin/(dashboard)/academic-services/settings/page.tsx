'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
  FileText,
  Upload,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Loader2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { DEFAULT_ACADEMIC_SERVICE_CONFIG, AcademicServiceConfig } from '@/lib/academic-services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AcademicServiceSettingsPage() {
  const [config, setConfig] = useState<AcademicServiceConfig>(DEFAULT_ACADEMIC_SERVICE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingDocx, setUploadingDocx] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/academic-services/config`);
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (err) {
      console.error('Error fetching config:', err);
      toast.error('ไม่สามารถโหลดข้อมูลการตั้งค่าได้ ใช้ค่าเริ่มต้นชั่วคราว');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'pdf' | 'docx'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'pdf') setUploadingPdf(true);
    else setUploadingDocx(true);

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
        if (type === 'pdf') {
          setConfig((prev) => ({ ...prev, pdfFormUrl: data.fileUrl }));
          toast.success('อัปโหลดไฟล์คำขอแบบ PDF เรียบร้อยแล้ว');
        } else {
          setConfig((prev) => ({ ...prev, docxFormUrl: data.fileUrl }));
          toast.success('อัปโหลดไฟล์คำขอแบบ Word (.docx) เรียบร้อยแล้ว');
        }
      } else {
        toast.error('อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      if (type === 'pdf') setUploadingPdf(false);
      else setUploadingDocx(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/academic-services/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactEmail: config.contactEmail,
          contactPhone: config.contactPhone,
          officeHours: config.officeHours,
          officeLocation: config.officeLocation,
          responseTime: config.responseTime,
          pdfFormUrl: config.pdfFormUrl,
          docxFormUrl: config.docxFormUrl,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        toast.success('บันทึกข้อมูลติดต่อและไฟล์คำขอเรียบร้อยแล้ว');
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (err) {
      console.error('Save config error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">กำลังโหลดข้อมูลการตั้งค่า...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/admin/academic-services" className="hover:text-primary transition-colors">
              บริการวิชาการแก่สังคม
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">ตั้งค่าข้อมูลศูนย์ประสานงาน</span>
          </div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground">
            <Settings className="h-7 w-7 text-primary" />
            ตั้งค่าข้อมูลติดต่อ & ไฟล์คำขอบริการวิชาการ
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            ข้อมูลในหน้านี้จะแสดงที่หน้าศูนย์ประสานงานและขอรับบริการวิชาการ (/research/services/request) แบบอัตโนมัติ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-sm gap-1.5 text-xs">
            <Link href="/admin/academic-services">
              <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-sm gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5">
            <Link href="/research/services/request" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> ดูหน้าคำขอจริง
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. CONTACT CHANNELS CARD */}
        <Card className="rounded-sm border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-primary" /> ช่องทางติดต่อสายตรง (Direct Contact Channels)
            </CardTitle>
            <CardDescription className="text-xs">
              อีเมลและเบอร์โทรศัพท์สำหรับหน่วยงานภายนอก/ชุมชนติดต่อขอรับบริการวิชาการ
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* อีเมลติดต่อ */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-600" /> อีเมลติดต่ออย่างเป็นทางการ <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="social@crru.ac.th"
                  value={config.contactEmail}
                  onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                  className="rounded-sm text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  ระบบสาธารณะมีกลไกป้องกัน Bot Scraper อัตโนมัติ พร้อมปุ่มคลิกคัดลอก
                </p>
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" /> หมายเลขโทรศัพท์ติดต่อสายตรง <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  placeholder="0-5377-6000 ต่อ 1600"
                  value={config.contactPhone}
                  onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                  className="rounded-sm text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  เบอร์โทรศัพท์ประจำศูนย์บริการ พร้อมปุ่มโทรออกและคัดลอกบนมือถือ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
              {/* วันเวลาทำการ */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> วันและเวลาทำการ
                </label>
                <Input
                  placeholder="จันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)"
                  value={config.officeHours}
                  onChange={(e) => setConfig({ ...config, officeHours: e.target.value })}
                  className="rounded-sm text-xs"
                />
              </div>

              {/* กรอบเวลาตอบกลับ */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" /> ระยะเวลาประเมินและติดต่อกลับ
                </label>
                <Input
                  placeholder="เจ้าหน้าที่จะติดต่อกลับภายใน 1-2 วันทำการ"
                  value={config.responseTime}
                  onChange={(e) => setConfig({ ...config, responseTime: e.target.value })}
                  className="rounded-sm text-xs"
                />
              </div>
            </div>

            {/* ที่ตั้งศูนย์ประสานงาน */}
            <div className="space-y-1.5 pt-2 border-t">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-600" /> ที่ตั้งสำนักงาน / ศูนย์ประสานงาน
              </label>
              <Input
                placeholder="สำนักงานคณบดี อาคาร 1 ชั้น 2 คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย"
                value={config.officeLocation}
                onChange={(e) => setConfig({ ...config, officeLocation: e.target.value })}
                className="rounded-sm text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. DOWNLOADABLE APPLICATION FORMS */}
        <Card className="rounded-sm border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <FileText className="h-4 w-4 text-primary" /> แบบฟอร์มคำขอทางการสำหรับดาวน์โหลด (Application Forms)
            </CardTitle>
            <CardDescription className="text-xs">
              ไฟล์แบบฟอร์มคำขอรับบริการวิชาการที่ประชาชน หน่วยงาน และองค์กรภายนอกสามารถดาวน์โหลดไปกรอกได้
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            {/* PDF FORM */}
            <div className="p-4 rounded-sm border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      PDF
                    </span>
                    แบบฟอร์มคำขอรับบริการวิชาการ (ฉบับพิมพ์กรอก / PDF Format)
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    เหมาะสำหรับผู้ขอรับบริการที่ต้องการพิมพ์เอกสารออกมาเขียนด้วยลายมือ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      disabled={uploadingPdf}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      asChild
                      variant="outline"
                      size="sm"
                      disabled={uploadingPdf}
                      className="rounded-sm text-xs gap-1.5 h-8 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                    >
                      <span>
                        {uploadingPdf ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        อัปโหลดไฟล์ PDF ใหม่
                      </span>
                    </Button>
                  </label>

                  {config.pdfFormUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      asChild
                      className="rounded-sm text-xs h-8 gap-1"
                    >
                      <a href={config.pdfFormUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        เปิดดูไฟล์
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-mono shrink-0">URL ไฟล์:</span>
                <Input
                  value={config.pdfFormUrl}
                  onChange={(e) => setConfig({ ...config, pdfFormUrl: e.target.value })}
                  placeholder="/forms/academic-service-request.pdf หรือ https://..."
                  className="rounded-sm text-xs h-8 font-mono bg-muted/20"
                />
              </div>
            </div>

            {/* DOCX FORM */}
            <div className="p-4 rounded-sm border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      DOCX
                    </span>
                    แบบฟอร์มคำขอรับบริการวิชาการ (ฉบับแก้ไขในคอมพิวเตอร์ / Word Format)
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    เหมาะสำหรับผู้ขอรับบริการที่ต้องการพิมพ์เนื้อหาในคอมพิวเตอร์ผ่าน Microsoft Word
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".docx,.doc"
                      onChange={(e) => handleFileUpload(e, 'docx')}
                      disabled={uploadingDocx}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      asChild
                      variant="outline"
                      size="sm"
                      disabled={uploadingDocx}
                      className="rounded-sm text-xs gap-1.5 h-8 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    >
                      <span>
                        {uploadingDocx ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        อัปโหลดไฟล์ Word (.docx) ใหม่
                      </span>
                    </Button>
                  </label>

                  {config.docxFormUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      asChild
                      className="rounded-sm text-xs h-8 gap-1"
                    >
                      <a href={config.docxFormUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        เปิดดูไฟล์
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-mono shrink-0">URL ไฟล์:</span>
                <Input
                  value={config.docxFormUrl}
                  onChange={(e) => setConfig({ ...config, docxFormUrl: e.target.value })}
                  placeholder="/forms/academic-service-request.docx หรือ https://..."
                  className="rounded-sm text-xs h-8 font-mono bg-muted/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. ACTIONS */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-primary" />
            การแก้ไขจะมีผลในหน้าขอรับบริการทันทีหลังกดบันทึก
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              asChild
              className="rounded-sm text-xs"
            >
              <Link href="/admin/academic-services">ยกเลิก</Link>
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-sm text-xs gap-2 min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> กำลังบันทึก...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> บันทึกการเปลี่ยนแปลง
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
