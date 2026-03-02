'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search, UserX, GraduationCap, Users,
    Building2, UserCircle2
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
    academicPositionId: number | null;
    academicPosition: string | null;
    adminPositionId: number | null;
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

// Helper: Extract abbreviation for academic titles
const getAcademicAbbr = (position: string | null): string => {
    if (!position) return '';
    if (position.includes('ผู้ช่วยศาสตราจารย์')) return 'ผศ.';
    if (position.includes('รองศาสตราจารย์')) return 'รศ.';
    if (position.includes('ศาสตราจารย์')) return 'ศ.';
    if (position.includes('อาจารย์')) return 'อาจารย์';
    return position;
};

// Helper: สร้างชื่อเต็มพร้อมตำแหน่งวิชาการ
const getFullName = (staff: Staff): string => {
    const acadPos = getAcademicAbbr(staff.academicPosition);
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

// Helper: ใช้สำหรับ Search Text
const getSearchPositionString = (staff: Staff): string => {
    return `${staff.academicPosition || ''} ${staff.adminPosition || ''} ${staff.staffType === 'SUPPORT' ? 'บุคลากรสายสนับสนุน' : 'อาจารย์'}`;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// Helper: Format image URL to work with next/image inside Docker
const getImageUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://localhost') || url.startsWith('http://soc_backend')) {
        try {
            return new URL(url).pathname;
        } catch {
            return url;
        }
    }
    if (API_URL && url.startsWith(API_URL)) {
        return url.replace(API_URL, '');
    }
    return url;
};

