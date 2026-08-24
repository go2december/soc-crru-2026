'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Link as LinkIcon,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  PROCUREMENT_TYPES,
  PROCUREMENT_CATEGORIES,
  PROCUREMENT_STATUSES,
  PROCUREMENT_DOC_TYPES,
  ProcurementRecord,
  ProcurementDocType,
  getProcurementDocTypeLabel,
  getProcurementFileUrl,
} from '@/lib/procurement';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface DocumentItem {
  id?: string;
  documentType: ProcurementDocType;
  title: string;
  fileUrl?: string;
  externalUrl?: string;
  originalName?: string;
  mimeType?: string;
  fileSize?: number;
  sortOrder: number;
}

interface ProcurementFormProps {
  initialData?: ProcurementRecord;
  isEdit?: boolean;
}

export default function ProcurementForm({ initialData, isEdit }: ProcurementFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Form State
  const currentBE = new Date().getFullYear() + 543;
  const [fiscalYear, setFiscalYear] = useState<number>(initialData?.fiscalYear || currentBE);
  const [title, setTitle] = useState(initialData?.title || '');
  const [procurementType, setProcurementType] = useState(initialData?.procurementType || 'SPECIFIC_METHOD');
  const [category, setCategory] = useState(initialData?.category || 'GOODS');
  const [budget, setBudget] = useState(initialData?.budget?.toString() || '');
  const [contractAmount, setContractAmount] = useState(initialData?.contractAmount?.toString() || '');
  const [vendorName, setVendorName] = useState(initialData?.vendorName || '');
  const [approvedAt, setApprovedAt] = useState(
    initialData?.approvedAt ? new Date(initialData.approvedAt).toISOString().split('T')[0] : ''
  );
  const [completedAt, setCompletedAt] = useState(
    initialData?.completedAt ? new Date(initialData.completedAt).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState(initialData?.status || 'PLANNING');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  // Documents State
  const [documents, setDocuments] = useState<DocumentItem[]>(
    (initialData?.documents || []).map((d, index) => ({
      id: d.id,
      documentType: d.documentType,
      title: d.title,
      fileUrl: d.fileUrl || undefined,
      externalUrl: d.externalUrl || undefined,
      originalName: d.originalName || undefined,
      mimeType: d.mimeType || 'application/pdf',
      fileSize: d.fileSize || undefined,
      sortOrder: d.sortOrder ?? index,
    }))
  );

  // Add Document row
  const handleAddDocument = (mode: 'upload' | 'link') => {
    setDocuments((prev) => [
      ...prev,
      {
        documentType: 'OTHER',
        title: '',
        fileUrl: undefined,
        externalUrl: mode === 'link' ? '' : undefined,
        sortOrder: prev.length,
      },
    ]);
  };

  // Remove Document row
  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Update Document field
  const handleUpdateDocument = (index: number, field: keyof DocumentItem, value: any) => {
    setDocuments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Upload PDF File to server
  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('กรุณาเลือกไฟล์ PDF เท่านั้น');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('ไฟล์มีขนาดเกิน 20MB');
      return;
    }

    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    setUploadingIndex(index);
    try {
      const res = await fetch(`${API_URL}/api/upload/procurement`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const result = await res.json();
      setDocuments((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          fileUrl: result.fileUrl || result.url,
          originalName: result.originalName || file.name,
          mimeType: result.mimeType || 'application/pdf',
          fileSize: result.size || file.size,
          // Set default document title if empty
          title: updated[index].title || file.name.replace(/\\.[^/.]+$/, ''),
        };
        return updated;
      });

      toast.success('อัปโหลดไฟล์ PDF สำเร็จ');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('กรุณากรอกชื่อโครงการ/รายการจัดซื้อ');
      return;
    }

    if (!budget || isNaN(parseFloat(budget))) {
      toast.error('กรุณากรอกวงเงินงบประมาณเป็นตัวเลข');
      return;
    }

    // Validate documents
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      if (!doc.title.trim()) {
        toast.error(`กรุณากรอกชื่อเอกสารที่ลำดับ ${i + 1}`);
        return;
      }
      if (!doc.fileUrl && !doc.externalUrl) {
        toast.error(`เอกสาร "${doc.title}" ต้องทำการอัปโหลดไฟล์ PDF หรือระบุลิงก์ภายนอก`);
        return;
      }
    }

    setSubmitting(true);
    const token = localStorage.getItem('admin_token');

    const payload = {
      fiscalYear: Number(fiscalYear),
      title: title.trim(),
      procurementType,
      category,
      budget: parseFloat(budget),
      contractAmount: contractAmount ? parseFloat(contractAmount) : null,
      vendorName: vendorName.trim() || null,
      approvedAt: approvedAt || null,
      completedAt: completedAt || null,
      status,
      isPublished,
      documents: documents.map((doc, idx) => ({
        id: doc.id,
        documentType: doc.documentType,
        title: doc.title.trim(),
        fileUrl: doc.fileUrl || null,
        externalUrl: doc.externalUrl?.trim() || null,
        originalName: doc.originalName || null,
        mimeType: doc.mimeType || 'application/pdf',
        fileSize: doc.fileSize || null,
        sortOrder: idx,
      })),
    };

    try {
      const endpoint = isEdit ? `${API_URL}/api/procurement/${initialData?.id}` : `${API_URL}/api/procurement`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save');
      }

      toast.success(isEdit ? 'อัปเดตข้อมูลจัดซื้อจัดจ้างสำเร็จ' : 'บันทึกข้อมูลจัดซื้อจัดจ้างสำเร็จ');
      router.push('/admin/procurement');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/procurement"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium mb-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            กลับไปหน้ารายการ
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEdit ? 'แก้ไขรายการจัดซื้อจัดจ้าง' : 'เพิ่มรายการจัดซื้อจัดจ้างใหม่'}
          </h1>
          <p className="text-xs text-muted-foreground">
            กรอกข้อมูลรายละเอียดโครงการ วงเงิน และแนบเอกสาร PDF หลักฐานยืนยันความโปร่งใส
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/procurement">
            <Button type="button" variant="outline" size="sm">
              ยกเลิก
            </Button>
          </Link>
          <Button type="submit" disabled={submitting} size="sm" className="bg-primary gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}</span>
          </Button>
        </div>
      </div>

      {/* Section 1: ข้อมูลพื้นฐาน */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
          <FileText className="w-4 h-4 text-primary" />
          <span>ข้อมูลหลักโครงการ</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ปีงบประมาณ */}
          <div>
            <Label htmlFor="fiscalYear" className="text-xs font-semibold">
              ปีงบประมาณ (พ.ศ.) *
            </Label>
            <Input
              id="fiscalYear"
              type="number"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(Number(e.target.value))}
              placeholder="เช่น 2568"
              required
              className="mt-1"
            />
          </div>

          {/* วิธีการจัดซื้อ */}
          <div>
            <Label htmlFor="procurementType" className="text-xs font-semibold">
              วิธีการจัดซื้อจัดจ้าง *
            </Label>
            <select
              id="procurementType"
              value={procurementType}
              onChange={(e) => setProcurementType(e.target.value as any)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
            >
              {PROCUREMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* หมวดหมู่ */}
          <div>
            <Label htmlFor="category" className="text-xs font-semibold">
              หมวดหมู่งาน *
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
            >
              {PROCUREMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ชื่อโครงการ */}
        <div>
          <Label htmlFor="title" className="text-xs font-semibold">
            ชื่อโครงการ / รายการจัดซื้อจัดจ้าง *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น จ้างเหมาปรับปรุงระบบสารสนเทศและโครงข่ายอินเทอร์เน็ต คณะสังคมศาสตร์"
            required
            className="mt-1"
          />
        </div>

        {/* วงเงินงบประมาณ & วงเงินสัญญา */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget" className="text-xs font-semibold">
              วงเงินงบประมาณที่ได้รับจัดสรร (บาท) *
            </Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contractAmount" className="text-xs font-semibold">
              ราคากลาง / วงเงินตามสัญญาจริง (บาท)
            </Label>
            <Input
              id="contractAmount"
              type="number"
              step="0.01"
              value={contractAmount}
              onChange={(e) => setContractAmount(e.target.value)}
              placeholder="0.00 (เว้นว่างได้หากอยู่ในขั้นตอนแผนงาน)"
              className="mt-1"
            />
          </div>
        </div>

        {/* ผู้ชนะการเสนอราคา */}
        <div>
          <Label htmlFor="vendorName" className="text-xs font-semibold">
            ผู้ชนะการเสนอราคา / คู่สัญญา
          </Label>
          <Input
            id="vendorName"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="เช่น บริษัท เอสโอซี อินโนเวชั่น จำกัด"
            className="mt-1"
          />
        </div>

        {/* วันที่และสถานะ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="approvedAt" className="text-xs font-semibold">
              วันที่อนุมัติ / ประกาศ
            </Label>
            <Input
              id="approvedAt"
              type="date"
              value={approvedAt}
              onChange={(e) => setApprovedAt(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="completedAt" className="text-xs font-semibold">
              วันที่สิ้นสุดสัญญา / ส่งมอบ
            </Label>
            <Input
              id="completedAt"
              type="date"
              value={completedAt}
              onChange={(e) => setCompletedAt(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-xs font-semibold">
              สถานะโครงการ *
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
            >
              {PROCUREMENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* เผยแพร่ */}
        <div className="pt-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="checkbox checkbox-primary checkbox-sm rounded"
          />
          <Label htmlFor="isPublished" className="text-xs font-medium cursor-pointer">
            เผยแพร่ข้อมูลนี้บนหน้าเว็บไซต์สาธารณะ (Public Portal) ทันที
          </Label>
        </div>
      </div>

      {/* Section 2: เอกสารหลักฐาน PDF */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              <span>เอกสารหลักฐานประกอบ (PDF)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              รองรับทั้งการอัปโหลดไฟล์ PDF ตรงบน Server หรือแปะลิงก์เอกสารภายนอก (e-GP / Google Drive)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddDocument('upload')}
              className="gap-1.5 text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>เพิ่มไฟล์ PDF</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddDocument('link')}
              className="gap-1.5 text-xs"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>เพิ่มลิงก์ภายนอก</span>
            </Button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-border/80 rounded-xl space-y-3">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
            <div>
              <p className="text-sm font-medium text-foreground">ยังไม่มีเอกสารแนบ</p>
              <p className="text-xs text-muted-foreground">
                คลิกปุ่ม &quot;เพิ่มไฟล์ PDF&quot; หรือ &quot;เพิ่มลิงก์ภายนอก&quot; ด้านบนเพื่อแนบเอกสาร TOR, ประกาศ หรือสัญญา
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="bg-muted/30 border border-border rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                  <span className="text-xs font-bold text-primary">
                    เอกสารลำดับที่ {idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveDocument(idx)}
                    title="ลบเอกสารนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* ประเภทเอกสาร */}
                  <div>
                    <Label className="text-xs">ประเภทเอกสาร *</Label>
                    <select
                      value={doc.documentType}
                      onChange={(e) =>
                        handleUpdateDocument(idx, 'documentType', e.target.value as any)
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors mt-1"
                    >
                      {PROCUREMENT_DOC_TYPES.map((dt) => (
                        <option key={dt.value} value={dt.value}>
                          {dt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ชื่อเอกสาร */}
                  <div className="sm:col-span-2">
                    <Label className="text-xs">ชื่อเอกสารที่แสดง *</Label>
                    <Input
                      value={doc.title}
                      onChange={(e) => handleUpdateDocument(idx, 'title', e.target.value)}
                      placeholder="เช่น ขอบเขตงาน (TOR), ประกาศผลผู้ชนะการเสนอราคา"
                      className="mt-1 text-xs"
                      required
                    />
                  </div>
                </div>

                {/* File Upload OR External Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Upload PDF Box */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">อัปโหลดไฟล์ PDF (บน Server)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(idx, file);
                        }}
                        disabled={uploadingIndex === idx}
                        className="file-input file-input-bordered file-input-sm w-full text-xs"
                      />
                      {uploadingIndex === idx && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                      )}
                    </div>
                    {doc.fileUrl && (
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">อัปโหลดแล้ว: {doc.originalName || doc.fileUrl}</span>
                      </p>
                    )}
                  </div>

                  {/* External URL Box */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">หรือระบุลิงก์ภายนอก (e-GP / Google Drive)</Label>
                    <Input
                      type="url"
                      value={doc.externalUrl || ''}
                      onChange={(e) => handleUpdateDocument(idx, 'externalUrl', e.target.value)}
                      placeholder="https://process3.gprocurement.go.th/..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link href="/admin/procurement">
          <Button type="button" variant="outline">
            ยกเลิก
          </Button>
        </Link>
        <Button type="submit" disabled={submitting} className="bg-primary gap-2">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}</span>
        </Button>
      </div>
    </form>
  );
}
