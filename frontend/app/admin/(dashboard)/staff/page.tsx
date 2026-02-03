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
    expertise: string[] | null;
    imageUrl: string | null;
    contactEmail: string | null;
    department: string | null;
    departmentId: number | null;
    sortOrder: number;
    userId: string | null;
    isExecutive: boolean;
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

const EDU_LEVELS = [
    { value: 'DOCTORAL', label: 'ปริญญาเอก (Doctoral)' },
    { value: 'MASTER', label: 'ปริญญาโท (Master)' },
    { value: 'BACHELOR', label: 'ปริญญาตรี (Bachelor)' },
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
        isExecutive: false,
        imageUrl: '',
    });

    // Dynamic Lists State
    const [eduList, setEduList] = useState<{ level: string; detail: string }[]>([]);
    const [expertiseList, setExpertiseList] = useState<string[]>([]);

    // Inputs for adding new items
    const [newEduLevel, setNewEduLevel] = useState('DOCTORAL');
    const [newEduDetail, setNewEduDetail] = useState('');
    const [newExpertise, setNewExpertise] = useState('');

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
                isExecutive: staff.isExecutive || false,
                imageUrl: staff.imageUrl || '',
            });
            setEduList(staff.education || []);
            setExpertiseList(staff.expertise || []);
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
                isExecutive: false,
                imageUrl: '',
            });
            setEduList([]);
            setExpertiseList([]);
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

    // Sub-handlers for Dynamic Lists
    const addEducation = () => {
        if (!newEduDetail.trim()) return;
        setEduList([...eduList, { level: newEduLevel, detail: newEduDetail.trim() }]);
        setNewEduDetail(''); // Clear input
    };

    const removeEducation = (index: number) => {
        setEduList(eduList.filter((_, i) => i !== index));
    };

    const addExpertise = () => {
        if (!newExpertise.trim()) return;
        if (!expertiseList.includes(newExpertise.trim())) {
            setExpertiseList([...expertiseList, newExpertise.trim()]);
        }
        setNewExpertise('');
    };

    const removeExpertise = (tag: string) => {
        setExpertiseList(expertiseList.filter(t => t !== tag));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem('admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        const payload = {
            ...formData,
            departmentId: parseInt(formData.departmentId || '0'),
            academicPosition: formData.staffType === 'ACADEMIC' && formData.academicPosition ? formData.academicPosition : undefined,
            userId: formData.userId || undefined,
            // Add array fields
            education: eduList,
            expertise: expertiseList,
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
                                    <th>ข้อมูลส่วนตัว</th>
                                    <th>ตำแหน่ง</th>
                                    <th>สถานะ</th>
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
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12 bg-gray-100">
                                                            {staff.imageUrl ? (
                                                                <img src={staff.imageUrl} alt={staff.firstNameTh} />
                                                            ) : (
                                                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No Img</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{getFullName(staff)}</div>
                                                        <div className="text-sm opacity-50">{staff.firstNameEn} {staff.lastNameEn}</div>
                                                        {linkedUser && (
                                                            <div className="badge badge-accent badge-outline badge-xs gap-1 mt-1">
                                                                Linked: {linkedUser.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-sm">
                                                        {staff.adminPosition || getAcademicPositionLabel(staff.academicPosition)}
                                                    </span>
                                                    <span className="text-xs opacity-70">
                                                        {staff.department || '-'}
                                                    </span>
                                                    <span className={`badge badge-xs ${staff.staffType === 'ACADEMIC' ? 'badge-primary' : 'badge-secondary'}`}>
                                                        {staff.staffType === 'ACADEMIC' ? 'วิชาการ' : 'สนับสนุน'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {staff.isExecutive && (
                                                    <span className="badge badge-warning text-white gap-1">
                                                        👑 ผู้บริหาร
                                                    </span>
                                                )}
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
                <div className="modal-box w-full max-w-4xl bg-base-100 shadow-2xl relative">
                    <h3 className="font-bold text-lg mb-4">
                        {editingStaff ? '✏️ แก้ไขข้อมูลบุคลากร' : '➕ เพิ่มบุคลากรใหม่'}
                    </h3>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

                        {/* 1. General Info */}
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="staff_accordion" defaultChecked />
                            <div className="collapse-title text-xl font-medium">
                                📝 ข้อมูลทั่วไป (General Info)
                            </div>
                            <div className="collapse-content">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* User Link Section */}
                                    <div className="md:col-span-2 p-3 rounded-lg border border-base-300 bg-base-100">
                                        <label className="label pt-0"><span className="label-text font-bold">🔗 บัญชีผู้ใช้ (User Account)</span></label>
                                        <select className="select select-bordered w-full" value={formData.userId} onChange={(e) => handleUserSelect(e.target.value)}>
                                            <option value="">-- ไม่ระบุ / ไม่เชื่อมโยง --</option>
                                            {users.map(u => (<option key={u.id} value={u.id}>{u.email} ({u.name})</option>))}
                                        </select>
                                    </div>

                                    {/* Name TH */}
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">คำนำหน้า (ไทย)</span></label>
                                        <input type="text" className="input input-bordered" value={formData.prefixTh} onChange={e => setFormData({ ...formData, prefixTh: e.target.value })} placeholder="เช่น ผศ., ดร." />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">ชื่อ (ไทย) *</span></label>
                                        <input type="text" className="input input-bordered" required value={formData.firstNameTh} onChange={e => setFormData({ ...formData, firstNameTh: e.target.value })} />
                                    </div>
                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text">นามสกุล (ไทย) *</span></label>
                                        <input type="text" className="input input-bordered" required value={formData.lastNameTh} onChange={e => setFormData({ ...formData, lastNameTh: e.target.value })} />
                                    </div>

                                    {/* Name EN */}
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Prefix (EN)</span></label>
                                        <input type="text" className="input input-bordered" value={formData.prefixEn} onChange={e => setFormData({ ...formData, prefixEn: e.target.value })} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">First Name (EN)</span></label>
                                        <input type="text" className="input input-bordered" value={formData.firstNameEn} onChange={e => setFormData({ ...formData, firstNameEn: e.target.value })} />
                                    </div>
                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text">Last Name (EN)</span></label>
                                        <input type="text" className="input input-bordered" value={formData.lastNameEn} onChange={e => setFormData({ ...formData, lastNameEn: e.target.value })} />
                                    </div>

                                    {/* Image Upload */}
                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text">รูปโปรไฟล์ (Image Upload)</span></label>
                                        <div className="flex flex-col md:flex-row gap-4 items-start">
                                            <div className="flex-1 w-full">
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="file-input file-input-bordered w-full"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            // Upload Logic
                                                            const uploadData = new FormData();
                                                            uploadData.append('file', file);
                                                            const token = localStorage.getItem('admin_token');
                                                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

                                                            try {
                                                                const res = await fetch(`${apiUrl}/api/upload/staff`, {
                                                                    method: 'POST',
                                                                    headers: { Authorization: `Bearer ${token}` }, // No Content-Type header for FormData, browser sets it
                                                                    body: uploadData
                                                                });
                                                                if (res.ok) {
                                                                    const data = await res.json();
                                                                    // Append API URL if relative path
                                                                    const fullUrl = data.url.startsWith('http') ? data.url : `${apiUrl}${data.url}`;
                                                                    setFormData(prev => ({ ...prev, imageUrl: fullUrl }));
                                                                } else {
                                                                    alert('Upload failed');
                                                                }
                                                            } catch (err) {
                                                                console.error('Upload error', err);
                                                                alert('Upload error');
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="input input-sm input-ghost w-full text-xs opacity-50"
                                                    value={formData.imageUrl}
                                                    placeholder="หรือใส่ URL รูปภาพโดยตรง..."
                                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                />
                                            </div>

                                            <div className="aspect-[1/1] w-32 bg-base-200 rounded-lg overflow-hidden border border-base-300 relative group">
                                                {formData.imageUrl ? (
                                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'} />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs p-2 text-center">
                                                        <span>No Image</span>
                                                        <span className="text-[10px]">1:1 Ratio</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <label className="label pt-0 pb-0">
                                            <span className="label-text-alt text-gray-500">ระบบจะปรับขนาดรูปอัตโนมัติ (Max 768x1024) และแปลงเป็น PNG</span>
                                        </label>
                                    </div>

                                    <div className="form-control md:col-span-2">
                                        <label className="label"><span className="label-text">อีเมลติดต่อ</span></label>
                                        <input type="email" className="input input-bordered" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Position & Status */}
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="staff_accordion" />
                            <div className="collapse-title text-xl font-medium">
                                💼 ตำแหน่งและสังกัด (Position)
                            </div>
                            <div className="collapse-content">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.nameTh}</option>))}
                                        </select>
                                    </div>

                                    {formData.staffType === 'ACADEMIC' && (
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">ตำแหน่งทางวิชาการ</span></label>
                                            <select className="select select-bordered" value={formData.academicPosition} onChange={e => setFormData({ ...formData, academicPosition: e.target.value })}>
                                                <option value="">-- ไม่มี --</option>
                                                {ACADEMIC_POSITIONS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">ตำแหน่งบริหาร / ตำแหน่งหน้าที่ (Administrative / Functional Position)</span></label>
                                        <input type="text" className="input input-bordered" value={formData.adminPosition} onChange={e => setFormData({ ...formData, adminPosition: e.target.value })} placeholder="เช่น คณบดี, หัวหน้าสำนักงาน, นักวิชาการศึกษา" />
                                    </div>

                                    <div className="form-control md:col-span-2 border border-green-200 bg-green-50 p-3 rounded-lg">
                                        <label className="label cursor-pointer justify-start gap-4">
                                            <input type="checkbox" className="toggle toggle-success" checked={formData.isExecutive} onChange={e => setFormData({ ...formData, isExecutive: e.target.checked })} />
                                            <span className="label-text font-bold text-green-800">เป็นคณะกรรมการบริหาร/ผู้บริหารระดับสูง (School Executive)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Education & Expertise */}
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="staff_accordion" />
                            <div className="collapse-title text-xl font-medium">
                                🎓 ประวัติการศึกษาและความเชี่ยวชาญ
                            </div>
                            <div className="collapse-content">
                                <div className="space-y-6">

                                    {/* Education List */}
                                    <div>
                                        <h4 className="font-bold mb-2 text-sm uppercase text-gray-500">ประวัติการศึกษา (Education)</h4>
                                        <div className="flex gap-2 mb-2">
                                            <select className="select select-sm select-bordered" value={newEduLevel} onChange={e => setNewEduLevel(e.target.value)}>
                                                {EDU_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                            </select>
                                            <input type="text" className="input input-sm input-bordered flex-1" placeholder="ระบุวุฒิ, สาขา, สถาบัน..." value={newEduDetail} onChange={e => setNewEduDetail(e.target.value)} />
                                            <button type="button" onClick={addEducation} className="btn btn-sm btn-primary">เพิ่ม</button>
                                        </div>
                                        <div className="bg-white rounded border border-gray-200 p-2 min-h-[50px] space-y-2">
                                            {eduList.length === 0 && <p className="text-xs text-gray-400 text-center py-2">ยังไม่มีข้อมูลการศึกษา</p>}
                                            {eduList.map((edu, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm group">
                                                    <div>
                                                        <span className="font-bold mr-2 text-primary">{EDU_LEVELS.find(l => l.value === edu.level)?.label.split(' ')[0]}</span>
                                                        <span>{edu.detail}</span>
                                                    </div>
                                                    <button type="button" onClick={() => removeEducation(idx)} className="btn btn-xs btn-circle btn-ghost text-red-500 opacity-0 group-hover:opacity-100">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expertise Tags */}
                                    <div>
                                        <h4 className="font-bold mb-2 text-sm uppercase text-gray-500">ความเชี่ยวชาญ (Expertise)</h4>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="input input-sm input-bordered flex-1"
                                                placeholder="ระบุความเชี่ยวชาญ (เช่น Sociology, Data Science)..."
                                                value={newExpertise}
                                                onChange={e => setNewExpertise(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExpertise(); } }}
                                            />
                                            <button type="button" onClick={addExpertise} className="btn btn-sm btn-secondary">เพิ่ม Tag</button>
                                        </div>
                                        <div className="bg-white rounded border border-gray-200 p-3 min-h-[50px] flex flex-wrap gap-2">
                                            {expertiseList.length === 0 && <p className="text-xs text-gray-400 w-full text-center py-2">ยังไม่มีข้อมูลความเชี่ยวชาญ</p>}
                                            {expertiseList.map((tag, idx) => (
                                                <div key={idx} className="badge badge-lg badge-ghost gap-2 pl-3">
                                                    {tag}
                                                    <button type="button" onClick={() => removeExpertise(tag)} className="btn btn-xs btn-circle btn-ghost text-gray-500">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="modal-action mt-6">
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
