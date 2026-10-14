'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import {
    Crown,
    UserCircle2,
    UserX,
    Mail,
    ArrowRight,
    Quote,
    Network,
    Users,
    Sparkles,
    Building2
} from 'lucide-react';
import { getFullName, getFullNameEn } from '@/lib/staff';
import JsonLd from '@/components/seo/JsonLd';

// Types ตาม Backend Schema
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
    bio?: string | null;
    sortOrder: number;
    department: string | null;
    departmentEn: string | null;
    isExecutive: boolean;
}

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

// ==========================================
// Component: Dean Spotlight Hero Card (แบบ A)
// ==========================================
const DeanSpotlightCard = ({ dean }: { dean: Staff }) => {
    const defaultQuote = "มุ่งมั่นบูรณาการองค์ความรู้ทางสังคมศาสตร์สู่การสร้างนวัตกรรมเพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน และขับเคลื่อนองค์กรสู่มาตรฐานความเป็นเลิศ";
    const quoteText = dean.bio?.trim() || defaultQuote;
    const englishName = getFullNameEn(dean);

    return (
        <section aria-label="สารและข้อมูลคณบดี" className="w-full bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden mb-16 relative">
            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-scholar-deep via-scholar-accent to-amber-500" />

            <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-stretch">
                {/* Dean Photo Frame (Sharp & Professional) */}
                <div className="w-full sm:w-72 lg:w-80 flex-shrink-0 flex flex-col items-center">
                    <figure className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden rounded-sm border-2 border-amber-200/60 shadow-md group">
                        {dean.imageUrl ? (
                            <Image
                                src={getImageUrl(dean.imageUrl)}
                                alt={getFullName(dean)}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 320px"
                                className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-103"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                                <UserCircle2 className="w-24 h-24 mb-2 text-slate-300" strokeWidth={1} />
                            </div>
                        )}
                        <div className="absolute top-3 right-3 bg-scholar-deep/90 text-scholar-accent px-2.5 py-1 rounded-sm border border-amber-400/40 text-[11px] font-bold tracking-wider flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
                            <Crown className="w-3.5 h-3.5" />
                            <span>DEAN</span>
                        </div>
                    </figure>
                </div>

                {/* Dean Information & Statement (NO Education details displayed) */}
                <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                        {/* Status Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-scholar-accent border border-amber-200 rounded-sm text-xs font-bold tracking-wide mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>ผู้นำองค์กร / Head of Organization</span>
                        </div>

                        {/* Position & Title */}
                        <p className="text-sm font-semibold text-scholar-accent tracking-wide uppercase mb-1">
                            {dean.adminPosition || 'คณบดีคณะสังคมศาสตร์'}
                        </p>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading tracking-tight mb-1">
                            {getFullName(dean)}
                        </h2>
                        {englishName && (
                            <p className="text-sm sm:text-base text-slate-500 font-medium mb-6">
                                {englishName}
                            </p>
                        )}

                        {/* Vision Statement Quote Block */}
                        <div className="relative bg-slate-50 border-l-4 border-scholar-accent p-5 rounded-sm my-4">
                            <Quote className="w-6 h-6 text-scholar-accent/30 absolute top-3 right-3" />
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                วิสัยทัศน์และสารจากคณบดี (Dean&apos;s Vision)
                            </p>
                            <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic font-serif">
                                &ldquo;{quoteText}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Contact & Profile Action Buttons */}
                    <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                        <Link
                            href={`/about/staff/${dean.id}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-scholar-deep hover:bg-slate-800 text-white text-xs md:text-sm font-semibold rounded-sm transition-colors shadow-2xs group"
                        >
                            <span>ดูประวัติและผลงานวิชาการ</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        {dean.contactEmail && (
                            <a
                                href={`mailto:${dean.contactEmail}`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-scholar-deep text-xs md:text-sm font-medium rounded-sm border border-slate-200 transition-colors"
                            >
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span>{dean.contactEmail}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==========================================
// Component: Executive Member Card (Sharp & Professional)
// ==========================================
const ExecutiveCard = ({ staff }: { staff: Staff }) => (
    <Link
        href={`/about/staff/${staff.id}`}
        className="bg-white rounded-sm border border-slate-200 shadow-2xs card-hover btn-press-active group overflow-hidden flex flex-col relative w-full block transition-all duration-200 hover:border-scholar-accent/60"
    >
        {/* Top Gold Bar on Hover */}
        <div className="h-1 w-full bg-transparent group-hover:bg-scholar-accent transition-colors" />

        <div className="pt-6 px-6 bg-slate-50/50 flex justify-center">
            <figure className="aspect-[3/4] w-[75%] bg-slate-100 relative overflow-hidden flex-shrink-0 rounded-sm border border-slate-200 transition-transform duration-200 ease-out group-hover:scale-102">
                {staff.imageUrl ? (
                    <Image
                        src={getImageUrl(staff.imageUrl)}
                        alt={getFullName(staff)}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover object-top transition-transform duration-200 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                        <UserCircle2 className="w-16 h-16 md:w-20 md:h-20 mb-2 text-slate-300" strokeWidth={1} />
                    </div>
                )}
            </figure>
        </div>

        <div className="p-5 flex flex-col items-center text-center flex-grow relative bg-white">
            {/* Department / Category Pill */}
            {staff.department && (
                <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wider text-slate-500 bg-slate-100 border border-slate-200">
                        {staff.department.replace(/สาขาวิชา|แขนงวิชา/g, '').trim()}
                    </span>
                </div>
            )}

            {/* Full Name */}
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-scholar-accent transition-colors duration-200 line-clamp-2">
                {getFullName(staff)}
            </h3>

            {/* Position Display */}
            <p className="text-xs font-medium text-scholar-accent line-clamp-2 leading-relaxed">
                {staff.adminPosition || staff.academicPosition || 'ผู้บริหาร'}
            </p>

            {/* Quick Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center text-[11px] text-slate-400 group-hover:text-scholar-deep font-medium gap-1">
                <span>ดูข้อมูลประวัติ</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    </Link>
);

// ==========================================
// Component: Skeleton Loader (ป้องกัน CLS)
// ==========================================
const ExecutiveSkeleton = () => (
    <div className="space-y-16 animate-pulse">
        {/* Dean Spotlight Skeleton */}
        <div className="bg-white border border-slate-200 rounded-sm p-8 flex flex-col lg:flex-row gap-8">
            <div className="w-full sm:w-72 aspect-[3/4] bg-slate-200 rounded-sm" />
            <div className="flex-1 space-y-4 py-4">
                <div className="h-6 bg-slate-200 rounded-sm w-48" />
                <div className="h-9 bg-slate-200 rounded-sm w-3/4" />
                <div className="h-4 bg-slate-200 rounded-sm w-1/2" />
                <div className="h-24 bg-slate-100 rounded-sm w-full mt-6" />
                <div className="h-10 bg-slate-200 rounded-sm w-56 mt-6" />
            </div>
        </div>

        {/* Group Cards Skeleton */}
        {[1, 2].map((g) => (
            <div key={g} className="space-y-6">
                <div className="h-8 bg-slate-200 rounded-sm w-64 border-l-4 border-slate-300" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
                            <div className="aspect-[3/4] bg-slate-200 rounded-sm" />
                            <div className="h-4 bg-slate-200 rounded-sm w-3/4 mx-auto" />
                            <div className="h-3 bg-slate-200 rounded-sm w-1/2 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// ==========================================
// Main Page Component
// ==========================================
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

                // กรองเฉพาะผู้บริหาร (isExecutive = true)
                const executives = data.filter((s) => s.isExecutive);
                setStaffList(executives);
            } catch (err) {
                console.error('Error fetching executive staff:', err);
                setError('ไม่สามารถโหลดข้อมูลคณะผู้บริหารได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    // -------------------------------------------------------------
    // จัดกลุ่มตำแหน่งบริหาร 3 กลุ่มหลัก ตามความต้องการของผู้ใช้:
    // 1. คณะผู้บริหารระดับสูง (Senior Leadership): คณบดี, รองคณบดี, ผู้ทรงคุณวุฒิ
    // 2. ผู้ช่วยคณบดี (Assistant Deans)
    // 3. ประธานสาขาวิชา/แขนงวิชา (Department & Program Chairs)
    // -------------------------------------------------------------
    const { dean, seniorExecs, assistantDeans, departmentChairs } = useMemo(() => {
        let deanPerson: Staff | null = null;
        const seniors: Staff[] = [];
        const assistants: Staff[] = [];
        const chairs: Staff[] = [];

        staffList.forEach((staff) => {
            const pos = staff.adminPosition || '';
            const posId = staff.adminPositionId;

            // ค้นหาคณบดี
            const isDean = (pos.includes('คณบดี') && !pos.includes('รอง') && !pos.includes('ผู้ช่วย')) || posId === 1;

            if (isDean && !deanPerson) {
                deanPerson = staff;
                return;
            }

            // กลุ่ม 1: คณะผู้บริหารระดับสูง (รองคณบดี, ผู้ทรงคุณวุฒิ)
            if (pos.includes('รองคณบดี') || pos.includes('ผู้ทรงคุณวุฒิ') || (posId !== null && [2, 3, 10].includes(posId))) {
                seniors.push(staff);
                return;
            }

            // กลุ่ม 2: ผู้ช่วยคณบดี
            if (pos.includes('ผู้ช่วยคณบดี') || (posId !== null && [4, 5, 6].includes(posId))) {
                assistants.push(staff);
                return;
            }

            // กลุ่ม 3: ประธานสาขาวิชา / แขนงวิชา / ผู้จัดการสาขาวิชา
            if (pos.includes('ประธาน') || pos.includes('ผู้จัดการ') || (posId !== null && [7, 8, 9].includes(posId))) {
                chairs.push(staff);
                return;
            }

            // Fallback: หากตำแหน่งบริหารอื่นๆ ให้จัดเข้าตามลำดับความเหมาะสม
            if (pos.includes('ผู้ช่วย')) {
                assistants.push(staff);
            } else if (pos.includes('สาขา') || pos.includes('แขนง')) {
                chairs.push(staff);
            } else {
                seniors.push(staff);
            }
        });

        // เรียงลำดับภายในกลุ่มตาม sortOrder
        const sortFn = (a: Staff, b: Staff) => (a.sortOrder || 0) - (b.sortOrder || 0);
        seniors.sort(sortFn);
        assistants.sort(sortFn);
        chairs.sort(sortFn);

        return {
            dean: deanPerson,
            seniorExecs: seniors,
            assistantDeans: assistants,
            departmentChairs: chairs,
        };
    }, [staffList]);

    // JSON-LD Schema.org Data สำหรับ Webometrics และ Google Search
    const jsonLdData = useMemo(() => {
        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'คณะผู้บริหาร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
            description: 'ทำเนียบคณะผู้บริหาร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
            numberOfItems: staffList.length,
            itemListElement: staffList.map((staff, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Person',
                    name: getFullName(staff),
                    jobTitle: staff.adminPosition || 'ผู้บริหาร',
                    worksFor: {
                        '@type': 'EducationalOrganization',
                        name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
                    },
                    ...(staff.contactEmail ? { email: staff.contactEmail } : {}),
                    ...(staff.imageUrl ? { image: getImageUrl(staff.imageUrl) } : {}),
                },
            })),
        };
    }, [staffList]);

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            {/* Structured Data (Schema.org) */}
            <JsonLd data={jsonLdData} />

            {/* 1. Hero Header */}
            <section className="bg-scholar-deep text-white pt-16 pb-20 px-4 relative overflow-hidden border-b-4 border-scholar-accent/30">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-scholar-deep to-slate-950 opacity-90" />
                <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-5 pointer-events-none" />

                <div className="relative z-10 container mx-auto flex flex-col items-start text-left max-w-6xl">
                    <div className="px-3.5 py-1 bg-white/10 text-white backdrop-blur-sm border border-white/20 rounded-sm text-xs font-semibold tracking-wide mb-6 flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-scholar-accent" />
                        <span>คณะผู้บริหาร / EXECUTIVE BOARD</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight font-heading leading-tight max-w-4xl">
                        คณะผู้บริหาร <br className="hidden sm:inline" />
                        <span className="text-scholar-accent text-2xl md:text-4xl lg:text-5xl font-bold">
                            คณะสังคมศาสตร์ มรภ.เชียงราย
                        </span>
                    </h1>

                    <p className="text-sm md:text-lg text-slate-300 font-normal max-w-3xl leading-relaxed">
                        ทีมผู้นำทางวิชาการและการบริหาร มุ่งมั่นพัฒนาการจัดการศึกษา บูรณาการองค์ความรู้เพื่อสังคม และขับเคลื่อนองค์กรสู่มาตรฐานความเป็นเลิศ
                    </p>
                </div>
            </section>


            {/* 3. Breadcrumb Navigation */}
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <Breadcrumb
                    items={[
                        { label: 'หน้าแรก', href: '/' },
                        { label: 'เกี่ยวกับเรา', href: '/about' },
                        { label: 'คณะผู้บริหาร', href: '/about/executive' },
                    ]}
                />
            </div>

            {/* 4. Content Body */}
            <section className="container mx-auto px-4 max-w-6xl">
                {loading ? (
                    <ExecutiveSkeleton />
                ) : error ? (
                    <div className="text-center py-16 px-6 bg-white rounded-sm border border-red-200 shadow-2xs max-w-2xl mx-auto">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-sm flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <UserX className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-scholar-deep hover:bg-slate-800 text-white rounded-sm text-xs font-semibold transition-colors"
                        >
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                ) : staffList.length > 0 ? (
                    <div className="space-y-16">
                        {/* ======================================================== */}
                        {/* กลุ่มที่ 1: คณะผู้บริหารระดับสูง (Senior Leadership)       */}
                        {/* ======================================================== */}
                        <div>
                            {/* Dean Spotlight Card (แบบ A - ไม่แสดงวุฒิการศึกษา) */}
                            {dean && <DeanSpotlightCard dean={dean} />}

                            {/* รองคณบดี และ ผู้ทรงคุณวุฒิ */}
                            {seniorExecs.length > 0 && (
                                <div className="space-y-8">
                                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-1.5 h-6 bg-scholar-accent rounded-sm" />
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
                                                คณะผู้บริหารระดับสูง (Senior Leadership)
                                            </h2>
                                        </div>
                                        <span className="text-xs font-mono text-slate-400">
                                            {seniorExecs.length} ท่าน
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                        {seniorExecs.map((staff) => (
                                            <ExecutiveCard key={staff.id} staff={staff} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ======================================================== */}
                        {/* กลุ่มที่ 2: ผู้ช่วยคณบดี (Assistant Deans)                  */}
                        {/* ======================================================== */}
                        {assistantDeans.length > 0 && (
                            <div className="space-y-8">
                                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-scholar-accent rounded-sm" />
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
                                            ผู้ช่วยคณบดี (Assistant Deans)
                                        </h2>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">
                                        {assistantDeans.length} ท่าน
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {assistantDeans.map((staff) => (
                                        <ExecutiveCard key={staff.id} staff={staff} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ======================================================== */}
                        {/* กลุ่มที่ 3: ประธานสาขาวิชาและแขนงวิชา (Department Chairs)  */}
                        {/* ======================================================== */}
                        {departmentChairs.length > 0 && (
                            <div className="space-y-8">
                                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-scholar-accent rounded-sm" />
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
                                            ประธานสาขาวิชาและแขนงวิชา (Department & Program Chairs)
                                        </h2>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">
                                        {departmentChairs.length} ท่าน
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {departmentChairs.map((staff) => (
                                        <ExecutiveCard key={staff.id} staff={staff} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ======================================================== */}
                        {/* เชื่อมโยงกับส่วนอื่นในหมวด "เกี่ยวกับเรา" (Quick Hub Links)  */}
                        {/* ======================================================== */}
                        <div className="pt-10 border-t border-slate-200">
                            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-scholar-accent" />
                                <span>ดูข้อมูลเพิ่มเติมในหมวดเกี่ยวกับคณะ</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Link
                                    href="/about/structure"
                                    className="p-6 bg-white border border-slate-200 rounded-sm hover:border-scholar-accent transition-all duration-200 shadow-2xs group flex items-start gap-4"
                                >
                                    <div className="p-3 bg-slate-50 text-scholar-deep rounded-sm border border-slate-100 group-hover:bg-amber-50 group-hover:text-scholar-accent transition-colors">
                                        <Network className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-scholar-accent transition-colors flex items-center gap-1.5">
                                            <span>แผนผังโครงสร้างการบริหาร (Org Chart)</span>
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            ตรวจสอบสายการบังคับบัญชา แผนผังการบริหารงาน และหน่วยงานสนับสนุนภายในคณะ
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    href="/about/staff"
                                    className="p-6 bg-white border border-slate-200 rounded-sm hover:border-scholar-accent transition-all duration-200 shadow-2xs group flex items-start gap-4"
                                >
                                    <div className="p-3 bg-slate-50 text-scholar-deep rounded-sm border border-slate-100 group-hover:bg-amber-50 group-hover:text-scholar-accent transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-scholar-accent transition-colors flex items-center gap-1.5">
                                            <span>ทำเนียบคณาจารย์และบุคลากรทั้งหมด</span>
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            ค้นหารายชื่อคณาจารย์ประจำสาขาวิชา บุคลากรสายสนับสนุน และผลงานทางวิชาการ
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-sm border border-slate-200 shadow-2xs">
                        <div className="w-16 h-16 bg-slate-50 rounded-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <UserX className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">ไม่พบข้อมูลคณะผู้บริหาร</h3>
                        <p className="text-xs text-slate-500">ยังไม่มีการบันทึกข้อมูลผู้บริหารในระบบ หรืออยู่ระหว่างการปรับปรุงข้อมูล</p>
                    </div>
                )}
            </section>
        </main>
    );
}
