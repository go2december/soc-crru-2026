'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import AdminPagination from '@/components/AdminPagination';
import {
  RESEARCH_STATUS_LABELS,
  RESEARCH_STATUS_STYLES,
  ResearchListResponse,
  ResearchProjectAdminItem,
} from '@/lib/research';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminResearchPage() {
  const [items, setItems] = useState<ResearchProjectAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ResearchProjectAdminItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '10',
      });

      if (query.trim()) {
        params.set('q', query.trim());
      }

      const res = await fetch(`${API_URL}/api/research/admin/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch research projects');
      }

      const data = (await res.json()) as ResearchListResponse;
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการวิจัย');
    } finally {
      setLoading(false);
    }
  }, [currentPage, query]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_URL}/api/research/projects/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      await fetchProjects();
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการลบโครงการวิจัย');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FileText className="h-7 w-7 text-primary" /> จัดการฐานข้อมูลงานวิจัย
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการโครงการวิจัย ผลผลิตวิชาการ ทีมวิจัย พื้นที่ดำเนินการ และเอกสารเผยแพร่
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/research/create">
            <Plus className="h-4 w-4" /> สร้างโครงการใหม่
          </Link>
        </Button>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="ค้นหาชื่อโครงการ / บทคัดย่อ"
                className="pl-9"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => { setCurrentPage(1); setQuery(searchInput); }}>
              ค้นหา
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setSearchInput(''); setQuery(''); setCurrentPage(1); }}>
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-medium">ปี</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">ผลกระทบ</th>
                <th className="px-4 py-3 font-medium">ทีม / SDGs</th>
                <th className="px-4 py-3 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t align-top hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium">{item.titleTh}</p>
                      <p className="text-xs text-muted-foreground">slug: {item.slug}</p>
                      {item.fundingSource && (
                        <p className="text-xs text-muted-foreground">แหล่งทุน: {item.fundingSource}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.year}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${RESEARCH_STATUS_STYLES[item.status]}`}>
                        {RESEARCH_STATUS_LABELS[item.status]}
                      </span>
                      <div>
                        {item.isPublished ? (
                          <span className="text-xs text-emerald-600">● เผยแพร่แล้ว</span>
                        ) : (
                          <span className="text-xs text-amber-600">● ร่าง</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <div className="space-y-1">
                      <div>{item.isSocialService ? 'รับใช้สังคม' : 'ไม่ระบุด้านสังคม'}</div>
                      <div>{item.isCommercial ? 'เชิงพาณิชย์' : 'ไม่ระบุเชิงพาณิชย์'}</div>
                      <div>{item.outputCount} ผลผลิต / {item.attachmentCount} ไฟล์</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <div className="space-y-2">
                      <div>{item.memberDisplay.slice(0, 2).join(', ') || 'ยังไม่ระบุทีม'}</div>
                      <div className="flex flex-wrap gap-1">
                        {item.sdgIds.length > 0 ? item.sdgIds.map((sdgId) => (
                          <span key={sdgId} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">SDG {sdgId}</span>
                        )) : <span>ยังไม่ระบุ SDGs</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="ghost" size="sm" className="gap-1">
                        <Link href={`/admin/research/edit/${item.id}`}>
                          <Pencil className="h-4 w-4" /> แก้ไข
                        </Link>
                      </Button>
                      {item.isPublished && (
                        <Button asChild variant="ghost" size="sm" className="gap-1">
                          <Link href={`/research/database?slug=${item.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" /> ดูหน้าเว็บ
                          </Link>
                        </Button>
                      )}
                      <Button type="button" onClick={() => setDeleteTarget(item)} variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" /> ลบ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">ยังไม่มีโครงการวิจัยในระบบ</div>
          )}
        </CardContent>
      </Card>

      <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">ยืนยันการลบโครงการวิจัย</DialogTitle>
            <DialogDescription>
              ต้องการลบ <strong>{deleteTarget?.titleTh}</strong> ใช่หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={deleteProject}>ยืนยันลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
