'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ACADEMIC_SERVICE_TYPES, ACADEMIC_SERVICE_STATUSES } from '@/lib/academic-services';
import { toast } from 'sonner';
import { AlertCircle, Plus, Trash2, Upload, X } from 'lucide-react';

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
      
      setFormData(prev => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newImages]
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
    setFormData(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== indexToRemove)
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
      errs.title = 'กรุณากรอกชื่อโครงการ/บริการวิชาการ';
    }
    if (!formData.serviceType) {
      errs.serviceType = 'กรุณาเลือกประเภทบริการ';
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
      toast.error('กรุณาตรวจสอบความถูกต้องของข้อมูล');
      return;
    }
    
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const url = initialData 
        ? `${API_URL}/api/academic-services/${initialData.id}` 
        : `${API_URL}/api/academic-services`;
        
      const cleanMembers = formData.members.filter(m => m.staffId);

      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          members: cleanMembers,
          publishedAt: formData.isPublished && !initialData?.publishedAt ? new Date().toISOString() : initialData?.publishedAt,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="rounded-sm border-border/70 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <Label>ชื่อโครงการ/บริการ <span className="text-red-500">*</span></Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="เช่น โครงการยกระดับเศรษฐกิจและสังคม..."
                className={`rounded-sm ${validationErrors.title ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.title && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {validationErrors.title}
                </p>
              )}
            </div>
            
            {/* Service Type */}
            <div className="space-y-2">
              <Label>ประเภทบริการ <span className="text-red-500">*</span></Label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {ACADEMIC_SERVICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>สถานะโครงการ <span className="text-red-500">*</span></Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {ACADEMIC_SERVICE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label>งบประมาณโครงการ (บาท)</Label>
              <Input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="เช่น 150000"
                className={`rounded-sm ${validationErrors.budget ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.budget && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {validationErrors.budget}
                </p>
              )}
            </div>

            {/* Funding Source */}
            <div className="space-y-2">
              <Label>แหล่งที่มางบประมาณ</Label>
              <Input
                name="fundingSource"
                value={formData.fundingSource}
                onChange={handleChange}
                placeholder="เช่น งบแผ่นดิน, งบรายได้คณะ, แหล่งทุนภายนอก"
                className="rounded-sm"
              />
            </div>

            {/* Area */}
            <div className="space-y-2 md:col-span-2">
              <Label>พื้นที่ดำเนินการ (Area)</Label>
              <Input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="เช่น ต.แม่ข้าวต้ม อ.เมือง จ.เชียงราย"
                className="rounded-sm"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2 md:col-span-2">
              <Label>คำอธิบายโครงการสั้นๆ</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-sm border border-input bg-background px-3 py-2 text-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="อธิบายรายละเอียดโครงการ..."
              />
            </div>

            {/* SDGs checkboxes (1-17) */}
            <div className="space-y-3 md:col-span-2 border-t pt-4">
              <Label className="text-sm font-semibold">เป้าหมายความยั่งยืนที่เกี่ยวข้อง (SDGs Mapping)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => {
                  const isChecked = formData.sdgIds.includes(num);
                  return (
                    <label key={num} className={`flex items-center gap-2 p-2 border rounded-sm cursor-pointer select-none text-xs transition-colors ${isChecked ? 'bg-primary/5 border-primary text-primary font-semibold' : 'bg-background hover:bg-muted/50 border-input'}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        className="h-3.5 w-3.5 rounded-sm"
                        onChange={() => {
                          setFormData((prev) => {
                            const nextSdg = prev.sdgIds.includes(num)
                              ? prev.sdgIds.filter((id) => id !== num)
                              : [...prev.sdgIds, num];
                            return { ...prev, sdgIds: nextSdg };
                          });
                        }}
                      />
                      <span>SDG {num}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Project Team Members */}
            <div className="space-y-4 md:col-span-2 border-t pt-6">
              <div>
                <Label className="text-base font-bold">ทีมงานผู้รับผิดชอบโครงการ</Label>
                <p className="text-xs text-muted-foreground mt-0.5">ระบุอาจารย์หรือบุคลากรของคณะที่เป็นหัวหน้าโครงการหรือคณะทำงาน</p>
              </div>
              
              <div className="space-y-4">
                {formData.members.map((member, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-muted/40 border border-border/50 rounded-sm relative group">
                    <div className="flex-grow w-full space-y-1.5">
                      <Label className="text-xs">เลือกบุคลากร</Label>
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
                        className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">-- เลือกอาจารย์/บุคลากร --</option>
                        {staffOptions.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {formatStaffName(staff)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-48 space-y-1.5">
                      <Label className="text-xs">บทบาท</Label>
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
                        className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="LEADER">ผู้รับผิดชอบหลัก (Leader)</option>
                        <option value="MEMBER">ผู้เข้าร่วมโครงการ (Member)</option>
                      </select>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end sm:self-center h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          members: prev.members.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-sm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      members: [...prev.members, { staffId: '', role: 'MEMBER' }],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4" /> เพิ่มรายชื่อทีมงาน
                </Button>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2 md:col-span-2 border-t pt-6">
              <Label>ภาพหน้าปก (Cover Image)</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                {formData.coverImageUrl ? (
                  <div className="relative w-48 aspect-video rounded-sm overflow-hidden border border-border group">
                    <img src={formData.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
                    <button 
                      type="button" 
                      onClick={handleRemoveImage} 
                      className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-sm text-xs font-bold transition-colors"
                      title="ลบภาพหน้าปก"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-48 aspect-video bg-muted rounded-sm border-dashed border-2 flex items-center justify-center text-muted-foreground text-xs">
                    ไม่มีรูปภาพหน้าปก
                  </div>
                )}
                <div className="space-y-1">
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                  <p className="text-[10px] text-muted-foreground">ขนาดไม่เกิน 5MB (JPG, PNG, WebP)</p>
                </div>
              </div>
            </div>

            {/* Document PDF Upload */}
            <div className="space-y-2 md:col-span-2 border-t pt-6">
              <Label>เอกสารรายงาน/คู่มือประกอบโครงการ (PDF / Document)</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                {formData.documentUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-sm border border-border/80 w-full sm:max-w-md relative group">
                    <div className="bg-red-100 text-red-700 p-2 rounded-sm font-bold text-xs uppercase">PDF</div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold truncate">เอกสารประกอบโครงการ</p>
                      <a href={formData.documentUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block">
                        ดูไฟล์อัปโหลด
                      </a>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleRemoveDocument} 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-sm"
                      title="ลบเอกสาร"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full sm:max-w-md p-4 bg-muted/20 border-dashed border-2 rounded-sm text-center text-muted-foreground text-xs">
                    ยังไม่มีการอัปโหลดไฟล์เอกสารประกอบ
                  </div>
                )}
                <div className="space-y-1">
                  <input type="file" accept="application/pdf" onChange={handleDocumentUpload} disabled={uploading} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 cursor-pointer" />
                  <p className="text-[10px] text-muted-foreground">ขนาดไม่เกิน 10MB (PDF เท่านั้น)</p>
                </div>
              </div>
            </div>

            {/* Image Gallery Upload */}
            <div className="space-y-2 md:col-span-2 border-t pt-6">
              <Label className="text-base font-bold">แกลเลอรีรูปภาพโครงการ (Gallery Images)</Label>
              <p className="text-xs text-muted-foreground mb-4">อัปโหลดรูปภาพเพิ่มเติมเพื่อจัดทำเป็นแกลเลอรีความเคลื่อนไหวโครงการ (สามารถเลือกอัปโหลดได้หลายไฟล์พร้อมกัน)</p>
              
              <div className="mb-4">
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 cursor-pointer" />
              </div>

              {formData.galleryImages && formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  {formData.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-sm overflow-hidden border border-border group">
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveGalleryImage(idx)} 
                        className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-sm text-xs font-bold transition-colors opacity-0 group-hover:opacity-100"
                        title="ลบรูปภาพแกลเลอรี"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Is Published */}
            <div className="space-y-2 md:col-span-2 flex items-center gap-2 border-t pt-4">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 rounded-sm border-input"
              />
              <Label htmlFor="isPublished" className="cursor-pointer select-none">เผยแพร่ข้อมูลนี้บนเว็บไซต์หลักทันที</Label>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-sm">
          ยกเลิก
        </Button>
        <Button type="submit" disabled={saving || uploading} className="rounded-sm">
          {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </Button>
      </div>
    </form>
  );
}
