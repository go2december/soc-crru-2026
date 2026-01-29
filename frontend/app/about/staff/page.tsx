'use client';

import React, { useState, useEffect } from 'react';

// Types ตาม Backend Schema ใหม่
interface Staff {
    id: string;
    prefixTh: string | null;
    firstNameTh: string;
    lastNameTh: string;
    prefixEn: string | null;
    firstNameEn: string | null;
    lastNameEn: string | null;
    staffType: 'ACADEMIC' | 'SUPPORT';
    academicPosition: 'LECTURER' | 'ASSISTANT_PROF' | 'ASSOCIATE_PROF' | 'PROFESSOR' | null;
    adminPosition: string | null;
    education: { level: 'BACHELOR' | 'MASTER' | 'DOCTORAL'; detail: string }[] | null;
    expertise: string[] | null;
    imageUrl: string | null;
    contactEmail: string | null;
    sortOrder: number;
    department: string | null;
    departmentEn: string | null;
}

// Helper: แปลงตำแหน่งวิชาการเป็นภาษาไทย
const getAcademicPositionLabel = (position: Staff['academicPosition']): string => {
    const labels: Record<string, string> = {
        LECTURER: 'อาจารย์',
        ASSISTANT_PROF: 'ผศ.',
        ASSOCIATE_PROF: 'รศ.',
        PROFESSOR: 'ศ.',
    };
    return position ? labels[position] || '' : '';
};

// Helper: สร้างชื่อเต็มพร้อมตำแหน่งวิชาการ
const getFullName = (staff: Staff): string => {
    const acadPos = getAcademicPositionLabel(staff.academicPosition);
    const prefix = staff.prefixTh || '';
    const name = `${staff.firstNameTh} ${staff.lastNameTh}`;

    if (acadPos && prefix) {
        return `${acadPos}${prefix}${name}`;
    } else if (acadPos) {
        return `${acadPos}${name}`;
    } else if (prefix) {
        return `${prefix}${name}`;
    }
    return name;
};

