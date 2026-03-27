import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ProgramGalleryClient from '@/components/ProgramGalleryClient';
import type { ProgramInstructor } from '@/lib/api';
import { formatStaffName } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ---- Helper: Parse YouTube ID from various URL formats ----
function getYouTubeId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
        /youtube\.com\/shorts\/([^&\s?]+)/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

export interface ProgramData {
    id: string;
    title: string;
    degree: string;
    image: string;
    description: string;
    highlights: {
        title: string;
        description: string;
        icon?: React.ReactNode;
    }[];
    careers: string[];
    structure: {
        totalCredits: number;
        general: number;
        major: number;
        freeElective: number;
    };
    downloadLink?: string;
    level?: string;
    concentrations?: { title: string; description: string }[];
    // PR Media
    galleryImages?: string[];
    attachments?: { originalName: string; fileUrl: string; size?: number; mimeType?: string }[];
    youtubeVideoUrl?: string;
    facebookVideoUrl?: string;
    // Instructors
    instructors?: ProgramInstructor[];
}

interface ProgramTemplateProps {
    data: ProgramData;
}

export default function ProgramTemplate({ data }: ProgramTemplateProps) {
    const youtubeId = getYouTubeId(data.youtubeVideoUrl || '');
    const hasFacebookPage = !!data.facebookVideoUrl;
    const hasGallery = (data.galleryImages ?? []).length > 0;
    const hasAttachments = (data.attachments ?? []).length > 0;
    const hasInstructors = (data.instructors ?? []).length > 0;
    const chair = (data.instructors ?? []).find(i => i.role === 'CHAIR');
    const members = (data.instructors ?? []).filter(i => i.role === 'MEMBER');
    const hasPRMedia = youtubeId || hasFacebookPage || hasGallery || hasAttachments;

    const fullGalleryUrls = (data.galleryImages ?? []).map(img =>
        img.startsWith('/') ? `${API_URL}${img}` : img
    );
    const fullAttachments = (data.attachments ?? []).map(att => ({
        ...att,
        fileUrl: att.fileUrl.startsWith('/') ? `${API_URL}${att.fileUrl}` : att.fileUrl
    }));

    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Hero */}
            <header className="relative h-[400px] flex items-center justify-center bg-scholar-deep overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                    <Image src={data.image} alt={data.title} fill className="object-cover" priority />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-scholar-deep via-scholar-deep/60 to-transparent" />
                <div className="relative z-10 container mx-auto px-4 text-center lg:text-left pt-16">
                    <span className="inline-block px-3 py-1 rounded-full bg-scholar-accent text-white text-sm font-semibold mb-4 tracking-wider">
                        {data.level || "ปริญญาตรี (Bachelor's Degree)"}
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                        {data.title}
                    </h1>
                    <p className="text-xl lg:text-2xl text-scholar-gold font-light tracking-wide mb-8">
                        {data.degree}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <a
                            href={data.level?.includes('โท') || data.level?.includes('เอก')
                                ? "https://orasis.crru.ac.th/gds_crru/index.php/main/home"
                                : "https://admission.crru.ac.th/"}
                            target="_blank" rel="noopener noreferrer"
                            className="btn btn-primary text-white bg-gradient-to-r from-scholar-accent to-[#D9341C] border-none px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            สมัครเรียนทันที
                        </a>
                        {data.downloadLink && (
                            <a href={data.downloadLink.startsWith('/') ? `${API_URL}${data.downloadLink}` : data.downloadLink}
                                target="_blank" rel="noopener noreferrer"
                                className="btn btn-outline text-white hover:bg-white hover:text-scholar-deep px-8 rounded-full"
                            >
                                ดาวน์โหลดหลักสูตร (PDF)
                            </a>
                        )}
                        {hasFacebookPage && (
                            <a href={data.facebookVideoUrl} target="_blank" rel="noopener noreferrer"
                                className="btn btn-outline text-white border-[#1877F2]/60 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white px-8 rounded-full gap-2 transition-all"
                            >
                                {/* Facebook SVG Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook หลักสูตร
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={[
                    { label: 'หลักสูตร', href: '/programs' },
                    {
                        label: data.level?.includes('เอก') ? 'หลักสูตรปริญญาเอก'
                            : data.level?.includes('โท') ? 'หลักสูตรปริญญาโท'
                                : 'หลักสูตรปริญญาตรี',
                        href: data.level?.includes('เอก') ? '/programs?level=doctoral'
                            : data.level?.includes('โท') ? '/programs?level=master'
                                : '/programs?level=bachelor'
                    },
                    { label: data.title }
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">

                    {/* ===== LEFT COLUMN ===== */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-scholar-deep mb-4 border-l-4 border-scholar-accent pl-3">เกี่ยวกับสาขาวิชา</h2>
                            <p className="text-lg text-gray-600 leading-relaxed indent-8">{data.description}</p>
                        </section>

                        {/* YouTube Video Embed */}
                        {youtubeId && (
                            <section>
                                <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3 flex items-center gap-3">
                                    <svg className="w-7 h-7 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    แนะนำหลักสูตร (วิดีโอ)
                                </h2>
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                                        title="วิดีโอแนะนำหลักสูตร"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                            </section>
                        )}

                        {/* Concentrations */}
                        {data.concentrations && data.concentrations.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3">แขนงวิชา / วิชาเอก</h2>
                                <div className="space-y-6">
                                    {data.concentrations.map((item, index) => (
                                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-scholar-gold/30 transition-all">
                                            <h3 className="font-bold text-xl text-scholar-deep mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-scholar-accent" />
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 pl-4 border-l border-gray-200 ml-1">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Highlights */}
                        {data.highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3">จุดเด่นของหลักสูตร</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.highlights.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-start bg-white border border-gray-100 p-5 rounded-xl hover:shadow-md hover:border-scholar-accent/30 transition-all">
                                            <div className="w-12 h-12 bg-scholar-soft rounded-xl flex items-center justify-center text-scholar-accent shrink-0 shadow-sm">
                                                {item.icon || (
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-scholar-deep mb-1">{item.title}</h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Career Paths */}
                        {data.careers.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-scholar-deep mb-6 border-l-4 border-scholar-accent pl-3">เส้นทางอาชีพในอนาคต</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {data.careers.map((career, index) => (
                                        <li key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-scholar-gold transition-colors">
                                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-gray-700 font-medium">{career}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}



                    </div>

                    {/* ===== RIGHT COLUMN (Sidebar) ===== */}
                    <div className="space-y-8">

                        {/* Structure Box */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-scholar-deep">
                            <h3 className="text-xl font-bold text-scholar-deep mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                โครงสร้างหลักสูตร
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">หมวดวิชาศึกษาทั่วไป</span>
                                    <span className="font-bold text-scholar-deep">{data.structure.general} นก.</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">หมวดวิชาเฉพาะ</span>
                                    <span className="font-bold text-scholar-deep">{data.structure.major} นก.</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">หมวดวิชาเลือกเสรี</span>
                                    <span className="font-bold text-scholar-deep">{data.structure.freeElective} นก.</span>
                                </div>
                                <div className="pt-2 flex justify-between items-center bg-scholar-soft -mx-6 px-6 py-4 mt-4 rounded-b-lg">
                                    <span className="font-bold text-scholar-deep">รวมตลอดหลักสูตร</span>
                                    <span className="text-xl font-bold text-scholar-accent">{data.structure.totalCredits} นก.</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Documents */}
                        {hasAttachments && (
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="text-base font-bold text-scholar-deep mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    เอกสารประชาสัมพันธ์
                                </h3>
                                <div className="space-y-3">
                                    {fullAttachments.slice(0, 5).map((file, i) => (
                                        <a
                                            key={i}
                                            href={file.fileUrl}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-scholar-accent transition-colors py-2 border-b border-gray-50 last:border-0 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg shrink-0 bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span className="truncate flex-1 font-medium">{file.originalName}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Facebook Fanpage Widget */}
                        {hasFacebookPage && (
                            <a
                                href={data.facebookVideoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-5 rounded-2xl shadow-lg border border-[#1877F2]/20 bg-gradient-to-br from-[#1877F2]/5 to-[#1877F2]/10 hover:from-[#1877F2]/15 hover:to-[#1877F2]/20 transition-all group"
                            >
                                <div className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1877F2] leading-tight">Facebook Page</p>
                                    <p className="text-sm text-gray-500 mt-0.5">ติดตามข่าวสารหลักสูตร</p>
                                </div>
                                <svg className="w-5 h-5 text-[#1877F2]/50 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}

                        {/* 4. Gallery Box */}
                        {hasGallery && (
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="text-base font-bold text-scholar-deep mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-scholar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    ประมวลภาพกิจกรรม
                                </h3>
                                {/* Using the existing client component inside the sidebar */}
                                <ProgramGalleryClient galleryImages={fullGalleryUrls} />
                            </div>
                        )}

                        {/* 5. Minimal Contact Box */}
                        <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl text-center">
                            <h3 className="text-lg font-bold text-scholar-deep mb-2">สอบถามข้อมูลเพิ่มเติม</h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">สงสัยเกี่ยวกับหลักสูตร หรือการรับสมัคร?<br />ทักสอบถามเจ้าหน้าที่ได้เลย</p>
                            <Link href="/contact" className="inline-block w-full px-6 py-3 bg-white border-2 border-scholar-deep text-scholar-deep font-bold text-sm rounded-full hover:bg-scholar-deep hover:text-white transition-all shadow-sm">
                                ติดต่อเรา
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Instructors Section — bottom of content full width */}
                {hasInstructors && (
                    <section className="mt-16 pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-scholar-deep mb-8 border-l-4 border-scholar-accent pl-3">
                            อาจารย์ประจำหลักสูตร
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {chair && <InstructorCard inst={chair} apiUrl={API_URL} />}
                            {members.map((inst) => (
                                <InstructorCard key={inst.id} inst={inst} apiUrl={API_URL} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Bottom CTA */}
            <section className="py-20 bg-scholar-soft mt-12 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-scholar-deep mb-4">พร้อมที่จะเป็นส่วนหนึ่งของครอบครัวเราหรือยัง?</h2>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto">{data.title}</p>
                    <a href="https://admission.crru.ac.th/" target="_blank" rel="noopener noreferrer"
                        className="btn btn-lg btn-primary text-white bg-scholar-accent border-none px-12 rounded-full shadow-xl hover:scale-105"
                    >
                        สมัครเรียน
                    </a>
                </div>
            </section>
        </div>
    );
}

// ---- InstructorCard Sub-Component ----
function InstructorCard({ inst, apiUrl }: { inst: ProgramInstructor; apiUrl: string }) {
    const isChair = inst.role === 'CHAIR';
    const displayName = formatStaffName(inst);
    const imageUrl = inst.imageUrl
        ? (inst.imageUrl.startsWith('/') ? `${apiUrl}${inst.imageUrl}` : inst.imageUrl)
        : null;

    return (
        <Link
            href={`/about/staff/${inst.staffId}`}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border shadow-sm transition-all hover:shadow-lg hover:border-scholar-accent/30 hover:-translate-y-1 group ${isChair ? 'border-scholar-gold/50 bg-amber-50/60' : 'border-gray-100 bg-white'}`}
        >
            {/* Photo */}
            <div className="relative w-20 h-20 mb-3">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={displayName}
                        fill
                        unoptimized
                        className="object-cover rounded-full ring-2 ring-white shadow-md group-hover:ring-scholar-accent/20 transition-all"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-scholar-deep to-scholar-accent flex items-center justify-center ring-2 ring-white shadow-md group-hover:ring-scholar-accent/20 transition-all">
                        <span className="text-white font-bold text-2xl">
                            {inst.firstNameTh?.charAt(0) || '?'}
                        </span>
                    </div>
                )}
                {/* Chair Crown badge */}
                {isChair && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm" title="ประธานหลักสูตร">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16L3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm2 3h10v2H7v-2z" />
                        </svg>
                    </div>
                )}
            </div>
            {/* Name and Titles */}
            <p className="mt-1 font-bold text-scholar-deep text-sm leading-tight group-hover:text-scholar-accent transition-colors">
                {displayName}
            </p>
            {/* Role badge */}
            <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${isChair ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-200' : 'bg-scholar-soft text-scholar-deep/70 group-hover:bg-scholar-accent/10 group-hover:text-scholar-accent'}`}>
                {isChair ? 'ประธานหลักสูตร' : 'อาจารย์ประจำหลักสูตร'}
            </span>
        </Link>
    );
}