const StaffCard = ({ staff }: { staff: Staff }) => (
    <Link href={`/about/staff/${staff.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden w-full flex flex-col relative block">

        <div className="pt-6 px-6 bg-gradient-to-b from-gray-50/50 to-white flex justify-center">
            <figure className="aspect-[3/4] w-[70%] bg-gray-100 relative overflow-hidden flex-shrink-0 rounded-2xl shadow-sm border border-gray-100/50 group-hover:shadow-md transition-shadow duration-300">
                {staff.imageUrl ? (
                    <Image
                        src={getImageUrl(staff.imageUrl)}
                        alt={getFullName(staff)}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100/50">
                        <UserCircle2 className="w-16 h-16 md:w-20 md:h-20 mb-2 text-gray-300" strokeWidth={1} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </figure>
        </div>

        <div className="p-5 flex flex-col items-center text-center flex-grow relative bg-white">
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

            {(() => {
                const isChair = staff.adminPosition && (staff.adminPosition.includes('ประธานสาขา') || staff.adminPosition.includes('ประธานแขนง'));

                return (
                    <div className="flex flex-col items-center gap-1 mt-1 w-full">
                        {isChair ? (
                            <p className="text-[13px] font-bold leading-snug text-scholar-accent text-center line-clamp-2 px-1">
                                {staff.adminPosition}
                            </p>
                        ) : (
                            <>
                                {staff.adminPosition && (
                                    <p className="text-[12px] font-medium text-gray-500 text-center line-clamp-2 mt-0.5 px-1">
                                        {staff.adminPosition}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                );
            })()}
        </div>
    </Link>
);

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [departments, setDepartments] = useState<string[]>(['ทั้งหมด']);
    const [activeDept, setActiveDept] = useState('ทั้งหมด');

    // Tabs: Departments (Academic), Support
    const [activeTab, setActiveTab] = useState<'DEPARTMENTS' | 'SUPPORT'>('DEPARTMENTS');
    const [activeExpertise, setActiveExpertise] = useState<string | null>(null);

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
            } catch (err) {
                console.error('Error fetching staff:', err);
                setError('ไม่สามารถโหลดข้อมูลบุคลากรได้');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    const availableExpertise = useMemo(() => {
        if (activeTab !== 'DEPARTMENTS') return [];
        const deptStaff = staffList.filter(s =>
            s.staffType === 'ACADEMIC' &&
            (activeDept === 'ทั้งหมด' || s.department === activeDept)
        );
        const tags = new Set<string>();
        deptStaff.forEach(s => {
            if (s.expertise && Array.isArray(s.expertise)) {
                s.expertise.forEach(e => {
                    const clean = e.trim();
                    if (clean) tags.add(clean);
                });
            }
        });
        return Array.from(tags).sort();
    }, [staffList, activeTab, activeDept]);

    const filteredStaff = staffList.filter(staff => {
        // 1. Tab Filtering Logic
        if (activeTab === 'DEPARTMENTS') {
            // โชว์เฉพาะอาจารย์
            if (staff.staffType !== 'ACADEMIC') return false;
            // Department Filter
            if (activeDept !== 'ทั้งหมด' && staff.department !== activeDept) return false;
            // Expertise Filter
            if (activeExpertise && (!staff.expertise || !staff.expertise.some(e => e.trim() === activeExpertise))) return false;
        } else if (activeTab === 'SUPPORT') {
            if (staff.staffType !== 'SUPPORT') return false;
        }

        // 2. Search
        const fullName = getFullName(staff).toLowerCase();
        const position = getSearchPositionString(staff).toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            position.includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <main className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero Header */}
            <section className="bg-scholar-deep text-white pt-20 pb-24 px-4 relative overflow-hidden border-b border-scholar-deep/10">
                <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>

                <div className="relative z-10 container mx-auto flex flex-col items-start text-left">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-sm border-l-4 border-scholar-accent text-sm font-semibold mb-8 flex items-center gap-2 text-white">
                        <Users className="w-4 h-4" /> ทำเนียบบุคลากร
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight font-heading leading-[1.1] max-w-4xl">
                        บุคลากรคณะสังคมศาสตร์
                    </h1>
                    <p className="text-lg md:text-2xl text-blue-100/80 font-normal max-w-2xl leading-relaxed">
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
                                onClick={() => { setActiveTab('DEPARTMENTS'); setActiveExpertise(null); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'DEPARTMENTS'
                                    ? 'bg-white text-scholar-deep shadow-sm border border-gray-200/60 scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
                            >
                                <GraduationCap className={`w-5 h-5 ${activeTab === 'DEPARTMENTS' ? 'text-scholar-accent' : ''}`} /> สาขาวิชา
                            </button>
                            <button
                                onClick={() => { setActiveTab('SUPPORT'); setActiveDept('ทั้งหมด'); setActiveExpertise(null); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'SUPPORT'
                                    ? 'bg-white text-scholar-deep shadow-sm border border-gray-200/60 scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
                            >
                                <Building2 className={`w-5 h-5 ${activeTab === 'SUPPORT' ? 'text-teal-500' : ''}`} /> สายสนับสนุน
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-2 pb-1">
                            {/* Department Filters */}
                            <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
                                {activeTab === 'DEPARTMENTS' && (
                                    <div className="flex gap-2 animate-fade-in p-1">
                                        {departments.map(dept => (
                                            <button
                                                key={dept}
                                                onClick={() => { setActiveDept(dept); setActiveExpertise(null); }}
                                                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors duration-200 border ${activeDept === dept
                                                    ? 'bg-scholar-deep border-scholar-deep text-white shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-scholar-accent hover:text-scholar-accent'}`}
                                            >
                                                {dept}
                                            </button>
                                        ))}
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

                        {/* Expertise Tags Filter */}
                        {activeTab === 'DEPARTMENTS' && availableExpertise.length > 0 && (
                            <div className="pt-3 border-t border-gray-100/60 mt-2 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2 px-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">หัวข้อความเชี่ยวชาญ:</span>
                                    {activeExpertise && (
                                        <button
                                            onClick={() => setActiveExpertise(null)}
                                            className="text-xs text-scholar-accent hover:text-scholar-deep hover:underline font-medium transition-colors"
                                        >
                                            ล้างการกรองทั้งหมด
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 px-2 pb-1">
                                    {availableExpertise.map(exp => (
                                        <button
                                            key={exp}
                                            onClick={() => setActiveExpertise(exp === activeExpertise ? null : exp)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeExpertise === exp
                                                ? 'bg-scholar-accent text-white border-scholar-accent shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-scholar-accent/50 hover:bg-slate-50'
                                                }`}
                                        >
                                            {exp}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                        {[...filteredStaff].sort((a, b) => {
                            if (activeTab === 'DEPARTMENTS') {
                                const aIsChair = a.adminPosition?.includes('ประธานสาขา') || a.adminPosition?.includes('ประธานแขนง');
                                const bIsChair = b.adminPosition?.includes('ประธานสาขา') || b.adminPosition?.includes('ประธานแขนง');

                                if (aIsChair && !bIsChair) return -1;
                                if (!aIsChair && bIsChair) return 1;
                            }
                            return (a.sortOrder || 0) - (b.sortOrder || 0);
                        }).map(staff => (
                            <StaffCard key={staff.id} staff={staff} />
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
