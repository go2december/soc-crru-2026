'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, Paperclip, Pencil, Plus, Trash2 } from 'lucide-react';
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
import {
    FACULTY_NEWS_CATEGORY_LABELS,
    FACULTY_NEWS_CATEGORY_STYLES,
    FacultyNewsItem,
    formatFacultyNewsDate,
} from '@/lib/faculty-news';
import AdminPagination from '@/components/AdminPagination';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminNewsPage() {
    const [newsList, setNewsList] = useState<FacultyNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<FacultyNewsItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchNews();
    }, [currentPage]);

    const fetchNews = async () => {
        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/news/admin/all?page=${currentPage}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.data) {
                    setNewsList(data.data);
                    setTotalPages(data.meta.totalPages);
                } else {
                    setNewsList(data);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNews = async () => {
        if (!deleteTarget) return;
        const token = localStorage.getItem('admin_token');

        try {
            const res = await fetch(`${API_URL}/api/news/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                await fetchNews();
                setDeleteTarget(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold"><Newspaper className="h-7 w-7 text-primary" />จัดการข่าวสาร</h1>
                    <p className="text-sm text-muted-foreground">จัดการข่าวประชาสัมพันธ์ กิจกรรม ประกาศ และสมัครงาน พร้อมรูปภาพหลายภาพและไฟล์แนบ</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/admin/news/create">
                        <Plus className="h-4 w-4" />
                        สร้างข่าวใหม่
                    </Link>
                </Button>
            </div>

            <Card className="border-border/70 shadow-sm">
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">หัวข้อข่าว</th>
                                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                                <th className="px-4 py-3 font-medium">ไฟล์ประกอบ</th>
                                <th className="px-4 py-3 font-medium">วันที่เผยแพร่</th>
                                <th className="px-4 py-3 font-medium">สถานะ</th>
                                <th className="px-4 py-3 font-medium">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsList.map((item) => (
                                <tr key={item.id} className="border-t align-middle hover:bg-muted/20">
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">slug: {item.slug}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${FACULTY_NEWS_CATEGORY_STYLES[item.category]}`}>
                                            {FACULTY_NEWS_CATEGORY_LABELS[item.category]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        <div className="flex flex-col gap-1">
                                            <span>{item.mediaUrls?.length || 0} รูป</span>
                                            <span className="inline-flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" /> {item.attachments?.length || 0} ไฟล์</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {formatFacultyNewsDate(item.publishedAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.isPublished ?
                                            <span className="text-xs text-emerald-600">● เผยแพร่แล้ว</span> :
                                            <span className="text-xs text-amber-600">● ร่าง</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Button asChild variant="ghost" size="sm" className="gap-1">
                                                <Link href={`/admin/news/edit/${item.id}`}>
                                                    <Pencil className="h-4 w-4" /> แก้ไข
                                                </Link>
                                            </Button>
                                            {item.isPublished && (
                                                <Button asChild variant="ghost" size="sm" className="gap-1">
                                                    <Link href={`/news/${item.slug}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" /> ดูหน้าเว็บ
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button onClick={() => setDeleteTarget(item)} variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" /> ลบ
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {newsList.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">ยังไม่มีข่าวสารในระบบ</div>
                    )}
                </CardContent>
            </Card>

            <AdminPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบข่าว</DialogTitle>
                        <DialogDescription>
                            ต้องการลบ <strong>{deleteTarget?.title}</strong> ใช่หรือไม่?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={deleteNews}>ยืนยันลบ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
