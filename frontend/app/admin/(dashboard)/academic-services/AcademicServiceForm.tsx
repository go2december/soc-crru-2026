'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ACADEMIC_SERVICE_TYPES, ACADEMIC_SERVICE_STATUSES } from '@/lib/academic-services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AcademicServiceForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: 'SOCIAL_SERVICE',
    area: '',
    status: 'ONGOING',
    coverImageUrl: '',
    isPublished: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        serviceType: initialData.serviceType || 'SOCIAL_SERVICE',
        area: initialData.area || '',
        status: initialData.status || 'ONGOING',
        coverImageUrl: initialData.coverImageUrl || '',
        isPublished: initialData.isPublished ?? true,
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

  const [uploading, setUploading] = useState(false);

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
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const url = initialData 
        ? `${API_URL}/api/academic-services/${initialData.id}` 
        : `${API_URL}/api/academic-services`;
        
      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.isPublished && !initialData?.publishedAt ? new Date().toISOString() : initialData?.publishedAt,
        }),
      });

      if (res.ok) {
        router.push('/admin/academic-services');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label>ชื่อโครงการ/บริการ <span className="text-red-500">*</span></Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="เช่น โครงการยกระดับเศรษฐกิจและสังคม..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>ประเภทบริการ <span className="text-red-500">*</span></Label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                {ACADEMIC_SERVICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>สถานะโครงการ <span className="text-red-500">*</span></Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                {ACADEMIC_SERVICE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>พื้นที่ดำเนินการ (Area)</Label>
              <Input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="เช่น ต.แม่ข้าวต้ม อ.เมือง จ.เชียงราย"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>คำอธิบายโครงการสั้นๆ</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                placeholder="อธิบายรายละเอียดโครงการ..."
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>ภาพหน้าปก (Cover Image)</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                {formData.coverImageUrl ? (
                    <div className="relative w-40 aspect-video rounded overflow-hidden border">
                        <img src={formData.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
                        <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">X</button>
                    </div>
                ) : (
                    <div className="w-40 aspect-video bg-muted rounded border-dashed border-2 flex items-center justify-center text-muted-foreground text-sm">
                        ไม่มีรูปภาพ
                    </div>
                )}
                <div>
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {uploading && <p className="text-xs text-muted-foreground mt-2">กำลังอัปโหลด...</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="isPublished">เผยแพร่ข้อมูลนี้บนเว็บไซต์ทันที</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </Button>
      </div>
    </form>
  );
}
