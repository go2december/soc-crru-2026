'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Handshake,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Search,
  Filter,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Eye,
  EyeOff,
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
  MOU_PARTNER_TYPES,
  MouItem,
  getPartnerTypeConfig,
} from '@/lib/mous';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminMousPage() {
  const [items, setItems] = useState<MouItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<MouItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState('ALL');
  const [publishFilter, setPublishFilter] = useState('ALL');

  const fetchItems = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/mous/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      } else {
        toast.error('ไม่สามารถดึงข้อมูล MOU ได้');
      }
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const published = items.filter((i) => i.isPublished).length;
    const active = items.filter((i) => i.isActive).length;
    return { total, published, active };
  }, [items]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (partnerTypeFilter !== 'ALL' && item.partnerType !== partnerTypeFilter) {
        return false;
      }
      if (publishFilter === 'PUBLISHED' && !item.isPublished) return false;
      if (publishFilter === 'DRAFT' && item.isPublished) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchPartner = item.partnerName?.toLowerCase().includes(q);
        const matchScope = item.scope?.toLowerCase().includes(q);
        return matchTitle || matchPartner || matchScope;
      }
      return true;
    });
  }, [items, partnerTypeFilter, publishFilter, searchQuery]);

  // Toggle publish
  const handleTogglePublish = async (item: MouItem) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/mous/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        toast.success(
          !item.isPublished ? 'เผยแพร่ MOU แล้ว' : 'ยกเลิกการเผยแพร่แล้ว',
        );
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, isPublished: !i.isPublished } : i,
          ),
        );
      } else {
        toast.error('ไม่สามารถเปลี่ยนสถานะได้');
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการบันทึกสถานะ');
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/mous/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('ลบบันทึกข้อตกลงความร่วมมือเรียบร้อยแล้ว');
        setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error('ไม่สามารถลบข้อมูลได้');
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-scholar-accent/10 text-scholar-accent">
              <Handshake className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              เครือข่ายความร่วมมือและ MOU
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            จัดการข้อมูลบันทึกข้อตกลงความร่วมมือทางวิชาการและการพัฒนาสังคม
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="bg-scholar-accent hover:bg-red-700 text-white">
            <Link href="/admin/mou/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>เพิ่มบันทึกข้อตกลง (MOU)</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                MOU ทั้งหมด
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {metrics.total}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                สถานะมีผลบังคับใช้
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {metrics.active}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                เผยแพร่บนเว็บ
              </p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {metrics.published}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="ค้นหาชื่อ MOU หรือชื่อหน่วยงาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={partnerTypeFilter}
              onChange={(e) => setPartnerTypeFilter(e.target.value)}
              className="h-10 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-scholar-accent"
            >
              <option value="ALL">ทุกประเภทภาคี</option>
              {MOU_PARTNER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={publishFilter}
              onChange={(e) => setPublishFilter(e.target.value)}
              className="h-10 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-scholar-accent"
            >
              <option value="ALL">สถานะเผยแพร่ทั้งหมด</option>
              <option value="PUBLISHED">เผยแพร่แล้ว</option>
              <option value="DRAFT">แบบร่าง (ยังไม่เผยแพร่)</option>
            </select>

            {(searchQuery || partnerTypeFilter !== 'ALL' || publishFilter !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setPartnerTypeFilter('ALL');
                  setPublishFilter('ALL');
                }}
                className="text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                ล้างตัวกรอง
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-scholar-accent" />
            <p className="text-sm">กำลังโหลดข้อมูล MOU...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Handshake className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-700">ไม่พบข้อมูลบันทึกข้อตกลง</p>
            <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง หรือเพิ่ม MOU รายการแรก</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">องค์กร / หน่วยงาน</th>
                  <th className="py-3 px-4">หัวข้อข้อตกลงความร่วมมือ</th>
                  <th className="py-3 px-4">ประเภทภาคี</th>
                  <th className="py-3 px-4">ระยะเวลา</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                  <th className="py-3 px-4 text-center">เผยแพร่</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const partnerConfig = getPartnerTypeConfig(item.partnerType);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Partner */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {item.partnerLogoUrl ? (
                              <img
                                src={item.partnerLogoUrl}
                                alt={item.partnerName}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {item.partnerName}
                            </span>
                            {item.websiteUrl && (
                              <a
                                href={item.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                              >
                                เว็บไซต์หน่วยงาน <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 line-clamp-2">
                          {item.title}
                        </span>
                        {item.scope && (
                          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.scope}
                          </span>
                        )}
                      </td>

                      {/* Partner Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${partnerConfig.badgeColor}`}
                        >
                          {partnerConfig.label}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600">
                        {item.startDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(item.startDate).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                              })}
                              {item.endDate
                                ? ` - ${new Date(item.endDate).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'short',
                                  })}`
                                : ' (ต่อเนื่อง)'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> มีผลบังคับใช้
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                            <XCircle className="w-3 h-3" /> สิ้นสุดระยะเวลา
                          </span>
                        )}
                      </td>

                      {/* Publish Toggle */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            item.isPublished
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {item.isPublished ? (
                            <>
                              <Eye className="w-3.5 h-3.5" /> เผยแพร่
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> ร่าง
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600"
                          >
                            <Link href={`/admin/mou/edit/${item.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(item)}
                            className="h-8 w-8 p-0 text-slate-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบบันทึกข้อตกลงความร่วมมือ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบข้อตกลงความร่วมมือกับ &ldquo;{deleteTarget?.partnerName}&rdquo; ใช่หรือไม่?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังลบ...
                </>
              ) : (
                'ยืนยันลบ'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
