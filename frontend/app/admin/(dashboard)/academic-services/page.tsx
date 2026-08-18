'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Pencil, Plus, Trash2, Loader2, Coins } from 'lucide-react';
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
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminAcademicServicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/academic-services/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Delete uploaded files on server (cover image and documents if they exist)
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FileText className="h-7 w-7 text-primary" /> จัดการบริการวิชาการ
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการโครงการบริการวิชาการเพื่อสังคม คลังงบประมาณ และรายชื่อผู้รับผิดชอบหลัก
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="gap-2 rounded-sm">
            <Link href="/admin/academic-services/create">
              <Plus className="h-4 w-4" /> เพิ่มรายการใหม่
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm rounded-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ชื่อโครงการ/ผู้รับผิดชอบ</th>
                    <th className="px-4 py-3 font-semibold">งบประมาณ & ทุน</th>
                    <th className="px-4 py-3 font-semibold">ประเภท</th>
                    <th className="px-4 py-3 font-semibold">สถานะ</th>
                    <th className="px-4 py-3 font-semibold">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        ยังไม่มีรายการบริการวิชาการในระบบ
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const leader = item.members?.find((m: any) => m.role === 'LEADER');
                      const leaderName = leader ? `${leader.prefix || ''}${leader.firstNameTh || ''} ${leader.lastNameTh || ''}`.trim() : '';

                      return (
                        <tr key={item.id} className="align-top hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 space-y-1">
                            <div className="font-semibold text-base text-gray-900 leading-snug">{item.title}</div>
                            
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                              {leaderName ? (
                                <span>หัวหน้าโครงการ: <strong className="text-gray-700 font-medium">{leaderName}</strong></span>
                              ) : (
                                <span className="text-gray-400">ยังไม่ระบุหัวหน้าโครงการ</span>
                              )}
                              {item.area && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <span>พื้นที่: {item.area}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              {item.isPublished ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded-sm">
                                  เผยแพร่แล้ว
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 rounded-sm">
                                  ร่างค้างไว้
                                </span>
                              )}
                              {item.documentUrl && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200/50 px-1.5 py-0.5 rounded-sm">
                                  มีเอกสารแนบ PDF
                                </span>
                              )}
                              {item.sdgIds && item.sdgIds.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-1.5 py-0.5 rounded-sm">
                                  SDG ({item.sdgIds.length})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 space-y-1 text-xs">
                            {item.budget ? (
                              <div className="flex items-center gap-1 font-bold text-gray-800 text-sm">
                                <Coins className="h-3.5 w-3.5 text-amber-500" />
                                ฿{Number(item.budget).toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-gray-400">ไม่ได้ระบุงบประมาณ</div>
                            )}
                            {item.fundingSource && (
                              <div className="text-muted-foreground truncate max-w-[150px]" title={item.fundingSource}>
                                ทุน: {item.fundingSource}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{getServiceTypeLabel(item.serviceType)}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-sm border px-2 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                              {getStatusLabel(item.status || '')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-sm">
                                <Link href={`/admin/academic-services/edit/${item.id}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-sm"
                                onClick={() => setDeleteTarget(item)}
                              >
                                <Trash2 className="h-4 w-4" />
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

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive font-bold">ยืนยันการลบโครงการ</DialogTitle>
            <DialogDescription className="text-sm">
              คุณต้องการลบโครงการ <strong>{deleteTarget?.title}</strong> ใช่หรือไม่? รูปภาพและไฟล์เอกสารทั้งหมดที่เชื่อมโยงกับโครงการนี้จะถูกลบออกจากเซิร์ฟเวอร์ด้วย และการกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="rounded-sm">ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-sm">ยืนยันการลบข้อมูล</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
