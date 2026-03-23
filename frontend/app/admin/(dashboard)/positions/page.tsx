'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Edit3, Trash2, Shield, GraduationCap, GripVertical } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Position {
    id: number;
    nameTh: string;
    nameEn: string | null;
    sortOrder: number;
}

export default function ManagePositionsPage() {
    const [academicPositions, setAcademicPositions] = useState<Position[]>([]);
    const [adminPositions, setAdminPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);

    // Form inputs
    const [formData, setFormData] = useState({ id: 0, nameTh: '', nameEn: '', sortOrder: 0, type: 'ACADEMIC' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [acadRes, adminRes] = await Promise.all([
                fetch(`${API_URL}/api/staff/academic-positions`),
                fetch(`${API_URL}/api/staff/admin-positions`)
            ]);
            if (acadRes.ok) setAcademicPositions(await acadRes.json());
            if (adminRes.ok) setAdminPositions(await adminRes.json());
        } catch (error) {
            console.error('Failed to fetch positions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (type: string, position?: Position) => {
        if (position) {
            setFormData({ id: position.id, nameTh: position.nameTh, nameEn: position.nameEn || '', sortOrder: position.sortOrder, type });
            setIsEditing(true);
        } else {
            setFormData({ id: 0, nameTh: '', nameEn: '', sortOrder: 0, type });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const endpoint = formData.type === 'ACADEMIC' ? '/api/staff/academic-positions' : '/api/staff/admin-positions';
        const url = isEditing ? `${API_URL}${endpoint}/${formData.id}` : `${API_URL}${endpoint}`;

        try {
            const payload = {
                nameTh: formData.nameTh.trim(),
                nameEn: formData.nameEn.trim() || undefined,
                sortOrder: Number(formData.sortOrder)
            };
            const res = await fetch(url, {
                method: isEditing ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await fetchData();
                handleCloseModal();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error(error);
            alert('Cannot connect to server');
        }
    };

    const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: string; nameTh: string } | null>(null);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const token = localStorage.getItem('admin_token');
        const endpoint = deleteTarget.type === 'ACADEMIC' ? '/api/staff/academic-positions' : '/api/staff/admin-positions';

        try {
            const res = await fetch(`${API_URL}${endpoint}/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                await fetchData();
                setDeleteTarget(null);
            } else {
                const text = await res.text();
                alert(`ไม่สามารถลบได้: ${text}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderTable = (title: string, data: Position[], type: string, icon: React.ReactNode) => (
        <Card className="border-border/70 shadow-sm">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">{icon} {title}</h2>
                    <Button onClick={() => handleOpenModal(type)} size="sm" className="gap-1">
                        <Plus className="w-4 h-4" /> เพิ่มข้อมูล
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">ลำดับแสดงผล</th>
                                <th className="px-4 py-3 font-medium">ชื่อตำแหน่ง (TH)</th>
                                <th className="px-4 py-3 font-medium">ชื่อตำแหน่ง (EN)</th>
                                <th className="px-4 py-3 text-right font-medium">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="border-t align-middle hover:bg-muted/20">
                                    <td className="px-4 py-3 font-mono">{item.sortOrder}</td>
                                    <td className="px-4 py-3 font-medium text-primary">{item.nameTh}</td>
                                    <td className="px-4 py-3">{item.nameEn || <span className="text-muted-foreground">-</span>}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button onClick={() => handleOpenModal(type, item)} variant="ghost" size="icon" className="h-8 w-8 text-sky-600"><Edit3 className="w-4 h-4" /></Button>
                                            <Button onClick={() => setDeleteTarget({ id: item.id, type, nameTh: item.nameTh })} variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">ยังไม่มีข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                    <GripVertical className="w-8 h-8 text-primary" /> จัดการตำแหน่งบุคลากร
                </h1>
                <p className="opacity-70 text-sm">เพิ่ม ลบ และแก้ไขตำแหน่งทางวิชาการและตำแหน่งบริหาร</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {renderTable('ตำแหน่งทางวิชาการ', academicPositions, 'ACADEMIC', <GraduationCap className="text-accent" />)}
                {renderTable('ตำแหน่งบริหาร', adminPositions, 'ADMIN', <Shield className="text-secondary" />)}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'แก้ไข' : 'เพิ่ม'}{formData.type === 'ACADEMIC' ? 'ตำแหน่งทางวิชาการ' : 'ตำแหน่งบริหาร'}</DialogTitle>
                        <DialogDescription>กำหนดชื่อตำแหน่งและลำดับการแสดงผล</DialogDescription>
                    </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ชื่อตำแหน่ง (ภาษาไทย) *</label>
                                <Input type="text" required value={formData.nameTh} onChange={e => setFormData({ ...formData, nameTh: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ชื่อตำแหน่ง (ภาษาอังกฤษ)</label>
                                <Input type="text" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ลำดับการแสดงผล (ตัวเลข)</label>
                                <Input type="number" required value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={handleCloseModal} variant="ghost">ยกเลิก</Button>
                                <Button type="submit">บันทึก</Button>
                            </DialogFooter>
                        </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบตำแหน่ง</DialogTitle>
                        <DialogDescription>
                            ต้องการลบ <strong>{deleteTarget?.nameTh}</strong> ใช่หรือไม่?
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