// Helper: สร้าง Position Display (ตำแหน่งบริหาร หรือ ตำแหน่งวิชาการ)
const getPositionDisplay = (staff: Staff): string => {
    if (staff.adminPosition) {
        return staff.adminPosition;
    }
    const acadPos = getAcademicPositionLabel(staff.academicPosition);
    if (acadPos) {
        return `${acadPos === 'อาจารย์' ? 'อาจารย์' : `${acadPos} (ประจำหลักสูตร)`}`;
    }
    return staff.staffType === 'SUPPORT' ? 'บุคลากรสายสนับสนุน' : 'อาจารย์';
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [departments, setDepartments] = useState<string[]>(['ทั้งหมด']);
    const [activeDept, setActiveDept] = useState('ทั้งหมด');
    const [activeType, setActiveType] = useState<'ALL' | 'ACADEMIC' | 'SUPPORT'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/staff`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data: Staff[] = await res.json();
                setStaffList(data);

                // Extract unique departments
                const deptSet = new Set<string>();
                data.forEach(s => {
                    if (s.department) deptSet.add(s.department);
                });
                setDepartments(['ทั้งหมด', ...Array.from(deptSet).sort()]);
            } catch (err) {
                console.error('Error fetching staff:', err);
                setError('ไม่สามารถโหลดข้อมูลบุคลากรได้');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    const filteredStaff = staffList.filter(staff => {
        const matchesDept = activeDept === 'ทั้งหมด' || staff.department === activeDept;
        const matchesType = activeType === 'ALL' || staff.staffType === activeType;
        const fullName = getFullName(staff).toLowerCase();
        const position = getPositionDisplay(staff).toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            position.includes(searchTerm.toLowerCase());
        return matchesDept && matchesType && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-base-100 pb-20">
            {/* Header */}
            <section className="bg-base-200/50 py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4 font-heading">บุคลากรคณะสังคมศาสตร์</h1>
                <p className="text-xl opacity-70">Staff Directory</p>
            </section>

            {/* Controls */}
            <section className="max-w-7xl mx-auto px-4 py-8 sticky top-0 z-30 bg-base-100/95 backdrop-blur-sm border-b border-base-200 shadow-sm">
                <div className="flex flex-col gap-4">
                    {/* Type Filter */}
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setActiveType('ALL')}
                            className={`btn btn-sm ${activeType === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            ทั้งหมด
                        </button>
                        <button
                            onClick={() => setActiveType('ACADEMIC')}
                            className={`btn btn-sm ${activeType === 'ACADEMIC' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            สายวิชาการ
                        </button>
                        <button
                            onClick={() => setActiveType('SUPPORT')}
                            className={`btn btn-sm ${activeType === 'SUPPORT' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            สายสนับสนุน
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Department Filters */}
                        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar scroll-smooth">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveDept(dept)}
                                    className={`btn btn-sm whitespace-nowrap ${activeDept === dept ? 'btn-secondary' : 'btn-ghost'}`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="join w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
                                className="input input-bordered join-item w-full md:w-64 input-sm md:input-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-primary join-item btn-sm md:btn-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Staff Grid */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-xl text-error">{error}</p>
                        <p className="text-sm opacity-50 mt-2">กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ</p>
                    </div>
                ) : filteredStaff.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredStaff.map(staff => (
                            <div key={staff.id} className="card bg-base-100 border border-base-200 hover:shadow-xl transition-all hover:-translate-y-1 group">
                                <figure className="aspect-[3/4] bg-base-200 relative overflow-hidden">
                                    {staff.imageUrl ? (
                                        <img src={staff.imageUrl} alt={getFullName(staff)} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-base-content/10 bg-gradient-to-tr from-base-200 to-base-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
                                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    {/* Staff Type Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className={`badge badge-sm ${staff.staffType === 'ACADEMIC' ? 'badge-primary' : 'badge-secondary'}`}>
                                            {staff.staffType === 'ACADEMIC' ? 'วิชาการ' : 'สนับสนุน'}
                                        </span>
                                    </div>
                                </figure>
                                <div className="card-body p-5">
                                    <div className="badge badge-sm badge-outline mb-2">{staff.department || 'ไม่ระบุสังกัด'}</div>
                                    <h2 className="card-title text-lg font-bold line-clamp-1" title={getFullName(staff)}>{getFullName(staff)}</h2>
                                    <p className="text-sm opacity-80 min-h-[2.5em] line-clamp-2">{getPositionDisplay(staff)}</p>

                                    {/* Education */}
                                    {staff.education && staff.education.length > 0 && (
                                        <div className="text-xs opacity-60 space-y-1">
                                            {staff.education.map((edu, idx) => (
                                                <div key={idx} className="flex items-start gap-1">
                                                    <span className={`badge badge-xs ${edu.level === 'DOCTORAL' ? 'badge-error' :
                                                            edu.level === 'MASTER' ? 'badge-warning' : 'badge-info'
                                                        }`}>
                                                        {edu.level === 'DOCTORAL' ? 'เอก' : edu.level === 'MASTER' ? 'โท' : 'ตรี'}
                                                    </span>
                                                    <span className="line-clamp-1" title={edu.detail}>{edu.detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                                        {staff.contactEmail ? (
                                            <a href={`mailto:${staff.contactEmail}`} className="btn btn-sm btn-ghost text-primary gap-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                                </svg>
                                                ติดต่อ
                                            </a>
                                        ) : (
                                            <span className="btn btn-sm btn-ghost btn-disabled gap-2 w-full opacity-50">
                                                ไม่มีข้อมูลติดต่อ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl">ไม่พบข้อมูลบุคลากรที่ค้นหา</p>
                    </div>
                )}
            </section>
        </main>
    );
}
