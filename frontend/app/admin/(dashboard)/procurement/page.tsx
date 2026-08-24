'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  ExternalLink,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ProcurementRecord,
  PROCUREMENT_TYPES,
  PROCUREMENT_CATEGORIES,
  PROCUREMENT_STATUSES,
  getProcurementTypeLabel,
  getProcurementCategoryLabel,
  getProcurementStatusInfo,
  formatThaiBaht,
  formatThaiDate,
} from '@/lib/procurement';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminProcurementPage() {
  const [items, setItems] = useState<ProcurementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const currentBE = new Date().getFullYear() + 543;
  const [fiscalYear, setFiscalYear] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [procurementType, setProcurementType] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Delete Dialog Target
  const [deleteTarget, setDeleteTarget] = useState<ProcurementRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');

    const params = new URLSearchParams();
    if (fiscalYear) params.append('fiscalYear', fiscalYear);
    if (search) params.append('search', search);
    if (procurementType) params.append('procurementType', procurementType);
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', '15');

    try {
      const res = await fetch(`${API_URL}/api/procurement/admin/all?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        setItems(result.data || []);
        setTotal(result.meta?.total || 0);
        setTotalPages(result.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('ไม่สามารถดึงข้อมูลรายการจัดซื้อจัดจ้างได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, fiscalYear, procurementType, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/procurement/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success('ลบรายการจัดซื้อจัดจ้างสำเร็จ');
        setDeleteTarget(null);
        fetchItems();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการลบรายการ');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (item: ProcurementRecord) => {
    const token = localStorage.getItem('admin_token');
    const newStatus = !item.isPublished;

    try {
      const res = await fetch(`${API_URL}/api/procurement/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      if (res.ok) {
        toast.success(newStatus ? 'เผยแพร่ข้อมูลแล้ว' : 'ปิดการเผยแพร่แล้ว');
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, isPublished: newStatus } : it))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('ไม่สามารถเปลี่ยนสถานะการเผยแพร่ได้');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <span>จัดการรายการจัดซื้อจัดจ้าง (Procurement)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            บันทึก แก้ไขรายการจัดซื้อจัดจ้าง และจัดการไฟล์ PDF หลักฐานยืนยันความโปร่งใส
          </p>
        </div>

        <Link href="/admin/procurement/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            <span>เพิ่มรายการใหม่</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อโครงการ, รายการจัดซื้อ หรือผู้ชนะการเสนอราคา..."
              className="pl-9 text-xs"
            />
          </div>

          <Button type="submit" variant="secondary" size="sm" className="gap-2">
            <Search className="w-3.5 h-3.5" />
            ค้นหา
          </Button>

          {(search || fiscalYear || procurementType || status) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setFiscalYear('');
                setProcurementType('');
                setStatus('');
                setPage(1);
              }}
              className="text-xs"
            >
              ล้างตัวกรอง
            </Button>
          )}
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
          <div>
            <select
              value={fiscalYear}
              onChange={(e) => {
                setFiscalYear(e.target.value);
                setPage(1);
              }}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs shadow-sm"
            >
              <option value="">ทุกปีงบประมาณ</option>
              <option value={currentBE}>ปีงบประมาณ {currentBE}</option>
              <option value={currentBE - 1}>ปีงบประมาณ {currentBE - 1}</option>
              <option value={currentBE - 2}>ปีงบประมาณ {currentBE - 2}</option>
              <option value={currentBE - 3}>ปีงบประมาณ {currentBE - 3}</option>
            </select>
          </div>

          <div>
            <select
              value={procurementType}
              onChange={(e) => {
                setProcurementType(e.target.value);
                setPage(1);
              }}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs shadow-sm"
            >
              <option value="">ทุกวิธีจัดซื้อ</option>
              {PROCUREMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs shadow-sm"
            >
              <option value="">ทุกสถานะ</option>
              {PROCUREMENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs">กำลังโหลดข้อมูลจัดซื้อจัดจ้าง...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <ClipboardList className="w-10 h-10 mx-auto stroke-1" />
            <p className="text-sm font-medium">ไม่พบข้อมูลจัดซื้อจัดจ้าง</p>
            <p className="text-xs">คลิกปุ่ม &quot;เพิ่มรายการใหม่&quot; เพื่อเริ่มต้นสร้างรายการ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ปีงบ</th>
                  <th className="py-3 px-4 font-semibold">ชื่อโครงการ / รายการ</th>
                  <th className="py-3 px-4 font-semibold">วิธี / หมวดหมู่</th>
                  <th className="py-3 px-4 font-semibold text-right">วงเงินงบประมาณ</th>
                  <th className="py-3 px-4 font-semibold text-center">เอกสาร PDF</th>
                  <th className="py-3 px-4 font-semibold text-center">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-center">เผยแพร่</th>
                  <th className="py-3 px-4 font-semibold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const statusInfo = getProcurementStatusInfo(item.status);
                  const docsCount = item.documents?.length || 0;

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground shrink-0">
                        {item.fiscalYear}
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-semibold text-foreground line-clamp-1">{item.title}</p>
                        {item.vendorName && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            คู่สัญญา: {item.vendorName}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {getProcurementTypeLabel(item.procurementType)}
                          </span>
                          <p className="text-[11px] text-muted-foreground">
                            {getProcurementCategoryLabel(item.category)}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap font-medium text-foreground">
                        <p>{formatThaiBaht(item.budget)}</p>
                        {item.contractAmount && (
                          <p className="text-[10px] text-emerald-600">
                            จริง: {formatThaiBaht(item.contractAmount)}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            docsCount > 0
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <FileText className="w-3 h-3" />
                          {docsCount} ไฟล์
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                            item.isPublished
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {item.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>แสดงหน้าเว็บ</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>แบบร่าง</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/eservice/procurement/${item.id}`}
                            target="_blank"
                            className="p-1 text-muted-foreground hover:text-foreground rounded"
                            title="ดูหน้าสาธารณะ"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/procurement/${item.id}/edit`}
                            className="p-1 text-muted-foreground hover:text-primary rounded"
                            title="แก้ไข"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1 text-muted-foreground hover:text-destructive rounded"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer / Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              ทั้งหมด {total} รายการ (หน้า {page}/{totalPages})
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 text-xs"
              >
                ก่อนหน้า
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 text-xs"
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบรายการจัดซื้อจัดจ้าง</DialogTitle>
            <DialogDescription>
              คุณต้องการลบรายการ &quot;{deleteTarget?.title}&quot; หรือไม่?
              การลบนี้จะรวมถึงไฟล์ PDF ที่แนบไว้ทั้งหมด และไม่สามารถกู้คืนได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-1.5"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>ยืนยันการลบ</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
