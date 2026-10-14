'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search, UserX, GraduationCap, Users,
    Building2, UserCircle2, Globe, Fingerprint, BookOpen, X
} from 'lucide-react';
import { Staff, getFullName } from '@/lib/staff';
import { getAssetUrl, getApiBaseUrl } from '@/lib/api-config';

// Helper: ใช้สำหรับ Search Text
const getSearchPositionString = (staff: Staff): string => {
    return `${staff.academicPosition || ''} ${staff.adminPosition || ''} ${staff.staffType === 'SUPPORT' ? 'บุคลากรสายสนับสนุน' : 'อาจารย์'}`;
};

const StaffCardSkeleton = () => (
    <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden w-full flex flex-col animate-pulse">
        <div className="pt-6 px-6 bg-slate-50/50 flex justify-center">
            <div className="aspect-[3/4] w-[75%] bg-slate-200 rounded-sm"></div>
        </div>
        <div className="p-5 flex flex-col items-center flex-grow bg-white space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-36 bg-slate-200 rounded"></div>
            <div className="h-3 w-28 bg-slate-100 rounded"></div>
            <div className="pt-3 border-t border-slate-100 flex gap-2 w-full justify-center">
                <div className="w-6 h-6 bg-slate-100 rounded"></div>
                <div className="w-6 h-6 bg-slate-100 rounded"></div>
            </div>
        </div>
    </div>
);

