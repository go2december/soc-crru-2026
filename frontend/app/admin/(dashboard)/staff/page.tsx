'use client';

import { useEffect, useState } from 'react';

interface Staff {
    id: string;
    prefixTh: string | null;
    firstNameTh: string;
    lastNameTh: string;
    prefixEn: string | null;
    firstNameEn: string | null;
    lastNameEn: string | null;
    staffType: 'ACADEMIC' | 'SUPPORT';
    academicPosition: string | null;
    adminPosition: string | null;
    education: { level: string; detail: string }[] | null;
    contactEmail: string | null;
    department: string | null;
    departmentId: number | null;
    sortOrder: number;
    userId: string | null;
}

interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
}

interface Department {
    id: number;
    nameTh: string;
    nameEn: string | null;
}

const ACADEMIC_POSITIONS = [
    { value: 'LECTURER', label: 'อาจารย์' },
    { value: 'ASSISTANT_PROF', label: 'ผู้ช่วยศาสตราจารย์ (ผศ.)' },
    { value: 'ASSOCIATE_PROF', label: 'รองศาสตราจารย์ (รศ.)' },
    { value: 'PROFESSOR', label: 'ศาสตราจารย์ (ศ.)' },
];

export default function AdminStaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        prefixTh: '', firstNameTh: '', lastNameTh: '',
        prefixEn: '', firstNameEn: '', lastNameEn: '',
        staffType: 'ACADEMIC',
        academicPosition: '',
        adminPosition: '',
        contactEmail: '',
        departmentId: '',
        userId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

            const [staffRes, deptRes, usersRes] = await Promise.all([
                fetch(`${apiUrl}/api/staff`),
                fetch(`${apiUrl}/api/departments`),
                fetch(`${apiUrl}/api/auth/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (staffRes.ok) setStaffList(await staffRes.json());
            if (deptRes.ok) setDepartments(await deptRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAcademicPositionLabel = (position: string | null) => {
        const found = ACADEMIC_POSITIONS.find(p => p.value === position);
        return found ? found.label : position || '-';
    };

    const getFullName = (staff: Staff) => {
        return `${staff.prefixTh || ''}${staff.firstNameTh} ${staff.lastNameTh}`;
    };

    const handleOpenModal = (staff: Staff | null) => {
        setEditingStaff(staff);
        if (staff) {
            setFormData({
                prefixTh: staff.prefixTh || '',
                firstNameTh: staff.firstNameTh,
                lastNameTh: staff.lastNameTh,
                prefixEn: staff.prefixEn || '',
                firstNameEn: staff.firstNameEn || '',
                lastNameEn: staff.lastNameEn || '',
                staffType: staff.staffType,
                academicPosition: staff.academicPosition || '',
                adminPosition: staff.adminPosition || '',
                contactEmail: staff.contactEmail || '',
                departmentId: staff.departmentId ? staff.departmentId.toString() : '',
                userId: staff.userId || '',
            });
        } else {
            setFormData({
                prefixTh: '', firstNameTh: '', lastNameTh: '',
                prefixEn: '', firstNameEn: '', lastNameEn: '',
                staffType: 'ACADEMIC',
                academicPosition: '',
                adminPosition: '',
                contactEmail: '',
                departmentId: '',
                userId: '',
            });
        }
        (document.getElementById('staff_modal') as HTMLDialogElement).showModal();
    };

    const handleUserSelect = (userId: string) => {
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
            setFormData(prev => ({
                ...prev,
                userId: userId,
                contactEmail: prev.contactEmail || selectedUser.email,
            }));
        } else {
            setFormData(prev => ({ ...prev, userId: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        const payload = {
            ...formData,
            departmentId: parseInt(formData.departmentId),
            academicPosition: formData.staffType === 'ACADEMIC' && formData.academicPosition ? formData.academicPosition : undefined,
            userId: formData.userId || undefined,
        };

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
                await fetchData();
                (document.getElementById('staff_modal') as HTMLDialogElement).close();
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
                await fetchData();
                (document.getElementById('delete_staff_modal') as HTMLDialogElement).close();
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

    const filteredStaff = staffList.filter(staff =>
        staff.firstNameTh.includes(searchTerm) ||
        staff.lastNameTh.includes(searchTerm) ||
        (staff.firstNameEn && staff.firstNameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staff.contactEmail && staff.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">👥 จัดการบุคลากร</h1>
                    <p className="opacity-70">จัดการข้อมูลอาจารย์และบุคลากรคณะสังคมศาสตร์</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="🔍 ค้นหาชื่อ..."
                        className="input input-bordered w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="btn btn-primary gap-2 whitespace-nowrap"
                    >
                        ➕ เพิ่มบุคลากร
                    </button>
                </div>
            </div>

            {/* Staff Table */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>ชื่อ-สกุล</th>
                                    <th>บัญชีผู้ใช้</th>
                                    <th>ประเภท</th>
                                    <th>ตำแหน่ง</th>
                                    <th>สังกัด</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff, index) => {
                                    const linkedUser = users.find(u => u.id === staff.userId);
                                    return (
                                        <tr key={staff.id}>
                                            <td>{staff.sortOrder || index + 1}</td>
                                            <td>
                                                <div className="font-medium">{getFullName(staff)}</div>
                                                {staff.firstNameEn && (
                                                    <div className="text-xs opacity-60">
                                                        {staff.prefixEn} {staff.firstNameEn} {staff.lastNameEn}
                                                    </div>
                                                )}
                                                <div className="text-xs opacity-50 mt-1">
                                                    {staff.contactEmail}
                                                </div>
                                            </td>
                                            <td>
                                                {linkedUser ? (
                                                    <div className="tooltip" data-tip={linkedUser.email}>
                                                        <div className="badge badge-success badge-outline gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                                                            </svg>
                                                            Linked
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs opacity-40">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${staff.staffType === 'ACADEMIC' ? 'badge-primary' : 'badge-secondary'}`}>
                                                    {staff.staffType === 'ACADEMIC' ? 'วิชาการ' : 'สนับสนุน'}
                                                </span>
                                            </td>
                                            <td>
                                                {staff.adminPosition || getAcademicPositionLabel(staff.academicPosition)}
                                            </td>
                                            <td className="max-w-[150px] truncate" title={staff.department || ''}>
                                                {staff.department || '-'}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(staff)}
                                                        className="btn btn-ghost btn-xs text-info tooltip"
                                                        data-tip="แก้ไข"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setStaffToDelete(staff);
                                                            (document.getElementById('delete_staff_modal') as HTMLDialogElement).showModal();
                                                        }}
                                                        className="btn btn-ghost btn-xs text-error tooltip"
                                                        data-tip="ลบ"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredStaff.length === 0 && (
                            <div className="text-center py-12 opacity-60">
                                <p className="text-lg">ไม่พบข้อมูลบุคลากร</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal (Native Dialog) */}
            <dialog id="staff_modal" className="modal">
                <div className="modal-box w-full max-w-3xl bg-base-100 shadow-2xl relative">
                    <h3 className="font-bold text-lg mb-4">
                        {editingStaff ? '✏️ แก้ไขข้อมูลบุคลากร' : '➕ เพิ่มบุคลากรใหม่'}
                    </h3>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* User Link Section */}
                        <div className="md:col-span-2 bg-base-200 p-4 rounded-lg">
                            <label className="label pt-0"><span className="label-text font-bold">🔗 บัญชีผู้ใช้ (User Account)</span></label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.userId}
                                onChange={(e) => handleUserSelect(e.target.value)}
                            >
                                <option value="">-- ไม่ระบุ / ไม่เชื่อมโยง --</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.email} ({u.name})
                                    </option>
                                ))}
                            </select>
                            <div className="label">
                                <span className="label-text-alt opacity-70">
                                    การเชื่อมโยงบัญชีจะช่วยให้บุคลากรแก้ไขข้อมูลของตนเองได้ (หากมีสิทธิ์)
                                </span>
                            </div>
                        </div>

                        <div className="divider md:col-span-2 m-0"></div>

                        {/* Thai Name */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">คำนำหน้า (ไทย)</span></label>
                            <input type="text" className="input input-bordered" value={formData.prefixTh} onChange={e => setFormData({ ...formData, prefixTh: e.target.value })} placeholder="เช่น นาย, นางสาว, ผศ., ดร." />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">ชื่อ (ไทย) *</span></label>
                            <input type="text" className="input input-bordered" required value={formData.firstNameTh} onChange={e => setFormData({ ...formData, firstNameTh: e.target.value })} />
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">นามสกุล (ไทย) *</span></label>
                            <input type="text" className="input input-bordered" required value={formData.lastNameTh} onChange={e => setFormData({ ...formData, lastNameTh: e.target.value })} />
                        </div>

                        {/* English Name */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Prefix (EN)</span></label>
                            <input type="text" className="input input-bordered" value={formData.prefixEn} onChange={e => setFormData({ ...formData, prefixEn: e.target.value })} placeholder="e.g. Mr., Ms., Dr." />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">First Name (EN)</span></label>
                            <input type="text" className="input input-bordered" value={formData.firstNameEn} onChange={e => setFormData({ ...formData, firstNameEn: e.target.value })} />
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">Last Name (EN)</span></label>
                            <input type="text" className="input input-bordered" value={formData.lastNameEn} onChange={e => setFormData({ ...formData, lastNameEn: e.target.value })} />
                        </div>

                        <div className="divider md:col-span-2">ข้อมูลตำแหน่ง</div>

                        {/* Type & Dept */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">ประเภทบุคลากร *</span></label>
                            <select className="select select-bordered" value={formData.staffType} onChange={e => setFormData({ ...formData, staffType: e.target.value as any })}>
                                <option value="ACADEMIC">สายวิชาการ</option>
                                <option value="SUPPORT">สายสนับสนุน</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">สังกัด (Department) *</span></label>
                            <select className="select select-bordered" required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}>
                                <option value="">-- เลือกสังกัด --</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.nameTh}</option>
                                ))}
                            </select>
                        </div>

                        {/* Positions */}
                        {formData.staffType === 'ACADEMIC' && (
                            <div className="form-control">
                                <label className="label"><span className="label-text">ตำแหน่งทางวิชาการ</span></label>
                                <select className="select select-bordered" value={formData.academicPosition} onChange={e => setFormData({ ...formData, academicPosition: e.target.value })}>
                                    <option value="">-- ไม่มี --</option>
                                    {ACADEMIC_POSITIONS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="form-control">
                            <label className="label"><span className="label-text">ตำแหน่งบริหาร (ถ้ามี)</span></label>
                            <input type="text" className="input input-bordered" value={formData.adminPosition} onChange={e => setFormData({ ...formData, adminPosition: e.target.value })} placeholder="เช่น คณบดี, หัวหน้าสำนักงาน" />
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">อีเมลติดต่อ</span></label>
                            <input type="email" className="input input-bordered" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
                        </div>

                        <div className="modal-action md:col-span-2 mt-6">
                            <button type="button" onClick={() => (document.getElementById('staff_modal') as HTMLDialogElement).close()} className="btn btn-ghost" disabled={submitting}>ยกเลิก</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? <span className="loading loading-spinner"></span> : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Delete Modal (Native Dialog) */}
            <dialog id="delete_staff_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">ยืนยันการลบ</h3>
                    <p className="py-4">ต้องการลบข้อมูลบุคลากร <strong>{staffToDelete ? getFullName(staffToDelete) : ''}</strong> ใช่หรือไม่?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost" disabled={submitting}>ยกเลิก</button>
                        </form>
                        <button onClick={handleDelete} className="btn btn-error" disabled={submitting}>
                            {submitting ? <span className="loading loading-spinner"></span> : 'ยืนยันลบ'}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}