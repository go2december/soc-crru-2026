'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, UserCircle2, UserX } from 'lucide-react';

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

// -----------------------------
// Executive Tiers Configuration
// -----------------------------
const executiveTiers = [
    { level: 1, title: 'คณบดี', ids: [1] },
    { level: 2, title: 'กรรมการผู้ทรงคุณวุฒิ', ids: [10] },
    { level: 3, title: 'รองคณบดี', ids: [2, 3] },
    { level: 4, title: 'ผู้ช่วยคณบดี', ids: [4, 5, 6] },
    { level: 5, title: 'ประธานสาขาวิชาและแขนงวิชา', ids: [7, 8] },
    { level: 6, title: 'ผู้จัดการสาขาวิชา', ids: [9] }
];

const StaffCard = ({ staff }: { staff: Staff }) => (
    <Link href={`/about/staff/${staff.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden flex flex-col relative w-full block">

        {/* Executive Badge */}
        <div className="absolute top-4 right-4 z-10">
            <div className="w-9 h-9 rounded-full bg-white/95 text-scholar-accent flex items-center justify-center shadow-md border border-slate-100/50">
                <Crown className="w-5 h-5" />
            </div>
        </div>

        <div className="pt-6 px-6 bg-slate-50/50 flex justify-center">
            <figure className="aspect-[3/4] w-[75%] bg-slate-100 relative overflow-hidden flex-shrink-0 rounded-xl border border-slate-100 group-hover:scale-103 transition-transform duration-500">
                {staff.imageUrl ? (
                    <Image
                        src={getImageUrl(staff.imageUrl)}
                        alt={getFullName(staff)}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                        <UserCircle2 className="w-16 h-16 md:w-20 md:h-20 mb-2 text-slate-300" strokeWidth={1} />
                    </div>
                )}
            </figure>
        </div>

        <div className="p-6 flex flex-col items-center text-center flex-grow relative bg-white">
            <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug group-hover:text-scholar-accent transition-colors duration-200 line-clamp-2">
                {getFullName(staff)}
            </h3>

            <p className="text-xs font-semibold text-slate-400 leading-relaxed line-clamp-3">
                {staff.adminPosition || staff.academicPosition || ''}
                {staff.adminPosition && (staff.adminPosition.includes('ประธานสาขา') || staff.adminPosition.includes('ประธานแขนง')) && staff.department ? ` - ${staff.department.replace(/สาขาวิชา|แขนงวิชา/g, '').trim()}` : ''}
            </p>
        </div>
    </Link>
);

export default function ExecutivePage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
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

                // Filter only executives
                const executives = data.filter(s => s.isExecutive);
                setStaffList(executives);
            } catch (err) {
                console.error('Error fetching staff:', err);
                setError('ไม่สามารถโหลดข้อมูลผู้บริหารได้');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Hero Header */}
            <section className="bg-scholar-deep text-white pt-20 pb-24 px-4 relative overflow-hidden border-b-4 border-scholar-accent/20">
                <div className="relative z-10 container mx-auto flex flex-col items-start text-left">
                    <div className="px-4 py-1 bg-white/10 text-white backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold tracking-wide mb-8 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-scholar-accent" /> คณะผู้บริหาร / EXECUTIVE BOARD
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight font-heading leading-none max-w-4xl">
                        คณะผู้บริหาร
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed">
                        Executive Board of the Faculty of Social Sciences
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={[
                    { label: 'เกี่ยวกับเรา', href: '/about' },
                    { label: 'คณะผู้บริหาร', href: '/about/executive' }
                ]} />
            </div>

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
                ) : staffList.length > 0 ? (
                    <div className="flex flex-col space-y-16">
                        {executiveTiers
                            .map((tier) => {
                                const tierStaff = staffList.filter(s => s.adminPositionId !== null && tier.ids.includes(s.adminPositionId));
                                if (tierStaff.length === 0) return null;

                                tierStaff.sort((a, b) => {
                                    const idxA = tier.ids.indexOf(a.adminPositionId!);
                                    const idxB = tier.ids.indexOf(b.adminPositionId!);
                                    if (idxA !== idxB) return idxA - idxB;
                                    return (a.sortOrder || 0) - (b.sortOrder || 0);
                                });

                                return (
                                    <div key={tier.level} className="flex flex-col items-center relative animate-fade-in w-full">
                                        {/* Tier Heading */}
                                        <div className="w-full border-b border-slate-200/80 pb-4 mb-10 flex items-end justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-1.5 h-6 bg-scholar-accent rounded-full"></span>
                                                <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight font-heading">
                                                    {tier.title}
                                                </h2>
                                            </div>
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">LEVEL 0{tier.level}</span>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 w-full">
                                            {tierStaff.map(staff => (
                                                <div key={staff.id} className="w-full max-w-[280px]">
                                                    <StaffCard staff={staff} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                            .filter(Boolean)
                            .map((section, index, array) => (
                                <React.Fragment key={index}>
                                    {section}
                                    {index < array.length - 1 && (
                                        <div className="w-full border-t border-slate-200/60 my-16"></div>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                            <UserX className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">ไม่พบข้อมูลคณะผู้บริหาร</h3>
                    </div>
                )}
            </section>
        </main>
    );
}
