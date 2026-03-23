'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface News {
    id: string;
    title: string;
    category: 'NEWS' | 'EVENT' | 'ANNOUNCE';
    publishedAt: string;
    isPublished: boolean;
}

export default function AdminNewsPage() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<News | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        try {
            const res = await fetch(`${apiUrl}/api/news`);
            if (res.ok) {
                const data = await res.json();
                setNewsList(data);
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/news/${deleteTarget.id}`, {
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
                    <p className="text-sm text-muted-foreground">จัดการรายการข่าว กิจกรรม และประกาศของคณะ</p>
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
                                <th className="px-4 py-3 font-medium">วันที่เผยแพร่</th>
                                <th className="px-4 py-3 font-medium">สถานะ</th>
                                <th className="px-4 py-3 font-medium">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsList.map((item) => (
                                <tr key={item.id} className="border-t align-middle hover:bg-muted/20">
                                    <td className="px-4 py-3 font-medium">{item.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', item.category === 'NEWS'
                                            ? 'bg-primary/10 text-primary'
                                            : item.category === 'EVENT'
                                                ? 'bg-slate-100 text-slate-700'
                                                : 'bg-amber-100 text-amber-700')}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {new Date(item.publishedAt).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.isPublished ?
                                            <span className="text-xs text-emerald-600">● เผยแพร่แล้ว</span> :
                                            <span className="text-xs text-amber-600">● ร่าง</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button asChild variant="ghost" size="sm" className="gap-1">
                                                <Link href={`/admin/news/edit/${item.id}`}>
                                                    <Pencil className="h-4 w-4" /> แก้ไข
                                                </Link>
                                            </Button>
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
