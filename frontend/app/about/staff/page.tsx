'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import {
    Search, UserX, Crown, GraduationCap, Users,
    ChevronRight, Mail, Building2, UserCircle2
} from 'lucide-react';

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
        <main className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero Header */}
            <section className="bg-gradient-to-br from-scholar-deep via-blue-900 to-scholar-accent text-white py-20 px-4 text-center relative overflow-hidden shadow-xl shadow-scholar-deep/20">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat animate-pulse-slow"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6 flex items-center gap-2 shadow-sm">
                        <Users className="w-4 h-4 text-blue-200" /> ทำเนียบบุคลากร
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight font-heading leading-tight drop-shadow-md">
                        บุคลากรคณะสังคมศาสตร์
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 font-light max-w-2xl mx-auto drop-shadow">
                        Faculty of Social Sciences Staff Directory
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={[
                    { label: 'เกี่ยวกับเรา', href: '/about' },
                    { label: 'บุคลากร', href: '/about/staff' }
                ]} />
            </div>

            {/* Controls */}
            <section className="container mx-auto px-4 mb-10 sticky top-20 z-30">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 p-2 md:p-3 transition-all duration-300">
                    <div className="flex flex-col gap-4">
                        {/* Main Tabs */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-gray-50/50 p-1.5 rounded-2xl">
                            <button
                                onClick={() => { setActiveTab('EXECUTIVES'); setActiveDept('ทั้งหมด'); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'EXECUTIVES'
                                    ? 'bg-white text-scholar-deep shadow-sm border border-gray-200/60 scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
                            >
                                <Crown className={`w-5 h-5 ${activeTab === 'EXECUTIVES' ? 'text-amber-500' : ''}`} /> คณะผู้บริหาร
                            </button>
                            <button
                                onClick={() => setActiveTab('DEPARTMENTS')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'DEPARTMENTS'
                                    ? 'bg-white text-scholar-deep shadow-sm border border-gray-200/60 scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
                            >
                                <GraduationCap className={`w-5 h-5 ${activeTab === 'DEPARTMENTS' ? 'text-scholar-accent' : ''}`} /> สาขาวิชา
                            </button>
                            <button
                                onClick={() => { setActiveTab('SUPPORT'); setActiveDept('ทั้งหมด'); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'SUPPORT'
                                    ? 'bg-white text-scholar-deep shadow-sm border border-gray-200/60 scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
                            >
                                <Building2 className={`w-5 h-5 ${activeTab === 'SUPPORT' ? 'text-teal-500' : ''}`} /> สายสนับสนุน
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-2 pb-1">
                            {/* Department Filters (Show Only when 'DEPARTMENTS' tab is active) */}
                            <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
                                {activeTab === 'DEPARTMENTS' && (
                                    <div className="flex gap-2 animate-fade-in p-1">
                                        {departments.map(dept => (
                                            <button
                                                key={dept}
                                                onClick={() => setActiveDept(dept)}
                                                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors duration-200 border ${activeDept === dept
                                                    ? 'bg-scholar-deep border-scholar-deep text-white shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-scholar-accent hover:text-scholar-accent'}`}
                                            >
                                                {dept}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'EXECUTIVES' && (
                                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2 animate-fade-in py-2">
                                        <Crown className="w-4 h-4 text-amber-500" /> แสดงรายชื่อคณะผู้บริหารประจำคณะ
                                    </div>
                                )}
                                {activeTab === 'SUPPORT' && (
                                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2 animate-fade-in py-2">
                                        <Building2 className="w-4 h-4 text-teal-500" /> สำนักงานคณบดีและเจ้าหน้าที่ปฏิบัติการ
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="w-full lg:w-auto relative group">
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
                                    className="input input-bordered w-full lg:w-80 pl-11 h-12 rounded-xl bg-white border-gray-200 focus:border-scholar-accent focus:ring-2 focus:ring-scholar-accent/20 transition-all shadow-sm placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-scholar-accent transition-colors" />
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
                            <div key={staff.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden w-full flex flex-col ${activeTab === 'EXECUTIVES' ? 'max-w-[300px] border-scholar-accent/20' : ''}`}>
                                <figure className="aspect-[3/4] bg-gray-50 relative overflow-hidden flex-shrink-0">
                                    {staff.imageUrl ? (
                                        <img src={staff.imageUrl.startsWith('/') ? `${API_URL}${staff.imageUrl}` : staff.imageUrl} alt={getFullName(staff)} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100/50">
                                            <UserCircle2 className="w-24 h-24 mb-2 text-gray-300" strokeWidth={1} />
                                        </div>
                                    )}

                                    {/* Executive Badge (Show even in Department view if they are executive) */}
                                    {staff.isExecutive && (
                                        <div className="absolute top-3 right-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-amber-500 flex items-center justify-center shadow-lg border border-amber-100">
                                                <Crown className="w-5 h-5" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Gradient overlay base for uncropped images to ensure text readability if needed later */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </figure>

                                <div className="p-5 flex flex-col flex-grow relative border-t border-gray-50">
                                    <div className="mb-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${staff.staffType === 'ACADEMIC'
                                            ? 'bg-blue-50/50 text-blue-700 border-blue-100'
                                            : 'bg-teal-50/50 text-teal-700 border-teal-100'
                                            }`}>
                                            {staff.department || 'ไม่ระบุสังกัด'}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-scholar-deep transition-colors line-clamp-2">
                                        {getFullName(staff)}
                                    </h3>

                                    <p className={`text-sm mb-4 font-medium leading-relaxed line-clamp-2 ${activeTab === 'EXECUTIVES' ? 'text-scholar-accent' : 'text-gray-600'}`}>
                                        {getPositionDisplay(staff, activeTab === 'EXECUTIVES')}
                                    </p>

                                    {/* Expertise Tags */}
                                    <div className="mt-auto">
                                        {staff.expertise && staff.expertise.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5 mb-5 min-h-[48px] content-start">
                                                {staff.expertise.slice(0, 3).map((exp, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-gray-100/80 hover:bg-gray-200/80 transition-colors text-gray-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]" title={exp}>
                                                        {exp}
                                                    </span>
                                                ))}
                                                {staff.expertise.length > 3 && (
                                                    <span className="px-2 py-0.5 rounded text-[11px] bg-gray-50 text-gray-400 font-medium">
                                                        +{staff.expertise.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mb-5 min-h-[48px]"></div> // Space preservation
                                        )}

                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center group/action">
                                            {staff.contactEmail ? (
                                                <a href={`mailto:${staff.contactEmail}`} className="text-[13px] font-semibold text-gray-500 hover:text-scholar-accent flex items-center gap-1.5 transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                    ติดต่อ
                                                </a>
                                            ) : (
                                                <span className="text-[13px] text-gray-300 cursor-not-allowed flex items-center gap-1.5">
                                                    <Mail className="w-4 h-4 opacity-50" />ไม่มีอีเมล
                                                </span>
                                            )}

                                            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-scholar-deep group-hover:text-white transition-all duration-300">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-gray-100/50 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                            <UserX className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">ไม่พบข้อมูลบุคลากร</h3>
                        <p className="text-gray-500">ในหมวดนี้ หรือลองปรับเงื่อนไขการค้นหาใหม่</p>
                    </div>
                )}
            </section>
        </main>
    );
}
