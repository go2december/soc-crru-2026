'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Building2, School, Wrench } from "lucide-react";

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

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const res = await fetch(`${apiUrl}/api/departments`);
            if (res.ok) {
                const data = await res.json();
                // Sort by ID
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

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
                setIsFormOpen(false);
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/departments/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                await fetchDepartments();
                setIsDeleteOpen(false);
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
                        <Building2 className="w-6 h-6 text-primary" />
                        จัดการสังกัด / หน่วยงาน
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">เพิ่มหรือแก้ไขสาขาวิชาและหน่วยงานภายในคณะ</p>
                </div>
                <Button onClick={() => handleOpenModal(null)}>
                    <Plus className="mr-2 h-4 w-4" /> เพิ่มหน่วยงานใหม่
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16 text-center">ID</TableHead>
                                <TableHead>ชื่อหน่วยงาน (ไทย)</TableHead>
                                <TableHead>ชื่อหน่วยงาน (อังกฤษ)</TableHead>
                                <TableHead>ประเภท</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                        ไม่พบข้อมูลหน่วยงาน
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departments.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell className="text-center font-mono">{dept.id}</TableCell>
                                        <TableCell className="font-medium">{dept.nameTh}</TableCell>
                                        <TableCell className="text-muted-foreground">{dept.nameEn || '-'}</TableCell>
                                        <TableCell>
                                            {dept.isAcademicUnit ? (
                                                <Badge variant="info" className="gap-1">
                                                    <School className="w-3 h-3" /> สายวิชาการ
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning" className="gap-1">
                                                    <Wrench className="w-3 h-3" /> สายสนับสนุน
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenModal(dept)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setDeleteTarget(dept);
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

            {/* Edit Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDepartment ? 'แก้ไขหน่วยงาน' : 'เพิ่มหน่วยงานใหม่'}</DialogTitle>
                        <DialogDescription>
                            กรอกข้อมูลหน่วยงานให้ครบถ้วน
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>ชื่อหน่วยงาน (ไทย) <span className="text-destructive">*</span></Label>
                            <Input
                                required
                                value={formData.nameTh}
                                onChange={e => setFormData({ ...formData, nameTh: e.target.value })}
                                placeholder="เช่น สาขาวิชาสังคมวิทยา"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>ชื่อหน่วยงาน (อังกฤษ)</Label>
                            <Input
                                value={formData.nameEn}
                                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                placeholder="e.g. Sociology Program"
                            />
                        </div>
                        <div className="pt-2">
                            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={formData.isAcademicUnit}
                                    onChange={e => setFormData({ ...formData, isAcademicUnit: e.target.checked })}
                                />
                                <div>
                                    <span className="font-medium text-sm block">หน่วยงานสายวิชาการ (Academic Unit)</span>
                                    <span className="text-xs text-muted-foreground block mt-0.5">
                                        เปิดใช้งานหากเป็น "สาขาวิชา" หรือหน่วยงานที่มีการเรียนการสอน
                                    </span>
                                </div>
                            </label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>ยกเลิก</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'กำลังบันทึก...' : 'บันทึก'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">ยืนยันการลบหน่วยงาน</DialogTitle>
                        <DialogDescription>
                            ต้องการลบ <strong>{deleteTarget?.nameTh}</strong> ใช่หรือไม่?
                            <br />
                            <span className="text-xs text-red-500/80 mt-2 block bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                ⚠️ คำเตือน: หากมีบุคลากรสังกัดหน่วยงานนี้อยู่ จะไม่สามารถลบได้
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                            ยืนยันลบ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