const StaffCard = ({ staff }: { staff: Staff }) => (
    <Link href={`/about/staff/${staff.id}`} className="bg-white rounded-sm border border-slate-200 shadow-2xs card-hover btn-press-active group overflow-hidden w-full flex flex-col relative block">
        <div className="pt-6 px-6 bg-slate-50/50 flex justify-center">
            <figure className="aspect-[3/4] w-[75%] bg-slate-100 relative overflow-hidden flex-shrink-0 rounded-sm border border-slate-200 [@media(hover:hover)]:group-hover:scale-103 transition-transform duration-200 ease-out">
                {staff.imageUrl ? (
                    <Image
                        src={getAssetUrl(staff.imageUrl)}
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

interface StaffDirectoryClientProps {
    initialStaff: Staff[];
}

export default function StaffDirectoryClient({ initialStaff }: StaffDirectoryClientProps) {
    const [staffList, setStaffList] = useState<Staff[]>(initialStaff || []);
    const [loading, setLoading] = useState(initialStaff && initialStaff.length > 0 ? false : true);
    const [error, setError] = useState<string | null>(null);

    // Tabs: Departments (Academic), Support
    const [activeTab, setActiveTab] = useState<'DEPARTMENTS' | 'SUPPORT'>('DEPARTMENTS');
    const [activeDept, setActiveDept] = useState('ทั้งหมด');
    const [activeExpertise, setActiveExpertise] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Read ?dept= from URL if present
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const dept = params.get('dept');
            if (dept) {
                setActiveDept(dept);
                setActiveTab('DEPARTMENTS');
            }
        }
    }, []);

    // Fallback client-side fetch if initialStaff was empty on SSR
    useEffect(() => {
        if (initialStaff && initialStaff.length > 0) return;

        const fetchStaff = async () => {
            try {
                setLoading(true);
                const baseUrl = getApiBaseUrl();
                const res = await fetch(`${baseUrl}/api/staff?limit=150`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const jsonArray = await res.json();
                const data: Staff[] = jsonArray.data || [];
                setStaffList(data);
            } catch (err) {
                console.error('Error fetching staff client-side:', err);
                setError('ไม่สามารถโหลดข้อมูลบุคลากรได้');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [initialStaff]);

    // Calculate Counts
    const { academicCount, supportCount, departments, deptCounts } = useMemo(() => {
        let academic = 0;
        let support = 0;
        const deptSet = new Set<string>();
        const dCounts: Record<string, number> = {};

        staffList.forEach(s => {
            if (s.staffType === 'ACADEMIC') {
                academic++;
                if (s.department) {
                    deptSet.add(s.department);
                    dCounts[s.department] = (dCounts[s.department] || 0) + 1;
                }
            } else if (s.staffType === 'SUPPORT') {
                support++;
            }
        });

        const sortedDepts = ['ทั้งหมด', ...Array.from(deptSet).sort()];
        return {
            academicCount: academic,
            supportCount: support,
            departments: sortedDepts,
            deptCounts: dCounts
        };
    }, [staffList]);

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
            if (staff.staffType !== 'ACADEMIC') return false;
            if (activeDept !== 'ทั้งหมด' && staff.department !== activeDept) return false;
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
            <section className="container mx-auto px-4 mb-6 relative md:sticky md:top-20 z-30">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-3 md:p-4 transition-all duration-300">
                    <div className="flex flex-col gap-4">
                        {/* Main Tabs with Count Badges */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-slate-50/70 p-1.5 rounded-2xl">
                            <button
                                onClick={() => { setActiveTab('DEPARTMENTS'); setActiveExpertise(null); }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-150 btn-press-active text-sm ${activeTab === 'DEPARTMENTS'
                                    ? 'bg-scholar-deep text-white shadow-sm font-semibold'
                                    : 'text-slate-600 [@media(hover:hover)]:hover:text-slate-900 [@media(hover:hover)]:hover:bg-slate-100/70'}`}
                            >
                                <GraduationCap className={`w-4 h-4 ${activeTab === 'DEPARTMENTS' ? 'text-scholar-accent' : ''}`} />
                                <span>สาขาวิชา</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'DEPARTMENTS' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'}`}>
                                    {academicCount}
                                </span>
                            </button>
                            <button
                                onClick={() => { setActiveTab('SUPPORT'); setActiveDept('ทั้งหมด'); setActiveExpertise(null); }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-150 btn-press-active text-sm ${activeTab === 'SUPPORT'
                                    ? 'bg-scholar-deep text-white shadow-sm font-semibold'
                                    : 'text-slate-600 [@media(hover:hover)]:hover:text-slate-900 [@media(hover:hover)]:hover:bg-slate-100/70'}`}
                            >
                                <Building2 className={`w-4 h-4 ${activeTab === 'SUPPORT' ? 'text-teal-400' : ''}`} />
                                <span>สายสนับสนุน</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'SUPPORT' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'}`}>
                                    {supportCount}
                                </span>
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-1 pb-1">
                            {/* Department Filters with Counts */}
                            <div className="w-full lg:w-auto">
                                {activeTab === 'DEPARTMENTS' && (
                                    <div className="flex flex-wrap gap-2 animate-fade-in p-1">
                                        {departments.map(dept => {
                                            const count = dept === 'ทั้งหมด' ? academicCount : (deptCounts[dept] || 0);
                                            const isSelected = activeDept === dept;
                                            return (
                                                <button
                                                    key={dept}
                                                    onClick={() => { setActiveDept(dept); setActiveExpertise(null); }}
                                                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all duration-150 btn-press-active border inline-flex items-center gap-1.5 ${isSelected
                                                        ? 'bg-scholar-accent border-scholar-accent text-white shadow-sm'
                                                        : 'bg-white border-slate-200 text-slate-600 [@media(hover:hover)]:hover:border-scholar-accent [@media(hover:hover)]:hover:text-scholar-accent'}`}
                                                >
                                                    <span>{dept}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white font-bold' : 'bg-slate-100 text-slate-500'}`}>
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                {activeTab === 'SUPPORT' && (
                                    <div className="text-sm font-medium text-slate-600 flex items-center gap-2 animate-fade-in py-2">
                                        <Building2 className="w-4 h-4 text-teal-600" />
                                        <span>สำนักงานคณบดีและเจ้าหน้าที่ปฏิบัติการ ({supportCount} ท่าน)</span>
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="w-full lg:w-auto relative group">
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
                                    className="input input-bordered w-full lg:w-80 pl-11 pr-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:border-scholar-accent focus:bg-white focus:ring-2 focus:ring-scholar-accent/10 transition-colors duration-150 shadow-sm placeholder-slate-400 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 [@media(hover:hover)]:group-focus-within:text-scholar-accent transition-colors duration-150" />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                        title="ล้างคำค้นหา"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expertise Tags Filter */}
                        {activeTab === 'DEPARTMENTS' && availableExpertise.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 mt-1 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">หัวข้อความเชี่ยวชาญ:</span>
                                    {activeExpertise && (
                                        <button
                                            onClick={() => setActiveExpertise(null)}
                                            className="text-xs text-scholar-accent hover:text-scholar-deep hover:underline font-medium transition-colors"
                                        >
                                            ล้างการกรอง ({activeExpertise})
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 px-1 pb-1">
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
            <section className="container mx-auto px-4 pb-16">
                {/* Active Filter & Results Summary Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-1 mb-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                            {activeTab === 'DEPARTMENTS' ? 'คณาจารย์ประจำสาขาวิชา' : 'บุคลากรสายสนับสนุน'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                            แสดง <strong className="text-slate-900 font-bold">{filteredStaff.length}</strong> จากทั้งหมด {activeTab === 'DEPARTMENTS' ? academicCount : supportCount} ท่าน
                        </span>
                        {(searchTerm || (activeTab === 'DEPARTMENTS' && activeDept !== 'ทั้งหมด') || activeExpertise) && (
                            <span className="hidden sm:inline text-slate-400 italic">
                                (คัดกรองตามเงื่อนไข)
                            </span>
                        )}
                    </div>

                    {(searchTerm || (activeTab === 'DEPARTMENTS' && activeDept !== 'ทั้งหมด') || activeExpertise) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setActiveDept('ทั้งหมด');
                                setActiveExpertise(null);
                            }}
                            className="text-xs font-semibold text-scholar-accent hover:text-scholar-deep hover:underline inline-flex items-center gap-1 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> ล้างตัวกรองทั้งหมด
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <StaffCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md mx-auto">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-base font-bold text-scholar-error mb-2">{error}</p>
                        <p className="text-xs text-slate-500 mb-6">กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-scholar-deep text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                        >
                            โหลดข้อมูลใหม่
                        </button>
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
                        {(searchTerm || activeDept !== 'ทั้งหมด' || activeExpertise) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setActiveDept('ทั้งหมด');
                                    setActiveExpertise(null);
                                }}
                                className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                            >
                                ล้างตัวกรองทั้งหมด
                            </button>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
