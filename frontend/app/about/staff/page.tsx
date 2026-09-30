'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search, UserX, GraduationCap, Users,
    Building2, UserCircle2, Globe, Fingerprint, BookOpen
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
    googleScholarUrl: string | null;
    orcidId: string | null;
    scopusAuthorId: string | null;
    sortOrder: number;
    department: string | null;
    departmentEn: string | null;
    isExecutive: boolean;
}

import { getFullName } from '@/lib/staff';

// Helper: ใช้สำหรับ Search Text
const getSearchPositionString = (staff: Staff): string => {
    return `${staff.academicPosition || ''} ${staff.adminPosition || ''} ${staff.staffType === 'SUPPORT' ? 'บุคลากรสายสนับสนุน' : 'อาจารย์'}`;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    <Link href={`/about/staff/${staff.id}`} className="bg-white rounded-sm border border-slate-200 shadow-2xs card-hover btn-press-active group overflow-hidden w-full flex flex-col relative block">

        <div className="pt-6 px-6 bg-slate-50/50 flex justify-center">
            <figure className="aspect-[3/4] w-[75%] bg-slate-100 relative overflow-hidden flex-shrink-0 rounded-sm border border-slate-200 [@media(hover:hover)]:group-hover:scale-103 transition-transform duration-200 ease-out">
                {staff.imageUrl ? (
                    <Image
                        src={getImageUrl(staff.imageUrl)}
                        alt={getFullName(staff)}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-200 ease-out [@media(hover:hover)]:group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                        <UserCircle2 className="w-16 h-16 md:w-20 md:h-20 mb-2 text-slate-300" strokeWidth={1} />
                    </div>
                )}
            </figure>
        </div>

        <div className="p-5 flex flex-col items-center text-center flex-grow relative bg-white">
            <div className="mb-2.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-bold tracking-wider uppercase border ${staff.staffType === 'ACADEMIC'
                    ? 'bg-blue-50/50 text-blue-700 border-blue-200'
                    : 'bg-teal-50/50 text-teal-700 border-teal-200'
                    }`}>
                    {staff.department || 'ไม่ระบุสังกัด'}
                </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug [@media(hover:hover)]:group-hover:text-scholar-accent transition-colors duration-200 line-clamp-2">
                {getFullName(staff)}
            </h3>

            {(() => {
                const isChair = staff.adminPosition && (staff.adminPosition.includes('ประธานสาขา') || staff.adminPosition.includes('ประธานแขนง'));

                return (
                    <div className="flex flex-col items-center gap-1 mt-0.5 w-full">
                        {isChair ? (
                            <p className="text-[11px] font-bold leading-snug text-scholar-accent text-center line-clamp-2 px-1">
                                {staff.adminPosition}
                            </p>
                        ) : (
                            <>
                                {staff.adminPosition && (
                                    <p className="text-[11px] font-medium text-slate-500 text-center line-clamp-2 mt-0.5 px-1">
                                        {staff.adminPosition}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                );
            })()}

            {/* Researcher Profile Indicators (Scholar / ORCID / Scopus) */}
            {(staff.googleScholarUrl || staff.orcidId || staff.scopusAuthorId) && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 w-full">
                    {staff.googleScholarUrl && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-blue-50 text-blue-600 border border-blue-200" title="Google Scholar Profile">
                            <Globe className="w-3.5 h-3.5" />
                        </span>
                    )}
                    {staff.orcidId && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-200" title="ORCID ID">
                            <Fingerprint className="w-3.5 h-3.5" />
                        </span>
                    )}
                    {staff.scopusAuthorId && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-amber-50 text-amber-700 border border-amber-200" title="Scopus Author ID">
                            <BookOpen className="w-3.5 h-3.5" />
                        </span>
                    )}
                </div>
            )}
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
                const jsonArray = await res.json();
                const data: Staff[] = jsonArray.data || [];
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
        <main className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Hero Header */}
            <section className="bg-scholar-deep text-white pt-20 pb-24 px-4 relative overflow-hidden border-b-4 border-scholar-accent/20">
                <div className="relative z-10 container mx-auto flex flex-col items-start text-left">
                    <div className="px-4 py-1 bg-white/10 text-white backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold tracking-wide mb-8 flex items-center gap-2">
                        <Users className="w-4 h-4 text-scholar-accent" /> ทำเนียบบุคลากร / STAFF DIRECTORY
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight font-heading leading-none max-w-4xl">
                        บุคลากร
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed">
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
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-2 md:p-3 transition-all duration-300">
                    <div className="flex flex-col gap-4">
                        {/* Main Tabs */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-slate-50/50 p-1.5 rounded-2xl">
                            <button
                                onClick={() => { setActiveTab('DEPARTMENTS'); setActiveExpertise(null); }}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors duration-150 btn-press-active ${activeTab === 'DEPARTMENTS'
                                    ? 'bg-scholar-deep text-white shadow-sm'
                                    : 'text-slate-500 [@media(hover:hover)]:hover:text-slate-800 [@media(hover:hover)]:hover:bg-slate-100/50'}`}
                            >
                                <GraduationCap className={`w-5 h-5 ${activeTab === 'DEPARTMENTS' ? 'text-scholar-accent' : ''}`} /> สาขาวิชา
                            </button>
                            <button
                                onClick={() => { setActiveTab('SUPPORT'); setActiveDept('ทั้งหมด'); setActiveExpertise(null); }}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors duration-150 btn-press-active ${activeTab === 'SUPPORT'
                                    ? 'bg-scholar-deep text-white shadow-sm'
                                    : 'text-slate-500 [@media(hover:hover)]:hover:text-slate-800 [@media(hover:hover)]:hover:bg-slate-100/50'}`}
                            >
                                <Building2 className={`w-5 h-5 ${activeTab === 'SUPPORT' ? 'text-teal-500' : ''}`} /> สายสนับสนุน
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-2 pb-1">
                            {/* Department Filters (No Scrollbar) */}
                            <div className="w-full lg:w-auto">
                                {activeTab === 'DEPARTMENTS' && (
                                    <div className="flex flex-wrap gap-2 animate-fade-in p-1">
                                        {departments.map(dept => (
                                            <button
                                                key={dept}
                                                onClick={() => { setActiveDept(dept); setActiveExpertise(null); }}
                                                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-colors duration-150 btn-press-active border ${activeDept === dept
                                                    ? 'bg-scholar-accent border-scholar-accent text-white shadow-sm'
                                                    : 'bg-white border-slate-200 text-slate-600 [@media(hover:hover)]:hover:border-scholar-accent [@media(hover:hover)]:hover:text-scholar-accent'}`}
                                            >
                                                {dept}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'SUPPORT' && (
                                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2 animate-fade-in py-2">
                                        <Building2 className="w-4 h-4 text-teal-500" /> สำนักงานคณบดีและเจ้าหน้าที่ปฏิบัติการ
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="w-full lg:w-auto relative group">
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
                                    className="input input-bordered w-full lg:w-80 pl-11 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:border-scholar-accent focus:bg-white focus:ring-2 focus:ring-scholar-accent/10 transition-colors duration-150 shadow-sm placeholder-slate-400 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 [@media(hover:hover)]:group-focus-within:text-scholar-accent transition-colors duration-150" />
                            </div>
                        </div>

                        {/* Expertise Tags Filter */}
                        {activeTab === 'DEPARTMENTS' && availableExpertise.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 mt-2 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2 px-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">หัวข้อความเชี่ยวชาญ:</span>
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
                                            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors border ${activeExpertise === exp
                                                ? 'bg-scholar-accent text-white border-scholar-accent shadow-sm'
                                                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-scholar-accent/50 hover:bg-white'
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
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-lg font-bold text-scholar-error">{error}</p>
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
                    <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                            <UserX className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">ไม่พบข้อมูลบุคลากร</h3>
                        <p className="text-sm text-slate-400">ในหมวดนี้ หรือลองปรับเงื่อนไขการค้นหาใหม่</p>
                    </div>
                )}
            </section>
        </main>
    );
}
