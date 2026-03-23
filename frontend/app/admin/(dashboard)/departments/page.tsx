'use client';

import { useEffect, useState } from 'react';
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react';
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

interface Department {
    id: number;
    nameTh: string;
    nameEn: string | null;
    isAcademicUnit: boolean;
}

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

    // Form
    const [formData, setFormData] = useState({
        nameTh: '',
        nameEn: '',
        isAcademicUnit: true
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/departments`);
            if (res.ok) {
                const data = await res.json();
                // Sort by ID is usually fine, or name
                setDepartments(data.sort((a: Department, b: Department) => a.id - b.id));
            }
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (dept: Department | null) => {
        setEditingDepartment(dept);
        if (dept) {
            setFormData({
                nameTh: dept.nameTh,
                nameEn: dept.nameEn || '',
                isAcademicUnit: dept.isAcademicUnit
            });
        } else {
            setFormData({
                nameTh: '',
                nameEn: '',
                isAcademicUnit: true
            });
        }
        setIsFormOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormOpen(false);
        setEditingDepartment(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            let res;
            if (editingDepartment) {
                res = await fetch(`${apiUrl}/api/departments/${editingDepartment.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                res = await fetch(`${apiUrl}/api/departments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
            }

            if (res.ok) {
                await fetchDepartments();
                handleCloseModal();
            } else {
                alert('เกิดข้อผิดพลาด: ' + await res.text());
            }
        } catch (err) {
            console.error(err);
            alert('Cannot connect to server');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/departments/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                await fetchDepartments();
                setDeleteTarget(null);
            } else {
                alert('ไม่สามารถลบได้ (อาจมีบุคลากรสังกัดอยู่)');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold"><Building2 className="h-7 w-7 text-primary" />จัดการสังกัด / หน่วยงาน</h1>
                    <p className="text-sm text-muted-foreground">เพิ่มหรือแก้ไขสาขาวิชาและหน่วยงานภายในคณะ</p>
                </div>
                <Button onClick={() => handleOpenModal(null)} className="gap-2"><Plus className="h-4 w-4" />เพิ่มหน่วยงานใหม่</Button>
            </div>

            <Card className="overflow-hidden border-border/70 shadow-sm">
                <CardContent className="p-0">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-muted-foreground">
                        <tr>
                            <th className="w-16 px-4 py-3 font-medium">ID</th>
                            <th className="px-4 py-3 font-medium">ชื่อหน่วยงาน (ไทย)</th>
                            <th className="px-4 py-3 font-medium">ชื่อหน่วยงาน (อังกฤษ)</th>
                            <th className="px-4 py-3 font-medium">ประเภท</th>
                            <th className="w-24 px-4 py-3 text-center font-medium">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id} className="border-t align-middle hover:bg-muted/20">
                                <td className="px-4 py-3">{dept.id}</td>
                                <td className="px-4 py-3 font-semibold">{dept.nameTh}</td>
                                <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{dept.nameEn || '-'}</td>
                                <td className="px-4 py-3">
                                    {dept.isAcademicUnit ? (
                                        <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">สายวิชาการ</span>
                                    ) : (
                                        <span className="inline-flex rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">สายสนับสนุน</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            onClick={() => handleOpenModal(dept)}
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-sky-600"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setDeleteTarget(dept);
                                            }}
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {departments.length === 0 && (
                    <div className="py-10 text-center text-muted-foreground">ไม่พบข้อมูลหน่วยงาน</div>
                )}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open && !submitting) handleCloseModal(); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDepartment ? 'แก้ไขหน่วยงาน' : 'เพิ่มหน่วยงานใหม่'}</DialogTitle>
                        <DialogDescription>กำหนดชื่อหน่วยงานและประเภทการใช้งานในระบบ</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ชื่อหน่วยงาน (ไทย) *</label>
                            <Input
                                type="text"
                                required
                                value={formData.nameTh}
                                onChange={e => setFormData({ ...formData, nameTh: e.target.value })}
                                placeholder="เช่น สาขาวิชาสังคมวิทยา"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ชื่อหน่วยงาน (อังกฤษ)</label>
                            <Input
                                type="text"
                                value={formData.nameEn}
                                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                placeholder="e.g. Sociology Program"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex cursor-pointer items-center gap-4 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                    checked={formData.isAcademicUnit}
                                    onChange={e => setFormData({ ...formData, isAcademicUnit: e.target.checked })}
                                />
                                <span>หน่วยงานสายวิชาการ (Academic Unit)</span>
                            </label>
                            <p className="text-xs text-muted-foreground">เปิดใช้งานหากเป็น &quot;สาขาวิชา&quot; หรือหน่วยงานที่มีการเรียนการสอน</p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={handleCloseModal} disabled={submitting}>ยกเลิก</Button>
                            <Button type="submit" disabled={submitting}>{submitting ? 'กำลังบันทึก...' : 'บันทึก'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open && !submitting) setDeleteTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบหน่วยงาน</DialogTitle>
                        <DialogDescription>
                        ต้องการลบ <strong>{deleteTarget?.nameTh}</strong> ใช่หรือไม่?
                        <span className="mt-2 block text-sm text-destructive/80">
                            ⚠️ คำเตือน: หากมีบุคลากรสังกัดหน่วยงานนี้อยู่ จะไม่สามารถลบได้
                        </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={submitting}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>ยืนยันลบ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
