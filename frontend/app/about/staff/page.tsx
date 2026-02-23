'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

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
    isExecutive: boolean;
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

// Helper: สร้าง Position Display
const getPositionDisplay = (staff: Staff, isExecutiveContext: boolean): string => {
    // ถ้าเป็นหน้าผู้บริหาร ให้โชว์ Admin Position เป็นหลัก
    if (isExecutiveContext && staff.adminPosition) {
        return staff.adminPosition;
    }

    // ถ้ามีตำแหน่งบริหาร แต่ไม่ได้ดูในโหมดผู้บริหาร ก็ยังโชว์ได้
    if (staff.adminPosition && isExecutiveContext) {
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

    // Tabs: Executives, Departments (Academic), Support
    const [activeTab, setActiveTab] = useState<'EXECUTIVES' | 'DEPARTMENTS' | 'SUPPORT'>('EXECUTIVES');

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

                // Extract unique departments for Academic staff only (for filtered list)
                const deptSet = new Set<string>();
                data.forEach(s => {
                    // Collect departments primarily from Academic staff for the filter list
                    if (s.department && s.staffType === 'ACADEMIC') deptSet.add(s.department);
                });
                setDepartments(['ทั้งหมด', ...Array.from(deptSet).sort()]);

                // ตรวจสอบว่ามีผู้บริหารหรือไม่
                const hasExecs = data.some(s => s.isExecutive);
                if (!hasExecs) {
                    setActiveTab('DEPARTMENTS');
                }
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
        // 1. Tab Filtering Logic
        if (activeTab === 'EXECUTIVES') {
            if (!staff.isExecutive) return false;
        } else if (activeTab === 'DEPARTMENTS') {
            // โชว์เฉพาะอาจารย์ (รวมถึงอาจารย์ที่เป็นผู้บริหารด้วย แต่อยู่ในบริบทสาขาวิชา)
            if (staff.staffType !== 'ACADEMIC') return false;
            // Department Filter (เฉพาะ Tab นี้ที่ใช้ตัวเลือกสาขา)
            if (activeDept !== 'ทั้งหมด' && staff.department !== activeDept) return false;
        } else if (activeTab === 'SUPPORT') {
            if (staff.staffType !== 'SUPPORT') return false;
        }

        // 2. Search (Applied to all tabs)
        const fullName = getFullName(staff).toLowerCase();
        const position = getPositionDisplay(staff, activeTab === 'EXECUTIVES').toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            position.includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Header */}
            <section className="bg-scholar-deep text-white py-16 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-heading">บุคลากรคณะสังคมศาสตร์</h1>
                    <p className="text-xl opacity-80">Faculty of Social Sciences Staff Directory</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={[
                    { label: 'เกี่ยวกับเรา', href: '/about' },
                    { label: 'บุคลากร', href: '/about/staff' }
                ]} />
            </div>

            {/* Controls */}
            <section className="container mx-auto px-4 mb-8 sticky top-20 z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-4">
                    <div className="flex flex-col gap-6">
                        {/* Main Tabs */}
                        <div className="flex flex-wrap justify-center gap-2 border-b border-gray-100 pb-4">
                            <button
                                onClick={() => { setActiveTab('EXECUTIVES'); setActiveDept('ทั้งหมด'); }}
                                className={`btn btn-lg rounded-full px-8 ${activeTab === 'EXECUTIVES'
                                    ? 'btn-primary bg-scholar-accent border-none text-white shadow-lg shadow-scholar-accent/30'
                                    : 'btn-ghost text-gray-500'}`}
                            >
                                👑 คณะผู้บริหาร
                            </button>
                            <button
                                onClick={() => setActiveTab('DEPARTMENTS')}
                                className={`btn btn-lg rounded-full px-8 ${activeTab === 'DEPARTMENTS'
                                    ? 'btn-primary bg-scholar-deep border-none text-white shadow-lg'
                                    : 'btn-ghost text-gray-500'}`}
                            >
                                🎓 สาขาวิชา
                            </button>
                            <button
                                onClick={() => { setActiveTab('SUPPORT'); setActiveDept('ทั้งหมด'); }}
                                className={`btn btn-lg rounded-full px-8 ${activeTab === 'SUPPORT'
                                    ? 'btn-primary bg-teal-600 border-none text-white shadow-lg'
                                    : 'btn-ghost text-gray-500'}`}
                            >
                                🛠️ สายสนับสนุน
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {/* Department Filters (Show Only when 'DEPARTMENTS' tab is active) */}
                            <div className="w-full md:w-auto overflow-x-auto no-scrollbar min-h-[40px]">
                                {activeTab === 'DEPARTMENTS' && (
                                    <div className="flex gap-2 animate-fade-in">
                                        {departments.map(dept => (
                                            <button
                                                key={dept}
                                                onClick={() => setActiveDept(dept)}
                                                className={`btn btn-sm rounded-full whitespace-nowrap px-4 font-normal transition-all duration-300 ${activeDept === dept
                                                    ? 'bg-scholar-deep text-white border-none scale-105 shadow'
                                                    : 'bg-gray-100 text-gray-600 border-none hover:bg-gray-200'}`}
                                            >
                                                {dept}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'EXECUTIVES' && (
                                    <div className="text-sm text-gray-500 italic animate-fade-in pl-2">
                                        แสดงรายชื่อคณะผู้บริหารประจำคณะ
                                    </div>
                                )}
                                {activeTab === 'SUPPORT' && (
                                    <div className="text-sm text-gray-500 italic animate-fade-in pl-2">
                                        สำนักงานคณบดีและเจ้าหน้าที่ปฏิบัติการ
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="w-full md:w-auto relative">
                                <input
                                    type="text"
                                    placeholder="🔍 ค้นหาชื่อ หรือตำแหน่ง..."
                                    className="input input-bordered w-full md:w-72 pl-10 rounded-full bg-gray-50 border-gray-200 focus:border-scholar-accent focus:ring-1 focus:ring-scholar-accent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Staff Grid */}
            <section className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner loading-lg text-scholar-deep"></span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-xl text-red-500">{error}</p>
                    </div>
                ) : filteredStaff.length > 0 ? (
                    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 ${activeTab === 'EXECUTIVES' ? 'justify-items-center' : ''}`}>
                        {filteredStaff.map(staff => (
                            <div key={staff.id} className={`card bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden w-full ${activeTab === 'EXECUTIVES' ? 'max-w-xs border-scholar-accent/20' : ''}`}>
                                <figure className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                    {staff.imageUrl ? (
                                        <img src={staff.imageUrl.startsWith('/') ? `${API_URL}${staff.imageUrl}` : staff.imageUrl} alt={getFullName(staff)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
                                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Executive Badge (Show even in Department view if they are executive) */}
                                    {staff.isExecutive && (
                                        <div className="absolute top-0 right-0 p-2">
                                            <div className="w-8 h-8 rounded-full bg-scholar-accent text-white flex items-center justify-center shadow-lg" title="ผู้บริหาร">
                                                👑
                                            </div>
                                        </div>
                                    )}
                                </figure>

                                <div className="p-5">
                                    <div className="mb-3">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${staff.staffType === 'ACADEMIC'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-teal-50 text-teal-600'
                                            }`}>
                                            {staff.department || 'ไม่ระบุสังกัด'}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-scholar-deep transition-colors">
                                        {getFullName(staff)}
                                    </h3>

                                    <p className={`text-sm mb-3 font-medium ${activeTab === 'EXECUTIVES' ? 'text-scholar-accent' : 'text-gray-500'}`}>
                                        {getPositionDisplay(staff, activeTab === 'EXECUTIVES')}
                                    </p>

                                    {/* Expertise Tags */}
                                    {staff.expertise && staff.expertise.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
                                            {staff.expertise.map((exp, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 font-medium">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        {staff.contactEmail ? (
                                            <a href={`mailto:${staff.contactEmail}`} className="text-xs font-semibold text-scholar-deep hover:text-scholar-accent flex items-center gap-1 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                ติดต่ออีเมล
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-300 cursor-not-allowed">ไม่มีอีเมล</span>
                                        )}

                                        <button className="text-gray-400 hover:text-scholar-deep transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 opacity-50">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-500 mb-2">ไม่พบข้อมูลบุคลากร</h3>
                        <p className="text-gray-400">ในหมวดนี้ หรือลองปรับเงื่อนไขการค้นหา</p>
                    </div>
                )}
            </section>
        </main>
    );
}
