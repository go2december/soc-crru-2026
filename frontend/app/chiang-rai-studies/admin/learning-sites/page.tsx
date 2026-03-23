'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Loader2, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface LearningSite {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    author: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const deleteImageFromServer = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.startsWith('/uploads/chiang-rai/')) return;
    const token = localStorage.getItem('admin_token');
    try {
        await fetch(`${API_BASE}/api/upload/chiang-rai`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ url: imageUrl }),
        });
    } catch (err) {
        console.error('Failed to delete image:', err);
    }
};

const extractImageUrls = (html: string): string[] => {
    const matches = html.match(/src=["'](\/uploads\/chiang-rai\/[^"']+)["']/g);
    if (!matches) return [];
    return matches.map(m => m.replace(/src=["']/, '').replace(/["']$/, ''));
};



export default function AdminLearningSitesPage() {
    const [learningSites, setLearningSites] = useState<LearningSite[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<LearningSite | null>(null);

    useEffect(() => {
        fetchLearningSites();
    }, []);

    const fetchLearningSites = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/chiang-rai/learning-sites?limit=100`);
            if (res.ok) {
                const data = await res.json();
                setLearningSites(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching learning sites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const token = localStorage.getItem('admin_token');
        try {
            // Fetch full data to collect all image URLs before deleting
            const dataRes = await fetch(`${API_BASE}/api/chiang-rai/learning-sites/by-id/${deleteTarget.id}`);
            const imagesToDelete: string[] = [];
            if (dataRes.ok) {
                const data = await dataRes.json();
                if (data.thumbnailUrl?.startsWith('/uploads/chiang-rai/')) imagesToDelete.push(data.thumbnailUrl);
                (data.mediaUrls || []).forEach((url: string) => {
                    if (url.startsWith('/uploads/chiang-rai/')) imagesToDelete.push(url);
                });
                extractImageUrls(data.content || '').forEach(url => imagesToDelete.push(url));
            }
            // Delete the record
            const res = await fetch(`${API_BASE}/api/chiang-rai/learning-sites/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setLearningSites(prev => prev.filter(item => item.id !== deleteTarget.id));
                // Delete all associated images after successful record deletion
                await Promise.all(imagesToDelete.map(url => deleteImageFromServer(url)));
                setDeleteTarget(null);
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        } catch (error) {
            console.error('Error deleting learning site:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    const filteredSites = learningSites.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (<div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-600" size={32} /></div>);
    }

    return (
        <div className="space-y-6 animate-fade-in font-kanit">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">จัดการแหล่งเรียนรู้ทางวัฒนธรรม</h1>
                    <p className="text-stone-500 text-sm">Cultural Learning Sites Management</p>
                </div>
                <Button asChild className="gap-2 bg-purple-600 hover:bg-purple-700">
                    <Link href="/chiang-rai-studies/admin/learning-sites/create">
                        <Plus size={18} /> เพิ่มแหล่งเรียนรู้ใหม่
                    </Link>
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <Input type="text" placeholder="ค้นหาตามชื่อเรื่อง หรือ ผู้เขียน..." className="pl-10 border-stone-200 focus-visible:ring-purple-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* Table */}
            <Card className="overflow-hidden border-stone-200 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">ชื่อเรื่อง</th>
                                    <th className="p-4 font-semibold">ผู้เขียน</th>
                                    <th className="p-4 font-semibold">สถานะ</th>
                                    <th className="p-4 font-semibold">วันที่เผยแพร่</th>
                                    <th className="p-4 font-semibold text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredSites.length > 0 ? (
                                    filteredSites.map((item) => (
                                        <tr key={item.id} className="hover:bg-purple-50/30 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-400 flex-shrink-0">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-stone-800 truncate max-w-xs">{item.title}</p>
                                                        <p className="text-xs text-stone-400 truncate max-w-xs">/{item.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-stone-500 text-sm">{item.author || '-'}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isPublished !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                                                    {item.isPublished !== false ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-stone-500 text-sm">
                                                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('th-TH') : '-'}
                                            </td>
                                            <td className="p-4 text-right space-x-1">
                                                <Link href={`/chiang-rai-studies/learning-sites/${item.slug}`} target="_blank" className="inline-flex p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="ดูหน้าเว็บ">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link href={`/chiang-rai-studies/admin/learning-sites/edit/${item.id}`} className="inline-flex p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="แก้ไข">
                                                    <Pencil size={18} />
                                                </Link>
                                                <button onClick={() => setDeleteTarget(item)} className="inline-flex p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="ลบ">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-stone-400">{searchQuery ? 'ไม่พบผลลัพธ์ที่ค้นหา' : 'ยังไม่มีแหล่งเรียนรู้'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบแหล่งเรียนรู้</DialogTitle>
                        <DialogDescription>
                            คุณต้องการลบ <strong>{deleteTarget?.title}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDelete}>ยืนยันลบ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
