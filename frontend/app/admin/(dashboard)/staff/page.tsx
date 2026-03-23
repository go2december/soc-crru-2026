'use client';

import { useState, useMemo } from 'react';
import { useStaffData, Staff } from './hooks/useStaffData';
import StaffForm from './components/StaffForm';
import { Users, Edit3, Plus, Search, Trash2, Link2, Crown, UserX, AlertTriangle } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminStaffPage() {
    const { staffList, departments, users, academicPositions, adminPositions, loading, refetch } = useStaffData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const getFullName = (staff: Staff) => {
        return `${staff.prefixTh || ''}${staff.firstNameTh} ${staff.lastNameTh}`;
    };

    const handleOpenModal = (staff: Staff | null) => {
        setEditingStaff(staff);
        setIsFormOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormOpen(false);
        setEditingStaff(null);
    };

    const handleSubmit = async (payload: Record<string, unknown>) => {
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        try {
            const res = await fetch(`${apiUrl}/api/staff/${staffToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                await refetch();
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
                        <Users className="w-8 h-8 text-primary" /> จัดการบุคลากร
                    </h1>
                    <p className="opacity-70 text-sm">จัดการข้อมูลอาจารย์และบุคลากรในคณะสังคมศาสตร์</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Input
                            type="text"
                            placeholder="ค้นหาชื่อ..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">
                            <Search className="h-5 w-5" />
                        </span>
                    </div>
                    <Button
                        onClick={() => handleOpenModal(null)}
                        className="gap-2 whitespace-nowrap"
                    >
                        <Plus className="h-5 w-5" />
                        เพิ่มบุคลากร
                    </Button>
                </div>
            </div>

            {/* Staff Table */}
            <Card className="border-border/70 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40 text-left text-muted-foreground">
                                <tr>
                                    <th className="w-16 px-4 py-3 text-center font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">ข้อมูลส่วนตัว</th>
                                    <th className="px-4 py-3 font-medium">ตำแหน่ง/สังกัด</th>
                                    <th className="px-4 py-3 font-medium">สถานะ</th>
                                    <th className="px-4 py-3 text-right font-medium">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff, index) => {
                                    const linkedUser = users.find(u => u.id === staff.userId);
                                    return (
                                        <tr key={staff.id} className="border-b align-middle hover:bg-muted/20">
                                            <td className="px-4 py-3 text-center font-mono text-muted-foreground">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-border">
                                                        {staff.imageUrl ? (
                                                            <img src={staff.imageUrl.startsWith('/') ? `${API_URL}${staff.imageUrl}` : staff.imageUrl} alt={staff.firstNameTh} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground font-bold">No Img</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base">{getFullName(staff)}</div>
                                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                                            <span>{staff.firstNameEn} {staff.lastNameEn}</span>
                                                            {linkedUser && (
                                                                <span className="text-success font-medium flex items-center gap-0.5" title={`Linked to ${linkedUser.email}`}>
                                                                    <Link2 className="w-3 h-3" />
                                                                    Linked
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-sm text-primary">
                                                        {staff.adminPosition || staff.academicPosition || '-'}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="inline-flex rounded-full border border-border bg-muted px-2 py-0.5 text-xs">{staff.department || '-'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', staff.staffType === 'ACADEMIC' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-slate-300 bg-slate-100 text-slate-700')}>
                                                        {staff.staffType === 'ACADEMIC' ? 'วิชาการ' : 'สนับสนุน'}
                                                    </span>
                                                    {staff.isExecutive && (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                            <Crown className="w-3 h-3" />
                                                            ผู้บริหาร
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleOpenModal(staff)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-sky-600"
                                                        title="แก้ไขข้อมูล"
                                                    >
                                                        <Edit3 className="w-5 h-5" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setStaffToDelete(staff);
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        title="ลบข้อมูล"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredStaff.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 opacity-60">
                                <UserX className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">ไม่พบข้อมูลบุคลากร</p>
                                <p className="text-sm">ลองค้นหาด้วยคำอื่น หรือเพิ่มบุคลากรใหม่</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open && !submitting) handleCloseModal(); }}>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            {editingStaff ? (
                                <>
                                    <Edit3 className="w-6 h-6 text-primary" /> แก้ไขข้อมูลบุคลากร
                                </>
                            ) : (
                                <>
                                    <Plus className="w-6 h-6 text-primary" /> เพิ่มบุคลากรใหม่
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {editingStaff ? `รหัสบุคลากร: ${editingStaff.id}` : 'กรอกข้อมูลเพื่อสร้างรายการบุคลากรใหม่'}
                        </DialogDescription>
                    </DialogHeader>

                    <StaffForm
                        initialData={editingStaff}
                        departments={departments}
                        users={users}
                        academicPositions={academicPositions}
                        adminPositions={adminPositions}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        isLoading={submitting}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={!!staffToDelete} onOpenChange={(open) => { if (!open && !submitting) setStaffToDelete(null); }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader className="items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <DialogTitle>ยืนยันการลบ?</DialogTitle>
                        <DialogDescription>
                            คุณต้องการลบข้อมูลของ <strong>{staffToDelete ? getFullName(staffToDelete) : ''}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" disabled={submitting} onClick={() => setStaffToDelete(null)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                            {submitting ? 'กำลังลบ...' : 'ยืนยันลบ'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
