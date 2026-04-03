'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import BrochureLightbox from '@/components/BrochureLightbox';
import {
    GraduationCap, BookOpen, Sparkles, FileDown,
    CalendarDays, MapPin, ChevronRight,
    PlayCircle, Download, Clock, ExternalLink
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Schedule {
    id: string;
    roundName: string;
    description?: string;
    period: string;
    channel: string;
    status: 'OPEN' | 'CLOSED' | 'UPCOMING' | 'ALWAYS';
    link?: string;
    sortOrder: number;
}

interface AdmissionDocument {
    id: string;
    title: string;
    fileUrl: string;
    sortOrder: number;
}

interface Config {
    youtubeVideoUrl?: string;
    brochureUrl?: string;
    bachelorLink?: string;
    graduateLink?: string;
    tableTitle?: string;
}

// Format stored "YYYY-MM-DD|YYYY-MM-DD" to readable Thai date
function formatPeriod(period: string): string {
    if (!period) return '-';
    if (period.includes('|')) {
        const [s, e] = period.split('|');
        const fmt = (d: string) => {
            if (!d) return '';
            return new Date(d).toLocaleDateString('th-TH', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        };
        return `${fmt(s)} – ${fmt(e)}`;
    }
    return period;
}

const StatusConfig: Record<string, { label: string; dot: string; badge: string; rowBg: string; border: boolean }> = {
    OPEN:     { label: 'กำลังเปิดรับ',     dot: 'bg-emerald-500 animate-pulse', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', rowBg: 'bg-emerald-50/30 border-l-4 border-l-scholar-accent', border: true },
    ALWAYS:   { label: 'เปิดรับตลอดปี',   dot: 'bg-sky-500',    badge: 'bg-sky-50 text-sky-700 border-sky-200',         rowBg: 'bg-sky-50/20 border-l-4 border-l-sky-400',     border: true },
    UPCOMING: { label: 'ยังไม่เปิดรับ',    dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200',   rowBg: 'hover:bg-slate-50/60',                          border: false },
    CLOSED:   { label: 'ปิดรับสมัครแล้ว', dot: 'bg-red-400',    badge: 'bg-red-50 text-red-600 border-red-200',         rowBg: 'opacity-60 hover:opacity-80',                   border: false },
};

export default function AdmissionPage() {
    const [config, setConfig] = useState<Config>({});
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [documents, setDocuments] = useState<AdmissionDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/api/admissions/config`).then(r => r.ok ? r.json() : {}),
            fetch(`${API_URL}/api/admissions/schedules`).then(r => r.ok ? r.json() : []),
            fetch(`${API_URL}/api/admissions/documents`).then(r => r.ok ? r.json() : []),
        ]).then(([cfg, sch, doc]) => {
            setConfig(cfg || {});
            setSchedules(sch || []);
            setDocuments(doc || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const videoUrl = config.youtubeVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const bachelorLink = config.bachelorLink || 'https://admission.crru.ac.th/';
    const graduateLink = config.graduateLink || 'https://orasis.crru.ac.th/gds_crru/index.php/main/home';
    const brochureUrl = config.brochureUrl || '/images/admission-brochure.png';

    return (
        <div className="bg-white min-h-screen font-sans pb-20">

            {/* ─── 1. HERO ─────────────────────────────────────────────── */}
            <div className="relative h-[420px] lg:h-[520px] w-full overflow-hidden">
                <Image
                    src="/images/admission-banner.png"
                    alt="Admission Banner"
                    fill className="object-cover scale-105"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-scholar-deep/95 via-scholar-deep/70 to-transparent" />
                {/* Floating decorative circles */}
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-scholar-accent/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-scholar-gold/10 blur-2xl" />

                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl text-white space-y-5">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-scholar-accent/90 text-white font-semibold tracking-wider text-sm shadow-lg backdrop-blur-sm">
                                <Sparkles className="w-4 h-4" />
                                ADMISSIONS 2569
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
                                เปิดรับสมัครนักศึกษาใหม่
                                <span className="block text-scholar-gold mt-2 text-3xl lg:text-4xl">
                                    ระดับปริญญาตรี และ บัณฑิตศึกษา
                                </span>
                            </h1>
                            <p className="text-lg text-white/85 font-light max-w-xl leading-relaxed">
                                ร่วมเป็นส่วนหนึ่งของครอบครัวสังคมศาสตร์ สร้างสรรค์นวัตกรรมสังคม เพื่อการเปลี่ยนแปลงที่ยั่งยืน
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link href={bachelorLink} target="_blank"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-scholar-accent text-white font-semibold shadow-lg hover:bg-scholar-accent/90 hover:scale-105 transition-all duration-200">
                                    <GraduationCap className="w-5 h-5" />
                                    สมัครเรียนปริญญาตรี
                                </Link>
                                <Link href={graduateLink} target="_blank"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/25 hover:scale-105 transition-all duration-200">
                                    <BookOpen className="w-5 h-5" />
                                    สมัครบัณฑิตศึกษา
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10">
                <Breadcrumb items={[{ label: 'ศูนย์รับสมัครนักศึกษา' }]} />

                {/* ─── 2. QUICK LINKS (3 tracks) ─────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    <Link href={bachelorLink} target="_blank"
                        className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 flex flex-col items-center text-center hover:shadow-xl hover:border-scholar-accent/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 group-hover:bg-sky-100 group-hover:scale-110 transition-all">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">ระดับปริญญาตรี</h2>
                        <p className="text-gray-500 text-sm mb-5 leading-relaxed">เปิดรับสมัครบุคคลเข้าศึกษาต่อ ระดับปริญญาตรี สำหรับ ม.6 / ปวช. หรือเทียบเท่า</p>
                        <span className="mt-auto inline-flex items-center gap-1.5 px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-medium group-hover:bg-scholar-accent transition-colors">
                            ไปที่ระบบรับสมัคร <ChevronRight className="w-4 h-4" />
                        </span>
                    </Link>

                    <Link href={graduateLink} target="_blank"
                        className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 flex flex-col items-center text-center hover:shadow-xl hover:border-scholar-accent/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">ระดับบัณฑิตศึกษา</h2>
                        <p className="text-gray-500 text-sm mb-5 leading-relaxed">ปริญญาโท และ ปริญญาเอก (ภาคปกติ / ภาคพิเศษ)</p>
                        <span className="mt-auto inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium group-hover:bg-scholar-accent transition-colors">
                            ไปที่ระบบบัณฑิต <ChevronRight className="w-4 h-4" />
                        </span>
                    </Link>

                    <Link href="/programs"
                        className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 flex flex-col items-center text-center hover:shadow-xl hover:border-scholar-accent/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-100 group-hover:scale-110 transition-all">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-scholar-deep mb-2 group-hover:text-scholar-accent transition-colors">หลักสูตรทั้งหมด</h2>
                        <p className="text-gray-500 text-sm mb-5 leading-relaxed">ดูรายละเอียดทุกหลักสูตรที่เปิดสอน พร้อมข้อมูลรายวิชา</p>
                        <span className="mt-auto inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium group-hover:bg-scholar-accent transition-colors">
                            ดูหลักสูตร <ChevronRight className="w-4 h-4" />
                        </span>
                    </Link>
                </div>

                {/* ─── 3. VIDEO + BROCHURE + DOCUMENTS ───────────────── */}
                <section className="mt-20">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">

                        {/* Left: Video */}
                        <div className="lg:w-3/5 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <PlayCircle className="w-6 h-6 text-scholar-accent" />
                                <h3 className="text-xl font-bold text-scholar-deep">แนะนำคณะสังคมศาสตร์ CRRU</h3>
                            </div>
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black ring-1 ring-black/5">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={videoUrl}
                                    title="แนะนำคณะสังคมศาสตร์"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                มารู้จัก "สังคมศาสตร์เพื่อการพัฒนา" พร้อมหลักสูตรที่ตอบโจทย์โลกอนาคต ทั้งด้านสังคม วัฒนธรรม และนวัตกรรม
                            </p>
                        </div>

                        {/* Right: Brochure + Documents */}
                        <div className="lg:w-2/5 space-y-5">
                            {/* Brochure */}
                            <div className="flex items-center gap-3">
                                <FileDown className="w-6 h-6 text-scholar-accent" />
                                <h3 className="text-xl font-bold text-scholar-deep">เอกสารประชาสัมพันธ์</h3>
                            </div>
                            <BrochureLightbox
                                src={brochureUrl}
                                alt="เอกสารประชาสัมพันธ์การรับสมัคร"
                                apiUrl={API_URL}
                            />

                            {/* Download Documents from API */}
                            {loading ? (
                                <div className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                            ) : documents.length > 0 ? (
                                <div className="bg-scholar-soft rounded-xl border border-scholar-gold/20 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-scholar-gold/20 flex items-center gap-2">
                                        <Download className="w-4 h-4 text-scholar-accent" />
                                        <span className="font-bold text-scholar-deep text-sm">ดาวน์โหลดเอกสาร</span>
                                    </div>
                                    <ul className="divide-y divide-scholar-gold/10">
                                        {documents.map(doc => (
                                            <li key={doc.id}>
                                                <a href={doc.fileUrl.startsWith('/') ? `${API_URL}${doc.fileUrl}` : doc.fileUrl}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-scholar-accent hover:bg-white/60 transition-all group/item">
                                                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                    </svg>
                                                    <span className="flex-1 leading-snug">{doc.title}</span>
                                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity text-scholar-accent" />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="bg-scholar-soft rounded-xl border border-scholar-gold/20 px-4 py-6 text-center text-sm text-gray-400">
                                    ไม่มีเอกสารดาวน์โหลดในขณะนี้
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ─── 4. SCHEDULE TABLE ──────────────────────────────── */}
                <section className="mt-20 mb-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-scholar-accent/10 text-scholar-accent text-sm font-semibold mb-3">
                            <CalendarDays className="w-4 h-4" />
                            ปฏิทินการรับสมัครนักศึกษา
                        </div>
                        <h2 className="text-3xl font-bold text-scholar-deep">
                            {config.tableTitle || 'ตารางรอบรับสมัคร ประจำปีการศึกษา 2569'}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">ข้อมูลจากระบบจัดการรับสมัคร อัปเดตเป็นปัจจุบัน</p>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : schedules.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-scholar-deep text-white">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-2xl font-semibold text-sm">รอบการรับสมัคร</th>
                                        <th className="px-6 py-4 font-semibold text-sm">
                                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />ช่วงเวลา</span>
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-sm">
                                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />ช่องทาง</span>
                                        </th>
                                        <th className="px-6 py-4 rounded-tr-2xl font-semibold text-sm">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {schedules.map(sch => {
                                        const s = StatusConfig[sch.status] || StatusConfig.UPCOMING;
                                        return (
                                            <tr key={sch.id} className={`transition-colors ${s.rowBg}`}>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-scholar-deep block">{sch.roundName}</span>
                                                    {sch.description && (
                                                        <span className="text-xs text-gray-500">{sch.description}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 text-sm">{formatPeriod(sch.period)}</td>
                                                <td className="px-6 py-4">
                                                    {sch.link ? (
                                                        <a href={sch.link} target="_blank" rel="noopener noreferrer"
                                                            className="text-scholar-accent font-medium text-sm hover:underline inline-flex items-center gap-1">
                                                            {sch.channel} <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-scholar-accent font-medium text-sm">{sch.channel}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                        {s.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Fallback placeholder (static) when no data
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">ยังไม่มีข้อมูลปฏิทินรับสมัคร</p>
                            <p className="text-gray-400 text-sm mt-1">ติดตามได้ที่ช่องทาง Facebook คณะสังคมศาสตร์</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
