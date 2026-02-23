'use client';

import { useState, useMemo, useRef } from 'react';
import { useStaffData, Staff } from './hooks/useStaffData';
import StaffForm, { ACADEMIC_POSITIONS } from './components/StaffForm';
import { Users, Edit3, Plus, Search, Trash2, Link2, Crown, UserX, AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function AdminStaffPage() {
    const { staffList, departments, users, loading, refetch } = useStaffData();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Dialog Refs
    const formModalRef = useRef<HTMLDialogElement>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const getAcademicPositionLabel = (position: string | null) => {
        const found = ACADEMIC_POSITIONS.find(p => p.value === position);
        return found ? found.label : position || '-';
    };

    const getFullName = (staff: Staff) => {
        return `${staff.prefixTh || ''}${staff.firstNameTh} ${staff.lastNameTh}`;
    };

    const handleOpenModal = (staff: Staff | null) => {
        setEditingStaff(staff);
        formModalRef.current?.showModal();
    };

    const handleCloseModal = () => {
        formModalRef.current?.close();
        setEditingStaff(null);
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
                deleteModalRef.current?.close();
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
                <span className="loading loading-spinner loading-lg text-primary"></span>
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
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ..."
                            className="input input-bordered w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">
                            <Search className="h-5 w-5" />
                        </span>
                    </div>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="btn btn-primary gap-2 whitespace-nowrap shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                    >
                        <Plus className="h-5 w-5" />
                        เพิ่มบุคลากร
                    </button>
                </div>
            </div>

            {/* Staff Table */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-base-200/50 text-base-content/70">
                                <tr>
                                    <th className="w-16 text-center">#</th>
                                    <th>ข้อมูลส่วนตัว</th>
                                    <th>ตำแหน่ง/สังกัด</th>
                                    <th>สถานะ</th>
                                    <th className="text-right pr-6">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff, index) => {
                                    const linkedUser = users.find(u => u.id === staff.userId);
                                    return (
                                        <tr key={staff.id} className="hover">
                                            <td className="text-center font-mono opacity-50">{index + 1}</td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12 bg-gray-100 ring-1 ring-base-300 ring-offset-2">
                                                            {staff.imageUrl ? (
                                                                <img src={staff.imageUrl.startsWith('/') ? `${API_URL}${staff.imageUrl}` : staff.imageUrl} alt={staff.firstNameTh} className="object-cover" />
                                                            ) : (
                                                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 font-bold">No Img</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base">{getFullName(staff)}</div>
                                                        <div className="text-xs opacity-60 flex gap-2">
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
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-sm text-primary-content/80 text-primary">
                                                        {staff.adminPosition || getAcademicPositionLabel(staff.academicPosition)}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs opacity-70">
                                                        <span className="badge badge-ghost badge-sm">{staff.department || '-'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className={`badge badge-sm ${staff.staffType === 'ACADEMIC' ? 'badge-primary badge-outline' : 'badge-secondary badge-outline'}`}>
                                                        {staff.staffType === 'ACADEMIC' ? 'วิชาการ' : 'สนับสนุน'}
                                                    </span>
                                                    {staff.isExecutive && (
                                                        <span className="badge badge-warning badge-sm gap-1 text-warning-content shadow-sm">
                                                            <Crown className="w-3 h-3" />
                                                            ผู้บริหาร
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(staff)}
                                                        className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10 tooltip tooltip-left"
                                                        data-tip="แก้ไขข้อมูล"
                                                    >
                                                        <Edit3 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setStaffToDelete(staff);
                                                            deleteModalRef.current?.showModal();
                                                        }}
                                                        className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10 tooltip tooltip-left"
                                                        data-tip="ลบข้อมูล"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
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
                </div>
            </div>

            {/* Add/Edit Modal */}
            <dialog ref={formModalRef} className="modal backdrop-blur-sm">
                <div className="modal-box w-full max-w-4xl bg-base-100 shadow-2xl p-6">
                    <h3 className="font-bold text-2xl mb-6 flex items-center gap-2 border-b pb-4">
                        {editingStaff ? (
                            <>
                                <Edit3 className="w-6 h-6 text-primary" /> แก้ไขข้อมูลบุคลากร
                                <span className="text-sm font-normal opacity-50 ml-auto bg-base-200 px-2 py-1 rounded">ID: {editingStaff.id}</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-6 h-6 text-success" /> เพิ่มบุคลากรใหม่
                            </>
                        )}
                    </h3>

                    <StaffForm
                        initialData={editingStaff}
                        departments={departments}
                        users={users}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        isLoading={submitting}
                    />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={handleCloseModal}>close</button>
                </form>
            </dialog>

            {/* Delete Modal */}
            <dialog ref={deleteModalRef} className="modal backdrop-blur-sm">
                <div className="modal-box max-w-sm">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl">ยืนยันการลบ?</h3>
                        <p className="opacity-70">
                            คุณต้องการลบข้อมูลของ<br />
                            <strong>{staffToDelete ? getFullName(staffToDelete) : ''}</strong><br />
                            ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้
                        </p>
                    </div>
                    <div className="modal-action justify-center mt-6">
                        <form method="dialog">
                            <button className="btn btn-ghost" disabled={submitting}>ยกเลิก</button>
                        </form>
                        <button onClick={handleDelete} className="btn btn-error text-white px-8" disabled={submitting}>
                            {submitting ? <span className="loading loading-spinner"></span> : 'ยืนยันลบ'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setStaffToDelete(null)}>close</button>
                </form>
            </dialog>
        </div>
    );
}
