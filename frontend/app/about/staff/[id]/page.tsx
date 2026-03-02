'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Mail, GraduationCap, Briefcase, Award, Crown, UserCircle2, Bookmark, Lightbulb } from 'lucide-react';

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
    shortBios: string[] | null;
    imageUrl: string | null;
    contactEmail: string | null;
    department: string | null;
    isExecutive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const getImageUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://localhost') || url.startsWith('http://soc_backend')) {
        try { return new URL(url).pathname; } catch { return url; }
    }
    if (API_URL && url.startsWith(API_URL)) {
        return url.replace(API_URL, '');
    }
    return url;
};

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

const getFullNameEn = (staff: Staff): string => {
    if (!staff.firstNameEn && !staff.lastNameEn) return '';
    const prefix = staff.prefixEn ? `${staff.prefixEn} ` : '';
    return `${prefix}${staff.firstNameEn || ''} ${staff.lastNameEn || ''}`.trim();
};

export default function StaffProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchStaffProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/staff/${id}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error('ไม่พบข้อมูลบุคลากร');
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data: Staff = await res.json();
                setStaff(data);
            } catch (err: any) {
                console.error('Error fetching staff profile:', err);
                setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
            } finally {
                setLoading(false);
            }
        };

        fetchStaffProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-scholar-deep"></span>
            </div>
        );
    }

    if (error || !staff) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 px-4">
                <div className="max-w-xl mx-auto text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                    <UserCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || 'ไม่พบข้อมูลบุคลากร'}</h2>
                    <p className="text-gray-500 mb-8">อาจมีการเปลี่ยนแปลงหรือลบข้อมูลนี้ออกจากระบบแล้ว</p>
                    <button onClick={() => router.back()} className="px-6 py-2.5 bg-scholar-deep text-white font-medium rounded-xl hover:bg-opacity-90 transition-all">
                        กลับหน้าทำเนียบบุคลากร
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header Area that is shorter than hero */}
            <section className="bg-scholar-deep text-white pt-20 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>

                <div className="relative z-10 container mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> กลับหน้าทำเนียบบุคลากร
                    </button>

                    {/* Minimalist Intro */}
                    <div className="mt-4">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">ข้อมูลบุคลากร</h1>
                        <p className="text-blue-100/70 text-sm md:text-base">คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Main Profile Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100/80 overflow-hidden mb-8">
                    <div className="flex flex-col md:flex-row">

                        {/* Left Side: Photo & Quick Contact */}
                        <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50/50 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
                            <figure className="aspect-[3/4] w-full max-w-[240px] bg-white relative overflow-hidden flex-shrink-0 rounded-2xl shadow-md border border-gray-200/60 mb-6">
                                {staff.imageUrl ? (
                                    <Image
                                        src={getImageUrl(staff.imageUrl)}
                                        alt={getFullName(staff)}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 240px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                                        <UserCircle2 className="w-24 h-24 mb-2 text-gray-300" strokeWidth={1} />
                                    </div>
                                )}
                            </figure>

                            <div className="w-full mt-auto pt-4 md:pt-0">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">ช่องทางการติดต่อ</h4>
                                {staff.contactEmail ? (
                                    <a href={`mailto:${staff.contactEmail}`} className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-scholar-accent hover:border-scholar-accent/30 transition-colors shadow-sm w-full text-[13px] font-medium break-all">
                                        <Mail className="w-4 h-4 flex-shrink-0" /> {staff.contactEmail}
                                    </a>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center bg-white border border-gray-100 p-3 rounded-xl italic">
                                        ไม่มีข้อมูลอีเมลติดต่อ
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Details */}
                        <div className="w-full md:w-2/3 lg:w-3/4 p-8 md:p-10 lg:p-12">
                            <div className="mb-6">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border mb-4 ${staff.staffType === 'ACADEMIC'
                                    ? 'bg-blue-50/50 text-blue-700 border-blue-100'
                                    : 'bg-teal-50/50 text-teal-700 border-teal-100'
                                    }`}>
                                    {staff.department || 'ไม่ระบุสังกัด'}
                                </span>

                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                                    {getFullName(staff)}
                                </h2>

                                {getFullNameEn(staff) && (
                                    <h3 className="text-xl md:text-2xl font-medium text-gray-400 mb-6 font-serif">
                                        {getFullNameEn(staff)}
                                    </h3>
                                )}

                                <div className="space-y-4 mt-8">
                                    {staff.adminPosition && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mt-0.5 flex-shrink-0 border border-amber-100">
                                                <Crown className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">ตำแหน่งบริหาร</p>
                                                <p className="text-lg font-bold text-scholar-accent leading-snug">{staff.adminPosition}</p>
                                            </div>
                                        </div>
                                    )}

                                    {staff.academicPosition && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mt-0.5 flex-shrink-0 border border-blue-100">
                                                <Briefcase className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">ตำแหน่งทางวิชาการ</p>
                                                <p className="text-base font-medium text-gray-800 leading-snug">{staff.academicPosition}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-100 my-8" />

                            <div className="grid md:grid-cols-2 gap-10">
                                {/* Education */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                            <GraduationCap className="w-4 h-4 text-scholar-deep" />
                                        </div>
                                        ประวัติการศึกษา
                                    </h3>

                                    {staff.education && staff.education.length > 0 ? (
                                        <ul className="space-y-4">
                                            {staff.education.map((edu, idx) => (
                                                <li key={idx} className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-scholar-accent before:rounded-full">
                                                    <p className="text-[13px] font-bold text-gray-800 mb-0.5 border-b border-gray-100 pb-1 inline-block">
                                                        {edu.level === 'DOCTORAL' ? 'ปริญญาเอก' : edu.level === 'MASTER' ? 'ปริญญาโท' : 'ปริญญาตรี'}
                                                    </p>
                                                    <p className="text-sm text-gray-600 leading-relaxed mt-1">{edu.detail}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 text-center">ไม่มีข้อมูลประวัติการศึกษา</p>
                                    )}
                                </div>

                                {/* Expertise & Short Bio */}
                                <div>
                                    {staff.shortBios && staff.shortBios.length > 0 && (
                                        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-scholar-accent to-scholar-deep"></div>
                                            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4 flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-scholar-accent" />
                                                ประวัติโดยสังเขป
                                            </h3>
                                            <ul className="space-y-4">
                                                {staff.shortBios.map((bio, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700 leading-relaxed font-medium">
                                                        {bio}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                            <Award className="w-4 h-4 text-scholar-deep" />
                                        </div>
                                        ความเชี่ยวชาญ
                                    </h3>

                                    {staff.expertise && staff.expertise.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {staff.expertise.map((exp, idx) => {
                                                if (!exp.trim()) return null;
                                                return (
                                                    <span key={idx} className="px-4 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-xl border border-indigo-100 transition-colors">
                                                        {exp}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 text-center">ไม่มีข้อมูลความเชี่ยวชาญ</p>
                                    )}
                                </div>
                            </div>

                            {/* Further Details Placeholder (For Future features like Research Papers) */}
                            {staff.staffType === 'ACADEMIC' && (
                                <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 border-dashed text-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                                        <Bookmark className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">ผลงานทางวิชาการและงานวิจัยจะเปิดให้ใช้งานในเร็วๆ นี้</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
