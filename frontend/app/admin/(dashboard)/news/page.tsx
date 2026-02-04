'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Pencil,
    Trash2,
    Newspaper,
    Calendar,
    Megaphone,
    FileText
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
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

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/news/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                fetchNews();
                setIsDeleteOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'NEWS':
                return <Badge variant="info"><Newspaper className="w-3 h-3 mr-1" /> ข่าวประชาสัมพันธ์</Badge>;
            case 'EVENT':
                return <Badge variant="purple"><Calendar className="w-3 h-3 mr-1" /> กิจกรรม</Badge>;
            case 'ANNOUNCE':
                return <Badge variant="warning"><Megaphone className="w-3 h-3 mr-1" /> ประกาศทั่วไป</Badge>;
            default:
                return <Badge variant="secondary">{category}</Badge>;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        จัดการข่าวสาร
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">สร้างและจัดการข่าวสาร กิจกรรม และประกาศต่างๆ</p>
                </div>
                <Button asChild>
                    <Link href="/admin/news/create">
                        <Plus className="mr-2 h-4 w-4" /> สร้างข่าวใหม่
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>หัวข้อข่าว</TableHead>
                                <TableHead>หมวดหมู่</TableHead>
                                <TableHead>วันที่เผยแพร่</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                        ยังไม่มีข่าวสารในระบบ
                                    </TableCell>
                                </TableRow>
                            ) : (
                                newsList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium max-w-sm truncate" title={item.title}>
                                            {item.title}
                                        </TableCell>
                                        <TableCell>
                                            {getCategoryBadge(item.category)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(item.publishedAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {item.isPublished ?
                                                <div className="flex items-center text-xs font-medium text-green-700 dark:text-green-300">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                    เผยแพร่แล้ว
                                                </div> :
                                                <div className="flex items-center text-xs font-medium text-yellow-700 dark:text-yellow-300">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                                                    แบบร่าง
                                                </div>
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Link href={`/admin/news/edit/${item.id}`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setDeleteTarget(item);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบข่าว</DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ที่จะลบข่าว <strong>"{deleteTarget?.title}"</strong>?
                            <br />การกระทำนี้ไม่สามารถยกเลิกได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
