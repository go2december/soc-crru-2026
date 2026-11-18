'use client';

import React, { useEffect, useState } from 'react';
import {
  Images,
  Plus,
  Trash2,
  Pencil,
  ArrowUp,
  ArrowDown,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  X,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BannerItem } from '@/lib/banners';
import { getAssetUrl } from '@/lib/api-config';

interface BannerFormState {
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const EMPTY_FORM: BannerFormState = {
  title: '',
  subtitle: '',
  badgeText: '',
  imageUrl: '',
  linkUrl: '',
  order: 0,
  isActive: true,
  startDate: '',
  endDate: '',
};

function toDateInputValue(iso?: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return '';
  }
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4500);
  };

  const triggerRevalidate = async () => {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['/'] }),
    }).catch(() => {});
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/banners/admin', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      showStatus('error', 'ไม่สามารถโหลดข้อมูลแบนเนอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/banner', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'อัปโหลดรูปภาพไม่สำเร็จ');
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      showStatus('success', 'อัปโหลดรูปภาพแบนเนอร์สำเร็จ (ปรับขนาดเป็น WebP อัตโนมัติ)');
    } catch (err: any) {
      showStatus('error', err.message || 'อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      order: banners.length > 0 ? Math.max(...banners.map((b) => b.order)) + 1 : 1,
    });
    setShowForm(true);
  };

  const openEditForm = (banner: BannerItem) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badgeText: banner.badgeText || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      order: banner.order,
      isActive: banner.isActive,
      startDate: toDateInputValue(banner.startDate),
      endDate: toDateInputValue(banner.endDate),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl.trim()) {
      showStatus('error', 'กรุณาอัปโหลดรูปภาพหรือระบุ URL รูปภาพแบนเนอร์');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const payload = {
        title: form.title.trim() || undefined,
        subtitle: form.subtitle.trim() || undefined,
        badgeText: form.badgeText.trim() || undefined,
        imageUrl: form.imageUrl.trim(),
        linkUrl: form.linkUrl.trim() || undefined,
        order: Number(form.order) || 0,
        isActive: form.isActive,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };

      const url = editingId ? `/api/banners/${editingId}` : '/api/banners';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'บันทึกแบนเนอร์ไม่สำเร็จ');
      }

      await triggerRevalidate();
      await fetchBanners();
      setShowForm(false);
      setEditingId(null);
      showStatus('success', editingId ? 'อัปเดตแบนเนอร์สำเร็จและรีเฟรชหน้าแรกแล้ว' : 'เพิ่มแบนเนอร์ใหม่สำเร็จแล้ว');
    } catch (err: any) {
      showStatus('error', err.message || 'เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (!res.ok) throw new Error('เปลี่ยนสถานะไม่สำเร็จ');
      await triggerRevalidate();
      await fetchBanners();
      showStatus('success', `${!banner.isActive ? 'เปิด' : 'ปิด'}การแสดงผลแบนเนอร์แล้ว`);
    } catch (err: any) {
      showStatus('error', err.message);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((b, idx) => ({ id: b.id, order: idx + 1 }));
    setBanners(reordered.map((b, idx) => ({ ...b, order: idx + 1 })));

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/banners/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('จัดลำดับไม่สำเร็จ');
      await triggerRevalidate();
      showStatus('success', 'อัปเดตลำดับสไลด์สำเร็จ');
    } catch (err: any) {
      showStatus('error', err.message);
      fetchBanners();
    }
  };

  const handleDelete = async (banner: BannerItem) => {
    if (!confirm(`ยืนยันการลบแบนเนอร์ "${banner.title || `#${banner.id}`}"?`)) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) throw new Error('ลบแบนเนอร์ไม่สำเร็จ');
      await triggerRevalidate();
      await fetchBanners();
      showStatus('success', 'ลบแบนเนอร์และไฟล์รูปภาพเรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus('error', err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Images className="size-6 text-primary" />
            จัดการแบนเนอร์สไลด์หน้าแรก
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            อัปโหลดภาพแบนเนอร์ ตั้งข้อความพาดหัว ลิงก์ปลายทาง และกำหนดช่วงเวลาแสดงผลบน Hero Slide
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchBanners} className="rounded-sm">
            <RefreshCw className="size-4 mr-1.5" />
            รีเฟรช
          </Button>
          <Button onClick={openCreateForm} className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4 mr-1.5" />
            เพิ่มสไลด์ใหม่
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-sm border text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="rounded-sm border-primary/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
            <div>
              <CardTitle className="text-lg">
                {editingId ? 'แก้ไขแบนเนอร์สไลด์' : 'เพิ่มแบนเนอร์สไลด์ใหม่'}
              </CardTitle>
              <CardDescription>
                แนะนำขนาดภาพแนวนอน 16:10 หรือ 16:9 (เช่น 1600×1000 px) ระบบจะแปลงเป็น WebP ให้อัตโนมัติ
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-sm">
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Image Upload & Preview */}
              <div className="lg:col-span-5 space-y-3">
                <Label>รูปภาพแบนเนอร์ *</Label>
                <div className="aspect-[16/10] w-full bg-slate-100 border border-dashed border-slate-300 rounded-sm overflow-hidden flex items-center justify-center relative">
                  {form.imageUrl ? (
                    <img
                      src={getAssetUrl(form.imageUrl)}
                      alt={form.title || 'Banner preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <Images className="size-10 mx-auto mb-2 opacity-60" />
                      <p className="text-xs">ยังไม่มีรูปภาพตัวอย่าง</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <span className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-sm border border-border bg-background hover:bg-accent cursor-pointer">
                      <Upload className="size-4" />
                      {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพใหม่'}
                    </span>
                  </label>
                </div>
                <div>
                  <Label htmlFor="banner-image-url" className="text-xs text-muted-foreground">
                    หรือระบุ URL รูปภาพโดยตรง
                  </Label>
                  <Input
                    id="banner-image-url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/uploads/banners/... หรือ https://..."
                    className="rounded-sm mt-1 text-xs"
                  />
                </div>
              </div>

              {/* Right: Metadata Fields */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="banner-badge">ป้ายกำกับ (Badge)</Label>
                    <Input
                      id="banner-badge"
                      value={form.badgeText}
                      onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                      placeholder="เช่น กิจกรรมเด่น / TCAS 2569"
                      className="rounded-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="banner-order">ลำดับการแสดงผล</Label>
                    <Input
                      id="banner-order"
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="rounded-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="banner-title">หัวข้อสไลด์ (Title)</Label>
                  <Input
                    id="banner-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="หัวข้อสั้นกระชับสำหรับแสดงบนภาพสไลด์"
                    className="rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="banner-subtitle">คำบรรยายย่อ (Subtitle)</Label>
                  <Textarea
                    id="banner-subtitle"
                    rows={2}
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="รายละเอียดสั้นๆ 1-2 บรรทัด"
                    className="rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="banner-link">ลิงก์ปลายทางเมื่อคลิก (Link URL)</Label>
                  <Input
                    id="banner-link"
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    placeholder="/admissions หรือ /news/... หรือ https://..."
                    className="rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="banner-start">เริ่มแสดงผล (ไม่บังคับ)</Label>
                    <Input
                      id="banner-start"
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="rounded-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="banner-end">สิ้นสุดการแสดงผล (ไม่บังคับ)</Label>
                    <Input
                      id="banner-end"
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="rounded-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="size-4 accent-primary"
                    />
                    เปิดแสดงผลบนหน้าแรกทันที
                  </label>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="rounded-sm"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving || uploading}
                      className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Save className="size-4 mr-1.5" />
                      {saving ? 'กำลังบันทึก...' : 'บันทึกสไลด์'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="text-base">รายการแบนเนอร์ทั้งหมด ({banners.length})</CardTitle>
          <CardDescription>เรียงตามลำดับการแสดงผลจากบนลงล่าง</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">กำลังโหลดข้อมูล...</div>
          ) : banners.length === 0 ? (
            <div className="py-14 text-center border border-dashed border-border rounded-sm">
              <Images className="size-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-foreground">ยังไม่มีแบนเนอร์สไลด์</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                กด &quot;เพิ่มสไลด์ใหม่&quot; เพื่อแสดงภาพกิจกรรมหรือประชาสัมพันธ์บนหน้าแรก
              </p>
              <Button onClick={openCreateForm} size="sm" className="rounded-sm">
                <Plus className="size-4 mr-1.5" />
                เพิ่มสไลด์แรก
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-border rounded-sm bg-card hover:border-primary/40 transition-colors"
                >
                  {/* Order Controls */}
                  <div className="flex md:flex-col items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-sm"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <span className="text-xs font-mono font-bold text-muted-foreground w-6 text-center">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-sm"
                      disabled={index === banners.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full md:w-48 aspect-[16/10] bg-slate-100 rounded-sm overflow-hidden border border-border shrink-0">
                    <img
                      src={getAssetUrl(banner.imageUrl)}
                      alt={banner.title || `Banner ${banner.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={banner.isActive ? 'default' : 'secondary'}
                        className="rounded-sm text-[11px]"
                      >
                        {banner.isActive ? 'กำลังแสดงผล' : 'ปิดใช้งาน'}
                      </Badge>
                      {banner.badgeText && (
                        <Badge variant="outline" className="rounded-sm text-[11px]">
                          {banner.badgeText}
                        </Badge>
                      )}
                      {(banner.startDate || banner.endDate) && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="size-3" />
                          {banner.startDate ? new Date(banner.startDate).toLocaleDateString('th-TH') : 'ทันที'}
                          {' – '}
                          {banner.endDate ? new Date(banner.endDate).toLocaleDateString('th-TH') : 'ไม่มีกำหนด'}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground truncate">
                      {banner.title || <span className="text-muted-foreground italic">(ไม่มีหัวข้อ)</span>}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{banner.subtitle}</p>
                    )}
                    {banner.linkUrl && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <ExternalLink className="size-3" />
                        <span className="truncate">{banner.linkUrl}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm"
                      onClick={() => handleToggleActive(banner)}
                      title={banner.isActive ? 'ซ่อนสไลด์' : 'แสดงสไลด์'}
                    >
                      {banner.isActive ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm"
                      onClick={() => openEditForm(banner)}
                    >
                      <Pencil className="size-4 mr-1" />
                      แก้ไข
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(banner)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
