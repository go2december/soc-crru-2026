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
    sortOrder: number;
}

export default function AdminStaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const res = await fetch(`${apiUrl}/api/staff`);
            if (res.ok) {
                const data = await res.json();
                setStaffList(data);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAcademicPositionLabel = (position: string | null) => {
        const labels: Record<string, string> = {
            LECTURER: 'อาจารย์',
            ASSISTANT_PROF: 'ผศ.',
            ASSOCIATE_PROF: 'รศ.',
            PROFESSOR: 'ศ.',
        };
        return position ? labels[position] || position : '-';
    };

    const getFullName = (staff: Staff) => {
        return `${staff.prefixTh || ''}${staff.firstNameTh} ${staff.lastNameTh}`;
    };

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">👥 จัดการบุคลากร</h1>
                    <p className="opacity-70">จัดการข้อมูลอาจารย์และบุคลากรคณะสังคมศาสตร์</p>
                </div>
                <button
                    onClick={() => {
                        setEditingStaff(null);
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    เพิ่มบุคลากร
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-base-100 rounded-xl shadow">
                    <div className="stat-title">บุคลากรทั้งหมด</div>
                    <div className="stat-value text-primary">{staffList.length}</div>
                </div>
                <div className="stat bg-base-100 rounded-xl shadow">
                    <div className="stat-title">สายวิชาการ</div>
                    <div className="stat-value text-secondary">
                        {staffList.filter((s) => s.staffType === 'ACADEMIC').length}
                    </div>
                </div>
                <div className="stat bg-base-100 rounded-xl shadow">
                    <div className="stat-title">สายสนับสนุน</div>
                    <div className="stat-value text-accent">
                        {staffList.filter((s) => s.staffType === 'SUPPORT').length}
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>ชื่อ-สกุล</th>
                                    <th>ประเภท</th>
                                    <th>ตำแหน่ง</th>
                                    <th>สังกัด</th>
                                    <th>อีเมล</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map((staff, index) => (
                                    <tr key={staff.id}>
                                        <td>{staff.sortOrder || index + 1}</td>
                                        <td>
                                            <div className="font-medium">{getFullName(staff)}</div>
                                            {staff.firstNameEn && (
                                                <div className="text-xs opacity-60">
                                                    {staff.prefixEn} {staff.firstNameEn} {staff.lastNameEn}
                                                </div>
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
                                            {staff.contactEmail ? (
                                                <a href={`mailto:${staff.contactEmail}`} className="link link-primary text-sm">
                                                    {staff.contactEmail}
                                                </a>
                                            ) : (
                                                <span className="opacity-50">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingStaff(staff);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="btn btn-ghost btn-xs text-info"
                                                >
                                                    ✏️ แก้ไข
                                                </button>
                                                <button className="btn btn-ghost btn-xs text-error">
                                                    🗑️ ลบ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {staffList.length === 0 && (
                            <div className="text-center py-12 opacity-60">
                                <p className="text-lg">ยังไม่มีข้อมูลบุคลากร</p>
                                <p className="text-sm">คลิก &quot;เพิ่มบุคลากร&quot; เพื่อเริ่มต้น</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">
                            {editingStaff ? '✏️ แก้ไขข้อมูลบุคลากร' : '➕ เพิ่มบุคลากรใหม่'}
                        </h3>

                        <div className="alert alert-info mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>ฟอร์มนี้จะพัฒนาเพิ่มเติมเร็วๆ นี้</span>
                        </div>

                        <div className="modal-action">
                            <button onClick={() => setIsModalOpen(false)} className="btn">
                                ปิด
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
                </div>
            )}
        </div>
    );
}
