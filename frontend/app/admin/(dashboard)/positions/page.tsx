'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Shield, GraduationCap, GripVertical } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

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
                sortOrder: parseInt(formData.sortOrder as any)
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

    const handleDelete = async (id: number, type: string) => {
        if (!confirm('ยืนยันการลบตำแหน่งนี้?')) return;
        const token = localStorage.getItem('admin_token');
        const endpoint = type === 'ACADEMIC' ? '/api/staff/academic-positions' : '/api/staff/admin-positions';

        try {
            const res = await fetch(`${API_URL}${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                await fetchData();
            } else {
                const text = await res.text();
                alert(`ไม่สามารถลบได้: ${text}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderTable = (title: string, data: Position[], type: string, icon: any) => (
        <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-xl flex gap-2">{icon} {title}</h2>
                    <button onClick={() => handleOpenModal(type)} className="btn btn-sm btn-primary gap-1">
                        <Plus className="w-4 h-4" /> เพิ่มข้อมูล
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th>ลำดับแสดงผล</th>
                                <th>ชื่อตำแหน่ง (TH)</th>
                                <th>ชื่อตำแหน่ง (EN)</th>
                                <th className="text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="hover">
                                    <td className="font-mono">{item.sortOrder}</td>
                                    <td className="font-medium text-primary">{item.nameTh}</td>
                                    <td>{item.nameEn || <span className="text-gray-400">-</span>}</td>
                                    <td className="text-right">
                                        <button onClick={() => handleOpenModal(type, item)} className="btn btn-ghost btn-xs text-info tooltip" data-tip="แก้ไข"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(item.id, type)} className="btn btn-ghost btn-xs text-error tooltip" data-tip="ลบ"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">ยังไม่มีข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

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

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            {isEditing ? 'แก้ไข' : 'เพิ่ม'}{formData.type === 'ACADEMIC' ? 'ตำแหน่งทางวิชาการ' : 'ตำแหน่งบริหาร'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">ชื่อตำแหน่ง (ภาษาไทย) *</span></label>
                                <input type="text" className="input input-bordered" required value={formData.nameTh} onChange={e => setFormData({ ...formData, nameTh: e.target.value })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">ชื่อตำแหน่ง (ภาษาอังกฤษ)</span></label>
                                <input type="text" className="input input-bordered" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">ลำดับการแสดงผล (ตัวเลข)</span></label>
                                <input type="number" className="input input-bordered" required value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={handleCloseModal} className="btn btn-ghost">ยกเลิก</button>
                                <button type="submit" className="btn btn-primary">บันทึก</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
