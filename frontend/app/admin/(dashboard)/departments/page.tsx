'use client';

import { useEffect, useState } from 'react';

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
        (document.getElementById('dept_modal') as HTMLDialogElement).showModal();
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
                (document.getElementById('dept_modal') as HTMLDialogElement).close();
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
                (document.getElementById('delete_dept_modal') as HTMLDialogElement).close();
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

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">🏢 จัดการสังกัด / หน่วยงาน</h1>
                    <p className="opacity-70">เพิ่มหรือแก้ไขสาขาวิชาและหน่วยงานภายในคณะ</p>
                </div>
                <button onClick={() => handleOpenModal(null)} className="btn btn-primary gap-2">
                    ➕ เพิ่มหน่วยงานใหม่
                </button>
            </div>

            <div className="card bg-base-100 shadow-xl overflow-hidden">
                <table className="table">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="w-16">ID</th>
                            <th>ชื่อหน่วยงาน (ไทย)</th>
                            <th>ชื่อหน่วยงาน (อังกฤษ)</th>
                            <th>ประเภท</th>
                            <th className="w-24 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id} className="hover">
                                <td>{dept.id}</td>
                                <td className="font-semibold">{dept.nameTh}</td>
                                <td className="font-mono text-sm opacity-80">{dept.nameEn || '-'}</td>
                                <td>
                                    {dept.isAcademicUnit ? (
                                        <span className="badge badge-primary badge-outline">สายวิชาการ</span>
                                    ) : (
                                        <span className="badge badge-secondary badge-outline">สายสนับสนุน</span>
                                    )}
                                </td>
                                <td>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleOpenModal(dept)}
                                            className="btn btn-square btn-ghost btn-sm text-info"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteTarget(dept);
                                                (document.getElementById('delete_dept_modal') as HTMLDialogElement).showModal();
                                            }}
                                            className="btn btn-square btn-ghost btn-sm text-error"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {departments.length === 0 && (
                    <div className="text-center py-10 opacity-50">ไม่พบข้อมูลหน่วยงาน</div>
                )}
            </div>

            {/* Edit Modal */}
            <dialog id="dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">
                        {editingDepartment ? '✏️ แก้ไขหน่วยงาน' : '➕ เพิ่มหน่วยงานใหม่'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">ชื่อหน่วยงาน (ไทย) *</span></label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                value={formData.nameTh}
                                onChange={e => setFormData({ ...formData, nameTh: e.target.value })}
                                placeholder="เช่น สาขาวิชาสังคมวิทยา"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">ชื่อหน่วยงาน (อังกฤษ)</span></label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={formData.nameEn}
                                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                placeholder="e.g. Sociology Program"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={formData.isAcademicUnit}
                                    onChange={e => setFormData({ ...formData, isAcademicUnit: e.target.checked })}
                                />
                                <span className="label-text font-semibold">หน่วยงานสายวิชาการ (Academic Unit)</span>
                            </label>
                            <div className="label pt-0">
                                <span className="label-text-alt opacity-70">
                                    เปิดใช้งานหากเป็น "สาขาวิชา" หรือหน่วยงานที่มีการเรียนการสอน
                                </span>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={() => (document.getElementById('dept_modal') as HTMLDialogElement).close()} className="btn btn-ghost" disabled={submitting}>ยกเลิก</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? <span className="loading loading-spinner"></span> : 'บันทึก'}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Delete Modal */}
            <dialog id="delete_dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">ยืนยันการลบหน่วยงาน</h3>
                    <p className="py-4">
                        ต้องการลบ <strong>{deleteTarget?.nameTh}</strong> ใช่หรือไม่?
                        <br />
                        <span className="text-sm text-error opacity-80 mt-2 block">
                            ⚠️ คำเตือน: หากมีบุคลากรสังกัดหน่วยงานนี้อยู่ จะไม่สามารถลบได้
                        </span>
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost">ยกเลิก</button>
                        </form>
                        <button onClick={handleDelete} className="btn btn-error" disabled={submitting}>
                            ยืนยันลบ
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
