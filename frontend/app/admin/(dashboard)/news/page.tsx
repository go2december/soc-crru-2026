'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, Paperclip, Pencil, Plus, Trash2, CheckCircle2, XCircle, SendHorizontal, AlertCircle } from 'lucide-react';
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
    const [userRole, setUserRole] = useState<string>('GUEST');
    const [userDeptId, setUserDeptId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [deleteTarget, setDeleteTarget] = useState<FacultyNewsItem | null>(null);
    const [rejectTarget, setRejectTarget] = useState<FacultyNewsItem | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        fetchNews();
    }, [currentPage]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.roles?.includes('ADMIN')) setUserRole('ADMIN');
                else if (data.roles?.includes('EDITOR')) setUserRole('EDITOR');
                else if (data.roles?.includes('STAFF')) setUserRole('STAFF');
                setUserDeptId(data.departmentId ?? null);
            }
        } catch (e) {
            console.error('Error fetching profile:', e);
        }
    };

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

    const handleApprove = async (id: string) => {
        const token = localStorage.getItem('admin_token');
        setActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/news/${id}/approve`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                await fetchNews();
            } else {
                alert('ไม่สามารถอนุมัติได้');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        const token = localStorage.getItem('admin_token');
        setActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/news/${rejectTarget.id}/reject`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reason: rejectReason }),
            });
            if (res.ok) {
                setRejectTarget(null);
                setRejectReason('');
                await fetchNews();
            } else {
                alert('ไม่สามารถส่งกลับแก้ไขได้');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitReview = async (id: string) => {
        const token = localStorage.getItem('admin_token');
        setActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/news/${id}/submit-review`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                await fetchNews();
            } else {
                alert('ไม่สามารถส่งขออนุมัติได้');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
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

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
                {[
                    { id: 'ALL', label: 'ทั้งหมด' },
                    { id: 'PENDING_REVIEW', label: 'รอตรวจสอบอนุมัติ' },
                    { id: 'PUBLISHED', label: 'เผยแพร่แล้ว' },
                    { id: 'DRAFT', label: 'ฉบับร่าง' },
                    { id: 'REJECTED', label: 'ส่งกลับแก้ไข' },
                ].map(tab => {
                    const count = tab.id === 'ALL'
                        ? newsList.length
                        : newsList.filter(n => (n.publicationStatus || (n.isPublished ? 'PUBLISHED' : 'DRAFT')) === tab.id).length;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                statusFilter === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <Card className="border-border/70 shadow-sm">
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">หัวข้อข่าว</th>
                                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                                <th className="px-4 py-3 font-medium">ไฟล์ประกอบ</th>
                                <th className="px-4 py-3 font-medium">สถานะ Workflow</th>
                                <th className="px-4 py-3 font-medium">จัดการ & อนุมัติ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsList
                                .filter(item => {
                                    const currentStatus = item.publicationStatus || (item.isPublished ? 'PUBLISHED' : 'DRAFT');
                                    if (statusFilter === 'ALL') return true;
                                    return currentStatus === statusFilter;
                                })
                                .map((item) => {
                                    const currentStatus = item.publicationStatus || (item.isPublished ? 'PUBLISHED' : 'DRAFT');

                                    return (
                                        <tr key={item.id} className="border-t align-middle hover:bg-muted/20">
                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">slug: {item.slug}</p>
                                                    {item.rejectReason && currentStatus === 'REJECTED' && (
                                                        <div className="flex items-center gap-1 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 p-1 rounded border border-rose-200">
                                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                            <span>เหตุผลส่งกลับ: {item.rejectReason}</span>
                                                        </div>
                                                    )}
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
                                            <td className="px-4 py-3">
                                                {currentStatus === 'PUBLISHED' && (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3" /> เผยแพร่แล้ว
                                                    </span>
                                                )}
                                                {currentStatus === 'PENDING_REVIEW' && (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold animate-pulse">
                                                        <AlertCircle className="w-3 h-3" /> รอแอดมินตรวจสอบ
                                                    </span>
                                                )}
                                                {currentStatus === 'DRAFT' && (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                                        ● ฉบับร่าง
                                                    </span>
                                                )}
                                                {currentStatus === 'REJECTED' && (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                                        <XCircle className="w-3 h-3" /> ส่งกลับแก้ไข
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {/* Workflow Actions for Admin */}
                                                    {userRole === 'ADMIN' && currentStatus === 'PENDING_REVIEW' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                onClick={() => handleApprove(item.id)}
                                                                disabled={actionLoading}
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" /> อนุมัติเผยแพร่
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                                onClick={() => { setRejectTarget(item); setRejectReason(''); }}
                                                                disabled={actionLoading}
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" /> ตีกลับ
                                                            </Button>
                                                        </>
                                                    )}

                                                    {/* Workflow Action for Editor / Draft / Rejected */}
                                                    {(currentStatus === 'DRAFT' || currentStatus === 'REJECTED') && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="h-8 gap-1 text-primary"
                                                            onClick={() => handleSubmitReview(item.id)}
                                                            disabled={actionLoading}
                                                            title="ส่งให้ Admin ตรวจสอบเพื่อเผยแพร่"
                                                        >
                                                            <SendHorizontal className="h-3.5 w-3.5" /> ส่งตรวจ
                                                        </Button>
                                                    )}

                                                    <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                                                        <Link href={`/admin/news/edit/${item.id}`}>
                                                            <Pencil className="h-3.5 w-3.5" /> แก้ไข
                                                        </Link>
                                                    </Button>
                                                    {item.isPublished && (
                                                        <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                                                            <Link href={`/news/${item.slug}`} target="_blank">
                                                                <ExternalLink className="h-3.5 w-3.5" /> หน้าเว็บ
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button onClick={() => setDeleteTarget(item)} variant="ghost" size="sm" className="h-8 gap-1 text-destructive hover:text-destructive">
                                                        <Trash2 className="h-3.5 w-3.5" /> ลบ
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    {newsList.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">ยังไม่มีข่าวสารในระบบ</div>
                    )}
                </CardContent>
            </Card>

            {/* Reject Reason Modal */}
            <Dialog open={!!rejectTarget} onOpenChange={(open) => { if (!open) setRejectTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">ส่งกลับแก้ไข: {rejectTarget?.title}</DialogTitle>
                        <DialogDescription>
                            กรุณาระบุเหตุผลหรือสิ่งที่ต้องการให้ผู้ร่างปรับปรุงแก้ไขก่อนเผยแพร่
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <textarea
                            className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            rows={3}
                            placeholder="ระบุเหตุผล เช่น ข้อมูลเอกสารแนบไม่ครบถ้วน..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setRejectTarget(null)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
                            ยืนยันส่งกลับ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
