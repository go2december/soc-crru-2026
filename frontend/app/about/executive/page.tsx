'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Users, UserCircle2, UserX } from 'lucide-react';

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
    <Link href={`/about/staff/${staff.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 border-scholar-accent/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden flex flex-col relative w-full block">

        {/* Executive Badge */}
        <div className="absolute top-4 right-4 z-10">
            <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-amber-500 flex items-center justify-center shadow-lg border border-amber-100">
                <Crown className="w-5 h-5" />
            </div>
        </div>

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
            <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-scholar-deep transition-colors line-clamp-2">
                {getFullName(staff)}
            </h3>

            <p className="text-sm font-medium leading-relaxed line-clamp-3 text-scholar-accent">
                {staff.adminPosition || staff.academicPosition || ''}
                {staff.adminPosition && (staff.adminPosition.includes('ประธานสาขา') || staff.adminPosition.includes('ประธานแขนง')) && staff.department ? `${staff.department.replace(/สาขาวิชา|แขนงวิชา/g, '').trim()}` : ''}
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
                const data: Staff[] = await res.json();

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
        <main className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero Header */}
            <section className="bg-scholar-deep text-white pt-20 pb-24 px-4 relative overflow-hidden border-b border-scholar-deep/10">
                <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>

                <div className="relative z-10 container mx-auto flex flex-col items-start text-left">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-sm border-l-4 border-amber-500 text-sm font-semibold mb-8 flex items-center gap-2 text-white">
                        <Crown className="w-4 h-4 text-amber-500" /> คณะผู้บริหาร
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight font-heading leading-[1.1] max-w-4xl">
                        คณะผู้บริหารคณะสังคมศาสตร์
                    </h1>
                    <p className="text-lg md:text-2xl text-blue-100/80 font-normal max-w-2xl leading-relaxed">
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
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-xl text-red-500">{error}</p>
                    </div>
                ) : staffList.length > 0 ? (
                    <div className="flex flex-col space-y-12 md:space-y-16">
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
                                        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 w-full">
                                            {tierStaff.map(staff => (
                                                <div key={staff.id} className="w-full max-w-[300px]">
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
                                        <div className="w-full max-w-4xl mx-auto border-t border-dashed border-gray-300 my-8"></div>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-gray-100/50 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                            <UserX className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">ไม่พบข้อมูลคณะผู้บริหาร</h3>
                    </div>
                )}
            </section>
        </main>
    );
}
