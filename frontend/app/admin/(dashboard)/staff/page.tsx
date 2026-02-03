'use client';

import { useState, useMemo, useRef } from 'react';
import { useStaffData, Staff } from './hooks/useStaffData';
import StaffForm, { ACADEMIC_POSITIONS } from './components/StaffForm';

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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">👥 จัดการบุคลากร</h1>
                    <p className="opacity-70 text-sm">จัดการข้อมูลอาจารย์และบุคลากรในคณะสังคมศาสตร์</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="🔍 ค้นหาชื่อ..."
                            className="input input-bordered w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                    </div>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="btn btn-primary gap-2 whitespace-nowrap shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
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
                                                                <img src={staff.imageUrl} alt={staff.firstNameTh} className="object-cover" />
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
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" /></svg>
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7a.75.75 0 0 1 0 1.5H6.5v1.25a.75.75 0 0 1-1.5 0V5.5h-1a.75.75 0 0 1 0-1.5h1V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v2.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-2.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" /></svg>
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setStaffToDelete(staff);
                                                            deleteModalRef.current?.showModal();
                                                        }}
                                                        className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10 tooltip tooltip-left"
                                                        data-tip="ลบข้อมูล"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
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
                                <span className="text-primary">✏️</span> แก้ไขข้อมูลบุคลากร
                                <span className="text-sm font-normal opacity-50 ml-auto bg-base-200 px-2 py-1 rounded">ID: {editingStaff.id}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-success">➕</span> เพิ่มบุคลากรใหม่
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
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
