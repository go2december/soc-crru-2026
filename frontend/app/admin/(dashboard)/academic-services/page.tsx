'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Coins,
  Search,
  Filter,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ACADEMIC_SERVICE_TYPES,
  ACADEMIC_SERVICE_STATUSES,
  getServiceTypeLabel,
  getStatusConfig,
} from '@/lib/academic-services';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminAcademicServicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [publishFilter, setPublishFilter] = useState('ALL');

  const fetchItems = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/academic-services/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('ไม่สามารถดึงข้อมูลบริการวิชาการได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Compute Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const published = items.filter((i) => i.isPublished).length;
    const ongoing = items.filter((i) => i.status === 'ONGOING').length;
    const totalBudget = items.reduce((acc, curr) => {
      const b = Number(curr.budget);
      return acc + (Number.isNaN(b) ? 0 : b);
    }, 0);
    return { total, published, ongoing, totalBudget };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const areaMatch = item.area?.toLowerCase().includes(q);
        const leaderMatch = item.members?.some((m: any) =>
          `${m.prefix || ''}${m.firstNameTh || ''} ${m.lastNameTh || ''}`.toLowerCase().includes(q)
        );
        if (!titleMatch && !areaMatch && !leaderMatch) return false;
      }

      if (typeFilter !== 'ALL' && item.serviceType !== typeFilter) {
        return false;
      }

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (publishFilter !== 'ALL') {
        const isPub = publishFilter === 'PUBLISHED';
        if (item.isPublished !== isPub) return false;
      }

      return true;
    });
  }, [items, searchQuery, typeFilter, statusFilter, publishFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setPublishFilter('ALL');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/academic-services/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Cleanup associated files on server
        const deleteNewsFileOnServer = async (url: string) => {
          if (!url) return;
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
            console.error('Failed to cleanup file:', err);
          }
        };

        if (deleteTarget.coverImageUrl) await deleteNewsFileOnServer(deleteTarget.coverImageUrl);
        if (deleteTarget.documentUrl) await deleteNewsFileOnServer(deleteTarget.documentUrl);
        if (deleteTarget.galleryImages && deleteTarget.galleryImages.length > 0) {
          for (const imgUrl of deleteTarget.galleryImages) {
            await deleteNewsFileOnServer(imgUrl);
          }
        }

        setItems(items.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success('ลบข้อมูลโครงการบริการวิชาการเรียบร้อยแล้ว');
      } else {
        toast.error('ลบข้อมูลไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <FileText className="h-7 w-7 text-primary" /> จัดการบริการวิชาการแก่สังคม
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            บริหารจัดการโครงการบริการวิชาการเพื่อสังคม คลังงบประมาณ และรายชื่ออาจารย์ผู้รับผิดชอบ
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild variant="outline" className="rounded-sm gap-1.5 text-xs">
            <Link href="/admin/academic-services/settings">
              <Settings className="h-3.5 w-3.5 text-primary" /> ตั้งค่าข้อมูลติดต่อและแบบฟอร์ม
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-sm gap-1.5 text-xs">
            <Link href="/research/services" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> ดูหน้าเว็บจริง
            </Link>
          </Button>
          <Button asChild className="gap-2 rounded-sm text-xs font-semibold">
            <Link href="/admin/academic-services/create">
              <Plus className="h-4 w-4" /> เพิ่มโครงการใหม่
            </Link>
          </Button>
        </div>

      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border rounded-sm shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">โครงการทั้งหมด</span>
          <p className="text-2xl font-bold text-foreground">{metrics.total} <span className="text-xs font-normal text-muted-foreground">รายการ</span></p>
        </div>

        <div className="p-4 bg-card border rounded-sm shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">เผยแพร่สาธารณะ</span>
          <p className="text-2xl font-bold text-emerald-600">{metrics.published} <span className="text-xs font-normal text-muted-foreground">รายการ</span></p>
        </div>

        <div className="p-4 bg-card border rounded-sm shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">กำลังดำเนินการ</span>
          <p className="text-2xl font-bold text-amber-600">{metrics.ongoing} <span className="text-xs font-normal text-muted-foreground">รายการ</span></p>
        </div>

        <div className="p-4 bg-card border rounded-sm shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">งบประมาณรวมทั้งสิ้น</span>
          <p className="text-2xl font-bold text-foreground">
            ฿{metrics.totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <Card className="border-border/70 shadow-sm rounded-sm">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="ค้นหาชื่อโครงการ, พื้นที่ชุมชน, ชื่อหัวหน้าโครงการ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-sm h-9 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Service Type Filter */}
            <div className="lg:col-span-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">ทุกประเภทงานบริการ</option>
                {ACADEMIC_SERVICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">ทุกสถานะโครงการ</option>
                {ACADEMIC_SERVICE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Publish State Filter */}
            <div className="lg:col-span-2">
              <select
                value={publishFilter}
                onChange={(e) => setPublishFilter(e.target.value)}
                className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">ทุกการเผยแพร่</option>
                <option value="PUBLISHED">เผยแพร่แล้ว</option>
                <option value="DRAFT">ร่างค้างไว้</option>
              </select>
            </div>
          </div>

          {/* Active Filter Summary & Reset */}
          {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL' || publishFilter !== 'ALL') && (
            <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
              <span>พบผลลัพธ์ <strong>{filteredItems.length}</strong> จาก <strong>{items.length}</strong> รายการ</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-destructive hover:underline font-semibold"
              >
                <RotateCcw className="h-3 w-3" /> ล้างตัวกรอง
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. DATA TABLE */}
      <Card className="border-border/70 shadow-sm rounded-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground border-b text-xs">
                  <tr>
                    <th className="px-4 py-3 font-semibold">โครงการ / ข้อมูลสังเขป</th>
                    <th className="px-4 py-3 font-semibold">งบประมาณ & แหล่งทุน</th>
                    <th className="px-4 py-3 font-semibold">ประเภทบริการ</th>
                    <th className="px-4 py-3 font-semibold">สถานะโครงการ</th>
                    <th className="px-4 py-3 font-semibold text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <div className="max-w-xs mx-auto space-y-2">
                          <p className="text-sm">ไม่พบรายการโครงการบริการวิชาการที่ตรงกับเงื่อนไข</p>
                          <Button asChild size="sm" variant="outline" className="rounded-sm text-xs">
                            <Link href="/admin/academic-services/create">
                              <Plus className="h-3.5 w-3.5 mr-1" /> สร้างโครงการใหม่
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const leader = item.members?.find((m: any) => m.role === 'LEADER');
                      const leaderName = leader
                        ? `${leader.prefix || ''}${leader.firstNameTh || ''} ${leader.lastNameTh || ''}`.trim()
                        : '';
                      const statusConfig = getStatusConfig(item.status || 'ONGOING');

                      return (
                        <tr key={item.id} className="align-top hover:bg-muted/20 transition-colors">
                          {/* Col 1: Title & Summary */}
                          <td className="px-4 py-3.5 space-y-1.5 max-w-md">
                            <div className="flex items-start gap-3">
                              {/* Thumbnail preview */}
                              <div className="w-12 h-12 rounded-sm bg-muted border overflow-hidden shrink-0 relative flex items-center justify-center">
                                {item.coverImageUrl ? (
                                  <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                                )}
                              </div>

                              <div className="min-w-0 space-y-1">
                                <Link
                                  href={`/admin/academic-services/edit/${item.id}`}
                                  className="font-bold text-sm text-foreground hover:text-primary transition-colors leading-snug line-clamp-2"
                                >
                                  {item.title}
                                </Link>

                                <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                                  {leaderName && (
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3 text-muted-foreground" />
                                      <span>หัวหน้า: <strong>{leaderName}</strong></span>
                                    </span>
                                  )}
                                  {item.area && (
                                    <span className="flex items-center gap-1 text-slate-500">
                                      <MapPin className="w-3 h-3 text-scholar-accent" />
                                      <span>{item.area}</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                  {item.isPublished ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm">
                                      <CheckCircle2 className="w-2.5 h-2.5" /> เผยแพร่แล้ว
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm">
                                      <Clock className="w-2.5 h-2.5" /> ฉบับร่าง
                                    </span>
                                  )}

                                  {item.documentUrl && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-sm">
                                      PDF แนบ
                                    </span>
                                  )}

                                  {item.sdgIds && item.sdgIds.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-sm">
                                      SDG ({item.sdgIds.length})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Budget */}
                          <td className="px-4 py-3.5 space-y-1 text-xs">
                            {item.budget ? (
                              <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                                <Coins className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                ฿{Number(item.budget).toLocaleString()}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">ไม่ได้ระบุ</span>
                            )}
                            {item.fundingSource && (
                              <p className="text-muted-foreground truncate max-w-[140px]" title={item.fundingSource}>
                                ทุน: {item.fundingSource}
                              </p>
                            )}
                          </td>

                          {/* Col 3: Service Type */}
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground block">
                              {getServiceTypeLabel(item.serviceType)}
                            </span>
                          </td>

                          {/* Col 4: Status */}
                          <td className="px-4 py-3.5 text-xs">
                            <span className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-bold ${statusConfig.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                              {statusConfig.label}
                            </span>
                          </td>

                          {/* Col 5: Actions */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* View live public page */}
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground" title="ดูหน้าเว็บจริง">
                                <Link href={`/research/services/${item.id}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>

                              {/* Edit */}
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-sm hover:text-primary" title="แก้ไข">
                                <Link href={`/admin/academic-services/edit/${item.id}`}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Link>
                              </Button>

                              {/* Delete */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-sm"
                                onClick={() => setDeleteTarget(item)}
                                title="ลบโครงการ"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. CONFIRMATION MODAL */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive font-bold">ยืนยันการลบโครงการ</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              คุณต้องการลบโครงการ <strong>&ldquo;{deleteTarget?.title}&rdquo;</strong> ใช่หรือไม่?
              ไฟล์ภาพหน้าปก เอกสารประกอบ และคลังภาพทั้งหมดที่เชื่อมโยงกับโครงการนี้จะถูกลบออกจากระบบอย่างถาวร
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="rounded-sm">
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-sm">
              ยืนยันการลบข้อมูล
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
