'use client';

import { useState, useMemo } from 'react';
import { useStaffData, Staff } from './hooks/useStaffData';
import StaffForm, { ACADEMIC_POSITIONS } from './components/StaffForm';
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Users,
    Link as LinkIcon,
    AlertCircle,
    ShieldAlert
} from "lucide-react";

export default function AdminStaffPage() {
    const { staffList, departments, users, loading, refetch } = useStaffData();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const getAcademicPositionLabel = (position: string | null) => {
        const found = ACADEMIC_POSITIONS.find(p => p.value === position);
        return found ? found.label : position || '-';
    };

    const getFullName = (staff: Staff) => {
        return `${staff.prefixTh || ''}${staff.firstNameTh} ${staff.lastNameTh}`;
    };

    const handleOpenModal = (staff: Staff | null) => {
        setEditingStaff(staff);
        setIsFormOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormOpen(false);
        setTimeout(() => setEditingStaff(null), 300); // Clear after animation
    };

    const handleSubmit = async (payload: any) => {
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            let res;
            if (editingStaff) {
                res = await fetch(`${apiUrl}/api/staff/${editingStaff.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${apiUrl}/api/staff`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                await refetch();
                handleCloseModal();
            } else {
                const err = await res.text();
                if (err.includes("Staff profile already exists for this user")) {
                    alert("เกิดข้อผิดพลาด: ผู้ใช้นี้ถูกผูกกับข้อมูลบุคลากรอื่นแล้ว");
                } else {
                    alert(`Error: ${err}`);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Cannot connect to server');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!staffToDelete) return;
        setSubmitting(true);

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        try {
            const res = await fetch(`${apiUrl}/api/staff/${staffToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                await refetch();
                setIsDeleteOpen(false);
                setStaffToDelete(null);
            } else {
                alert('Failed to delete staff member');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Optimize filter logic with useMemo
    const filteredStaff = useMemo(() => {
        return staffList.filter(staff =>
            staff.firstNameTh.includes(searchTerm) ||
            staff.lastNameTh.includes(searchTerm) ||
            (staff.firstNameEn && staff.firstNameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (staff.contactEmail && staff.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [staffList, searchTerm]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground text-sm">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        จัดการบุคลากร
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">จัดการข้อมูลอาจารย์และบุคลากรในคณะสังคมศาสตร์</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาชื่อ..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOpenModal(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มบุคลากร
                    </Button>
                </div>
            </div>

            {/* Staff Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px] text-center">#</TableHead>
                                <TableHead>ข้อมูลส่วนตัว</TableHead>
                                <TableHead>ตำแหน่ง/สังกัด</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Search className="h-10 w-10 mb-4 opacity-20" />
                                            <p>ไม่พบข้อมูลบุคลากร</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStaff.map((staff, index) => {
                                    const linkedUser = users.find(u => u.id === staff.userId);
                                    return (
                                        <TableRow key={staff.id}>
                                            <TableCell className="text-center font-mono opacity-50">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarImage src={staff.imageUrl || ''} alt={staff.firstNameTh} />
                                                        <AvatarFallback>{staff.firstNameTh.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm">{getFullName(staff)}</div>
                                                        <div className="text-xs text-muted-foreground flex gap-2">
                                                            <span>{staff.firstNameEn} {staff.lastNameEn}</span>
                                                            {linkedUser && (
                                                                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-0.5" title={`Linked to ${linkedUser.email}`}>
                                                                    <LinkIcon className="w-3 h-3" />
                                                                    <span className="hidden sm:inline">Linked</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-sm text-primary">
                                                        {staff.adminPosition || getAcademicPositionLabel(staff.academicPosition)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full w-fit">
                                                        {staff.department || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <Badge variant={staff.staffType === 'ACADEMIC' ? 'info' : 'secondary'}>
                                                        {staff.staffType === 'ACADEMIC' ? 'สายวิชาการ' : 'สายสนับสนุน'}
                                                    </Badge>
                                                    {staff.isExecutive && (
                                                        <Badge variant="purple" className="gap-1">
                                                            <ShieldAlert className="w-3 h-3" />
                                                            ผู้บริหาร
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenModal(staff)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setStaffToDelete(staff);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Modal (Dialog) */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {editingStaff ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                            {editingStaff ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                            กรอกข้อมูลบุคลากรให้ครบถ้วน ข้อมูลที่มีเครื่องหมาย * จำเป็นต้องระบุ
                        </DialogDescription>
                    </DialogHeader>

                    <StaffForm
                        initialData={editingStaff}
                        departments={departments}
                        users={users}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        isLoading={submitting}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader className="items-center text-center sm:text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle>ยืนยันการลบ?</DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ <strong>{staffToDelete ? getFullName(staffToDelete) : ''}</strong>?
                            <br />การกระทำนี้ไม่สามารถยกเลิกได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-2">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
                            ยกเลิก
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                            {submitting ? 'กำลังลบ...' : 'ยืนยันลบ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
