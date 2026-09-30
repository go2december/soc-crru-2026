'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    GraduationCap,
    Briefcase,
    Award,
    Crown,
    UserCircle2,
    Lightbulb,
    Globe,
    Fingerprint,
    BookOpen,
    ExternalLink,
    Building2,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    FlaskConical
} from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import {
    getFullName,
    getFullNameEn,
    getGoogleScholarLink,
    getOrcidLink,
    getScopusLink,
} from '@/lib/staff';

interface LinkedResearchProject {
    id: string;
    slug: string;
    titleTh: string;
    titleEn: string | null;
    year: number;
    status: 'ONGOING' | 'COMPLETED' | 'PUBLISHED' | 'CANCELLED';
    fundingSource: string | null;
    isSocialService: boolean;
    isCommercial: boolean;
    coverImageUrl: string | null;
    role: 'HEAD' | 'CO_RESEARCHER' | 'ADVISOR' | 'ASSISTANT' | 'EXTERNAL_EXPERT';
    positionTitle: string | null;
}

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
    googleScholarUrl: string | null;
    orcidId: string | null;
    scopusAuthorId: string | null;
    department: string | null;
    departmentEn: string | null;
    isExecutive: boolean;
    researchProjects?: LinkedResearchProject[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

const getRoleBadge = (role: LinkedResearchProject['role']) => {
    switch (role) {
        case 'HEAD':
            return { text: 'หัวหน้าโครงการ (PI)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
        case 'CO_RESEARCHER':
            return { text: 'ผู้ร่วมวิจัย (Co-PI)', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
        case 'ADVISOR':
            return { text: 'ที่ปรึกษาโครงการ', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
        default:
            return { text: 'คณะผู้วิจัย', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
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
            <div className="min-h-screen bg-slate-50 flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-scholar-deep"></span>
                    <p className="text-xs text-slate-500 font-medium">กำลังโหลดข้อมูลบุคลากร...</p>
                </div>
            </div>
        );
    }

    if (error || !staff) {
        return (
            <div className="min-h-screen bg-slate-50 py-20 px-4">
                <div className="max-w-md mx-auto text-center bg-white p-8 rounded-sm shadow-sm border border-slate-200">
                    <UserCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{error || 'ไม่พบข้อมูลบุคลากร'}</h2>
                    <p className="text-slate-500 text-sm mb-6">อาจมีการเปลี่ยนแปลงหรือลบข้อมูลนี้ออกจากระบบแล้ว</p>
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 bg-scholar-deep text-white text-sm font-medium rounded-sm hover:bg-slate-800 transition-colors"
                    >
                        กลับหน้าทำเนียบบุคลากร
                    </button>
                </div>
            </div>
        );
    }

    const hasScholar = Boolean(staff.googleScholarUrl);
    const hasOrcid = Boolean(staff.orcidId);
    const hasScopus = Boolean(staff.scopusAuthorId);
    const hasAnyResearcherId = hasScholar || hasOrcid || hasScopus;

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": getFullName(staff),
        "alternateName": getFullNameEn(staff) || undefined,
        "url": `https://soc.crru.ac.th/about/staff/${staff.id}`,
        "jobTitle": staff.adminPosition || staff.academicPosition || 'อาจารย์ประจำคณะสังคมศาสตร์',
        "worksFor": {
            "@type": "EducationalOrganization",
            "name": "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
            "alternateName": "Faculty of Social Sciences, Chiang Rai Rajabhat University",
            "url": "https://soc.crru.ac.th",
            "parentOrganization": {
                "@type": "CollegeOrUniversity",
                "name": "มหาวิทยาลัยราชภัฏเชียงราย (Chiang Rai Rajabhat University)",
                "url": "https://crru.ac.th"
            }
        },
        "email": staff.contactEmail || undefined,
        "image": staff.imageUrl ? `https://soc.crru.ac.th${getImageUrl(staff.imageUrl)}` : undefined,
        "knowsAbout": staff.expertise && staff.expertise.length > 0 ? staff.expertise : undefined,
        "sameAs": [
            hasScholar ? getGoogleScholarLink(staff.googleScholarUrl) : null,
            hasOrcid ? getOrcidLink(staff.orcidId) : null,
            hasScopus ? getScopusLink(staff.scopusAuthorId) : null,
        ].filter(Boolean),
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-20 font-sans">
            <JsonLd data={personSchema} />

            {/* Header / Institutional Affiliation Breadcrumb */}
            <section className="bg-scholar-deep text-white pt-8 pb-20 px-4 border-b border-slate-800 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors group font-medium"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            กลับหน้าทำเนียบบุคลากร
                        </button>
                        <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-sm border border-slate-700/60">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>มหาวิทยาลัยราชภัฏเชียงราย | Chiang Rai Rajabhat University</span>
                        </div>
                    </div>

                    <div className="max-w-2xl">
                        <span className="inline-block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            ทำเนียบอาจารย์และนักวิจัย • Faculty & Researcher Profile
                        </span>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            {getFullName(staff)}
                        </h1>
                        {getFullNameEn(staff) && (
                            <p className="text-slate-300 text-sm font-light mt-0.5">
                                {getFullNameEn(staff)}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-sm shadow-xs border border-slate-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">

                        {/* Left Side: Photo, Badges & Contact */}
                        <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-50/70 p-6 md:p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200">
                            <div className="aspect-[3/4] w-full max-w-[220px] bg-white relative overflow-hidden rounded-sm shadow-2xs border border-slate-300 mb-5">
                                {staff.imageUrl ? (
                                    <Image
                                        src={getImageUrl(staff.imageUrl)}
                                        alt={getFullName(staff)}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 220px"
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                                        <UserCircle2 className="w-20 h-20 text-slate-400" strokeWidth={1} />
                                        <span className="text-[11px] text-slate-400 mt-2">ไม่มีรูปภาพ</span>
                                    </div>
                                )}
                            </div>

                            {/* Affiliation & Department Badge */}
                            <div className="w-full mb-6 text-center space-y-1.5">
                                <span className="inline-block px-2.5 py-1 bg-slate-200/80 text-slate-800 text-[11px] font-bold rounded-sm border border-slate-300 uppercase tracking-wider">
                                    {staff.staffType === 'ACADEMIC' ? 'สายวิชาการ (Academic)' : 'สายสนับสนุน (Support)'}
                                </span>
                                <p className="text-xs font-semibold text-slate-700 leading-tight">
                                    {staff.department || 'คณะสังคมศาสตร์'}
                                </p>
                                {staff.departmentEn && (
                                    <p className="text-[11px] text-slate-500 font-normal">
                                        {staff.departmentEn}
                                    </p>
                                )}
                            </div>

                            {/* Contact Box */}
                            <div className="w-full space-y-3 pt-4 border-t border-slate-200">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    ข้อมูลการติดต่อ (Contact)
                                </h4>
                                {staff.contactEmail ? (
                                    <a
                                        href={`mailto:${staff.contactEmail}`}
                                        className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-sm text-slate-700 hover:text-slate-950 hover:border-slate-400 transition-colors text-xs font-medium break-all shadow-2xs group"
                                    >
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-500 group-hover:text-slate-900" />
                                        <span>{staff.contactEmail}</span>
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-400 italic bg-white border border-dashed border-slate-200 p-2.5 rounded-sm text-center">
                                        ไม่มีข้อมูลอีเมล
                                    </p>
                                )}
                                <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-100/80 p-2 rounded-sm border border-slate-200">
                                    <span className="font-semibold text-slate-700 block mb-0.5">สังกัดทางการ:</span>
                                    คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details, Researcher Hub, Projects & Bio */}
                        <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-8 lg:p-10">

                            {/* Name and Titles */}
                            <div className="border-b border-slate-200 pb-6 mb-6">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                                    {getFullName(staff)}
                                </h2>
                                {getFullNameEn(staff) && (
                                    <h3 className="text-lg md:text-xl font-medium text-slate-500 mt-1">
                                        {getFullNameEn(staff)}
                                    </h3>
                                )}

                                <div className="flex flex-wrap gap-4 mt-4">
                                    {staff.academicPosition && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-800">
                                            <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                                            <span>ตำแหน่งทางวิชาการ: {staff.academicPosition}</span>
                                        </div>
                                    )}
                                    {staff.adminPosition && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-sm text-xs font-semibold text-amber-900">
                                            <Crown className="w-3.5 h-3.5 text-amber-600" />
                                            <span>ตำแหน่งบริหาร: {staff.adminPosition}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Webometrics Researcher Profiles Hub */}
                            <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-white border border-slate-200 rounded-sm text-slate-700">
                                            <BookOpen className="w-4 h-4 text-scholar-deep" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                                ฐานข้อมูลนักวิจัยและผลงานวิชาการ (Webometrics Profiles)
                                            </h3>
                                            <p className="text-[11px] text-slate-500">
                                                สังกัดมาตรฐานสากล: <span className="font-semibold text-slate-700">Chiang Rai Rajabhat University</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-sm">
                                        Webometrics Openness
                                    </span>
                                </div>

                                {/* Academic IDs Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                    {/* Google Scholar */}
                                    <div className={`p-3.5 bg-white border rounded-sm flex flex-col justify-between transition-colors ${hasScholar
                                        ? 'border-blue-200 hover:border-blue-400'
                                        : 'border-slate-200 bg-slate-50/50'
                                        }`}>
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-blue-600" /> Google Scholar
                                                </span>
                                                {hasScholar ? (
                                                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-100 font-medium">
                                                        เชื่อมต่อแล้ว
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                                        ยังไม่ระบุ
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 leading-snug">
                                                ดัชนีการอ้างอิงและบทความวิจัย
                                            </p>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-slate-100">
                                            {hasScholar ? (
                                                <a
                                                    href={getGoogleScholarLink(staff.googleScholarUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <span>ดูโปรไฟล์และงานวิจัย</span>
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">
                                                    รอการเชื่อมต่อโปรไฟล์
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* ORCID */}
                                    <div className={`p-3.5 bg-white border rounded-sm flex flex-col justify-between transition-colors ${hasOrcid
                                        ? 'border-emerald-200 hover:border-emerald-400'
                                        : 'border-slate-200 bg-slate-50/50'
                                        }`}>
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                                    <Fingerprint className="w-3.5 h-3.5 text-emerald-600" /> ORCID iD
                                                </span>
                                                {hasOrcid ? (
                                                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100 font-medium">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                                        ยังไม่ระบุ
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-mono text-slate-600 truncate">
                                                {hasOrcid ? staff.orcidId?.replace(/^https?:\/\/orcid\.org\//, '') : 'รหัสนักวิจัยสากล 16 หลัก'}
                                            </p>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-slate-100">
                                            {hasOrcid ? (
                                                <a
                                                    href={getOrcidLink(staff.orcidId)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                                                >
                                                    <span>ตรวจสอบสิทธิ์ ORCID</span>
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">
                                                    รอการเชื่อมต่อ ORCID
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Scopus Author ID */}
                                    <div className={`p-3.5 bg-white border rounded-sm flex flex-col justify-between transition-colors ${hasScopus
                                        ? 'border-amber-200 hover:border-amber-400'
                                        : 'border-slate-200 bg-slate-50/50'
                                        }`}>
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Scopus ID
                                                </span>
                                                {hasScopus ? (
                                                    <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 font-medium">
                                                        Scopus
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                                        ยังไม่ระบุ
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-mono text-slate-600 truncate">
                                                {hasScopus ? `ID: ${staff.scopusAuthorId?.replace(/^https?:\/\/www\.scopus\.com\/authid\/detail\.uri\?authorId=/, '')}` : 'ฐานข้อมูลวิชาการ Scopus'}
                                            </p>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-slate-100">
                                            {hasScopus ? (
                                                <a
                                                    href={getScopusLink(staff.scopusAuthorId)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                                                >
                                                    <span>ดูข้อมูลใน Scopus</span>
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">
                                                    รอการเชื่อมต่อ Scopus
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {!hasAnyResearcherId && staff.staffType === 'ACADEMIC' && (
                                    <p className="text-[11px] text-slate-500 bg-amber-50/80 border border-amber-200 p-2.5 rounded-sm mt-3 flex items-center gap-2">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                        <span>
                                            อยู่ระหว่างการเชื่อมต่อฐานข้อมูล Google Scholar และ ORCID สังกัด Chiang Rai Rajabhat University ตามเกณฑ์ Webometrics
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Linked Research Projects Section */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <FlaskConical className="w-4 h-4 text-scholar-deep" />
                                        โครงการวิจัยและผลงานวิชาการที่เชื่อมโยง
                                    </h3>
                                    <Link
                                        href="/research/database"
                                        className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 transition-colors"
                                    >
                                        ดูคลังวิจัยคณะ <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                {staff.researchProjects && staff.researchProjects.length > 0 ? (
                                    <div className="space-y-3">
                                        {staff.researchProjects.map((proj) => {
                                            const roleBadge = getRoleBadge(proj.role);
                                            return (
                                                <div
                                                    key={proj.id}
                                                    className="p-4 bg-white border border-slate-200 rounded-sm hover:border-slate-400 transition-all shadow-2xs"
                                                >
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border uppercase ${roleBadge.bg}`}>
                                                            {roleBadge.text}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
                                                            ปีงบประมาณ {proj.year}
                                                        </span>
                                                        {proj.fundingSource && (
                                                            <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200">
                                                                ทุน: {proj.fundingSource}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Link
                                                        href={`/research/projects/${proj.slug}`}
                                                        className="group block"
                                                    >
                                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-scholar-accent transition-colors leading-snug">
                                                            {proj.titleTh}
                                                        </h4>
                                                        {proj.titleEn && (
                                                            <p className="text-xs text-slate-500 mt-1 font-normal line-clamp-1">
                                                                {proj.titleEn}
                                                            </p>
                                                        )}
                                                    </Link>

                                                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                                        <span className="text-[11px] text-slate-500">
                                                            สถานะ: {proj.status === 'COMPLETED' ? 'เสร็จสิ้นโครงการ' : 'กำลังดำเนินการ'}
                                                        </span>
                                                        <Link
                                                            href={`/research/projects/${proj.slug}`}
                                                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 group"
                                                        >
                                                            รายละเอียดโครงการ
                                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-sm text-center">
                                        <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-slate-600 mb-1">
                                            ยังไม่มีโครงการวิจัยที่เชื่อมโยงในระบบฐานข้อมูล
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            ข้อมูลจะแสดงอัตโนมัติเมื่อโครงการวิจัยที่อาจารย์มีส่วนร่วมได้รับการอนุมัติและเผยแพร่
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Education & Expertise Grid */}
                            <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-200">

                                {/* Education */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-scholar-deep" />
                                        ประวัติการศึกษา (Education)
                                    </h3>

                                    {staff.education && staff.education.length > 0 ? (
                                        <ul className="space-y-3">
                                            {staff.education.map((edu, idx) => (
                                                <li key={idx} className="p-3 bg-white border border-slate-200 rounded-sm">
                                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-sm mb-1.5">
                                                        {edu.level === 'DOCTORAL' ? 'ปริญญาเอก' : edu.level === 'MASTER' ? 'ปริญญาโท' : 'ปริญญาตรี'}
                                                    </span>
                                                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{edu.detail}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-sm border border-dashed border-slate-200 text-center">
                                            ไม่มีข้อมูลประวัติการศึกษา
                                        </p>
                                    )}
                                </div>

                                {/* Expertise & Short Bio */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-scholar-deep" />
                                        ความเชี่ยวชาญ (Areas of Expertise)
                                    </h3>

                                    {staff.expertise && staff.expertise.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {staff.expertise.map((exp, idx) => {
                                                if (!exp.trim()) return null;
                                                return (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-sm border border-slate-200"
                                                    >
                                                        {exp}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-sm border border-dashed border-slate-200 text-center mb-6">
                                            ไม่มีข้อมูลความเชี่ยวชาญ
                                        </p>
                                    )}

                                    {/* Short Bio */}
                                    {staff.shortBios && staff.shortBios.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                                                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                                ประวัติโดยสังเขป
                                            </h4>
                                            <div className="p-3.5 bg-slate-50 border-l-2 border-slate-800 rounded-r-sm text-xs text-slate-700 space-y-2">
                                                {staff.shortBios.map((bio, idx) => (
                                                    <p key={idx} className="leading-relaxed">
                                                        {bio}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
