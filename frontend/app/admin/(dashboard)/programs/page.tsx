'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit3, Trash2, GraduationCap, AlertTriangle } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

interface Program {
    id: string;
    code: string;
    nameTh: string;
    degreeLevel: string;
    isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminProgramsPage() {
    const router = useRouter();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPrograms = async () => {
        try {
            const res = await fetch(`${API_URL}/api/programs`);
            if (res.ok) {
                const data = await res.json();
                setPrograms(data);
            }
        } catch (error) {
            console.error('Fetch programs error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleDelete = async () => {
        if (!programToDelete) return;
        setDeleting(true);

        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/programs/${programToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                await fetchPrograms();
                setProgramToDelete(null);
            } else {
                alert('Failed to delete program');
            }
        } catch (error) {
            console.error('Error deleting program:', error);
        } finally {
            setDeleting(false);
        }
    };

    const filteredPrograms = programs.filter(p => 
        p.nameTh.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const degreeBadgeColor = (level: string) => {
        switch (level) {
            case 'BACHELOR': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'MASTER': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'PHD': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const degreeBadgeText = (level: string) => {
        switch (level) {
            case 'BACHELOR': return 'ปริญญาตรี';
            case 'MASTER': return 'ปริญญาโท';
            case 'PHD': return 'ปริญญาเอก';
            default: return level;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-primary" /> จัดการหลักสูตร
                    </h1>
                    <p className="opacity-70 text-sm">จัดการข้อมูลหลักสูตรการศึกษา ข้อมูลรายวิชา และคณาจารย์ประจำหลักสูตร</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Input
                            type="text"
                            placeholder="ค้นหาชื่อหลักสูตร หรือ รหัส..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">
                            <Search className="h-5 w-5" />
                        </span>
                    </div>
                    <Button
                        onClick={() => router.push('/admin/programs/new')}
                        className="gap-2 whitespace-nowrap"
                    >
                        <Plus className="h-5 w-5" />
                        เพิ่มหลักสูตรใหม่
                    </Button>
                </div>
            </div>

            {/* List */}
            <Card className="border-border/70 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40 text-left text-muted-foreground">
                                <tr>
                                    <th className="w-16 px-4 py-3 text-center font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">รหัส / ชื่อหลักสูตร</th>
                                    <th className="px-4 py-3 font-medium">ระดับการศึกษา</th>
                                    <th className="px-4 py-3 font-medium text-center">สถานะ</th>
                                    <th className="px-4 py-3 text-right font-medium">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPrograms.map((prog, index) => (
                                    <tr key={prog.id} className="border-b align-middle hover:bg-muted/20">
                                        <td className="px-4 py-3 text-center text-muted-foreground">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base">{prog.nameTh}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{prog.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${degreeBadgeColor(prog.degreeLevel)}`}>
                                                <GraduationCap className="h-3.5 w-3.5" />
                                                {degreeBadgeText(prog.degreeLevel)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${prog.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                {prog.isActive ? 'เผยแพร่' : 'ซ่อน'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => router.push(`/admin/programs/${prog.id}`)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-sky-600"
                                                    title="แก้ไขข้อมูลหลักสูตร"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => setProgramToDelete(prog)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    title="ลบหลักสูตร"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPrograms.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground">
                                            ไม่พบข้อมูลหลักสูตร
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!programToDelete} onOpenChange={(open) => !open && setProgramToDelete(null)}>
                <DialogContent>
                    <DialogHeader className="items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <DialogTitle>ยืนยันการลบหลักสูตร?</DialogTitle>
                        <DialogDescription>
                            ต้องการลบหลักสูตร <strong>{programToDelete?.nameTh}</strong> หรือไม่? <br/>ข้อมูลที่เกี่ยวข้อง รวมถึงอาจารย์ประจำหลักสูตรจะถูกลบทั้งหมด
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 sm:justify-center">
                        <Button variant="ghost" onClick={() => setProgramToDelete(null)} disabled={deleting}>
                            ยกเลิก
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
