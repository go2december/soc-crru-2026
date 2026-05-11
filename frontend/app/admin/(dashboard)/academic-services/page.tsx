'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Pencil, Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AcademicServiceItem, getServiceTypeLabel, getStatusLabel } from '@/lib/academic-services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminAcademicServicesPage() {
  const [items, setItems] = useState<AcademicServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<AcademicServiceItem | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/academic-services/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setItems(items.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FileText className="h-7 w-7 text-primary" /> จัดการบริการวิชาการ
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการโครงการ โครงการบริการวิชาการเพื่อสังคม และศูนย์บริการ
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="gap-2">
            <Link href="/admin/academic-services/create">
              <Plus className="h-4 w-4" /> เพิ่มรายการใหม่
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ชื่อโครงการ/บริการ</th>
                  <th className="px-4 py-3 font-medium">ประเภท</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                  <th className="px-4 py-3 font-medium">พื้นที่</th>
                  <th className="px-4 py-3 font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      ยังไม่มีรายการบริการวิชาการ
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-t align-top hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="font-medium text-base">{item.title}</div>
                        <div className="mt-1">
                          {item.isPublished ? (
                            <span className="text-xs text-emerald-600">● เผยแพร่แล้ว</span>
                          ) : (
                            <span className="text-xs text-amber-600">● ร่าง</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{getServiceTypeLabel(item.serviceType)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
                          {getStatusLabel(item.status || '')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{item.area || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/academic-services/edit/${item.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบ <strong>{deleteTarget?.title}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete}>ยืนยันการลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
