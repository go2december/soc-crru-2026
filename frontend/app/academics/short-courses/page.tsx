"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { 
    ExternalLink, 
    Award, 
    Clock, 
    UserCheck, 
    Search, 
    Loader2,
    HelpCircle,
    GraduationCap,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Sparkles
} from 'lucide-react';

interface Course {
    id: string | number;
    code?: string | null;
    title: string;
    durationHours: number;
    creditBankValue: number;
    price: number | string;
    isCreditBank: boolean;
    status: 'OPEN' | 'COMING_SOON' | 'CLOSED';
    coverImageUrl?: string | null;
    category?: string | null;
    instructorName?: string | null;
    description?: string | null;
    lifelongUrl?: string | null;
}

// Fallback initial courses if backend is connecting
const fallbackCourses: Course[] = [
    {
        id: 'fallback-1',
        code: 'LL6506004',
        title: 'ตุงและโคมประดิษฐ์',
        durationHours: 6,
        creditBankValue: 1,
        price: 0,
        isCreditBank: true,
        status: 'OPEN',
        coverImageUrl: 'https://lifelong.crru.ac.th/upload-assets/images/course/GJvgMnqsxNFVkQiSCEyup9zI5TXe8c.webp',
        category: 'ศิลปวัฒนธรรมและภูมิปัญญาท้องถิ่น',
        instructorName: 'ผู้ช่วยศาสตราจารย์ ดร.ณรงค์ เจนใจ',
        description: 'เรียนรู้แนวคิด ลักษณะ ความสำคัญ ประเภท และการใช้งานตามคติความเชื่อของตุงและโคมล้านนา รวมถึงการฝึกปฏิบัติการประดิษฐ์ตุงและโคมล้านนาในรูปแบบต่างๆ',
        lifelongUrl: 'https://lifelong.crru.ac.th/course/detail/%E0%B8%95%E0%B8%B8%E0%B8%87%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%82%E0%B8%84%E0%B8%A1%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B4%E0%B8%A9%E0%B8%90%E0%B9%8C'
    },
    {
        id: 'fallback-2',
        title: "การเป็นผู้นำและการบริหารทีมงานยุคใหม่",
        durationHours: 15,
        creditBankValue: 1,
        price: 1500,
        isCreditBank: true,
        status: 'OPEN',
        coverImageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        category: "การบริหารจัดการ",
        instructorName: "คณาจารย์คณะสังคมศาสตร์",
        lifelongUrl: "https://lifelong.crru.ac.th/course"
    },
    {
        id: 'fallback-3',
        title: "เทคนิคการให้คำปรึกษาเบื้องต้น (Basic Counseling)",
        durationHours: 30,
        creditBankValue: 2,
        price: 3000,
        isCreditBank: true,
        status: 'OPEN',
        coverImageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070&auto=format&fit=crop",
        category: "จิตวิทยาและการบริการสังคม",
        instructorName: "คณาจารย์สาขาวิชาจิตวิทยา",
        lifelongUrl: "https://lifelong.crru.ac.th/course"
    },
    {
        id: 'fallback-4',
        title: "การใช้งานโดรนเพื่อการสำรวจและทำแผนที่ชุมชน",
        durationHours: 45,
        creditBankValue: 3,
        price: 5500,
        isCreditBank: true,
        status: 'COMING_SOON',
        coverImageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop",
        category: "เทคโนโลยีภูมิสารสนเทศ",
        instructorName: "คณาจารย์สาขาวิชาภูมิสารสนเทศ",
        lifelongUrl: "https://lifelong.crru.ac.th/course"
    }
];

export default function ShortCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'all' | 'credit-bank' | 'general'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${apiUrl}/api/short-courses`, {
                    next: { revalidate: 60 }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setCourses(data);
                        return;
                    }
                }
                setCourses(fallbackCourses);
            } catch (err) {
                console.error('Failed to load short courses from API, using default list:', err);
                setCourses(fallbackCourses);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        if (filterType === 'credit-bank' && !course.isCreditBank) return false;
        if (filterType === 'general' && course.isCreditBank) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = course.title?.toLowerCase().includes(q);
            const matchCode = course.code?.toLowerCase().includes(q);
            const matchInstructor = course.instructorName?.toLowerCase().includes(q);
            const matchCategory = course.category?.toLowerCase().includes(q);
            return matchTitle || matchCode || matchInstructor || matchCategory;
        }
        return true;
    });

    const creditBankCount = courses.filter(c => c.isCreditBank).length;
    const generalCount = courses.filter(c => !c.isCreditBank).length;

    return (
        <div className="bg-white font-sans text-scholar-text">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-scholar-deep to-gray-900 text-white py-16 px-4 shadow-lg relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-scholar-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="container mx-auto relative z-10">
                    <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/academics/overview' }, { label: 'หลักสูตรระยะสั้น' }]} />
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scholar-gold/20 border border-scholar-gold/30 text-scholar-gold text-xs font-bold uppercase tracking-widest mt-4">
                        <Award className="w-3.5 h-3.5" />
                        Lifelong Learning & Credit Bank
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight">
                        หลักสูตรระยะสั้น (Short Courses)
                    </h1>
                    <p className="text-gray-300 mt-3 max-w-2xl text-base md:text-lg font-light leading-relaxed">
                        พัฒนาและต่อยอดทักษะแห่งอนาคต (Upskill & Reskill) โดยคณาจารย์ผู้ทรงคุณวุฒิ คณะสังคมศาสตร์ <br />
                        พร้อมเชื่อมโยงและสะสมหน่วยกิตเข้าสู่ระบบคลังหน่วยกิต (Credit Bank) ผ่าน <span className="text-scholar-gold font-medium">CRRU Lifelong Learning</span>
                    </p>
                </div>
            </div>

            {/* Filter & List */}
            <div className="container mx-auto px-4 py-12">

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6 justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200/80 shadow-sm">
                    <div className="flex flex-wrap bg-white p-1.5 rounded-xl sm:rounded-full border border-gray-200 shadow-sm gap-1 w-full lg:w-auto">
                        <button
                            className={`rounded-lg sm:rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${filterType === 'all'
                                ? 'bg-scholar-deep text-white shadow-md'
                                : 'text-gray-600 hover:text-scholar-deep hover:bg-gray-50'
                                }`}
                            onClick={() => setFilterType('all')}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            หลักสูตรทั้งหมด ({courses.length})
                        </button>
                        <button
                            className={`rounded-lg sm:rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${filterType === 'credit-bank'
                                ? 'bg-amber-500 text-white shadow-md font-bold'
                                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/50'
                                }`}
                            onClick={() => setFilterType('credit-bank')}
                        >
                            <Award className="w-4 h-4 text-amber-300" />
                            สะสม Credit Bank ({creditBankCount})
                        </button>
                        <button
                            className={`rounded-lg sm:rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${filterType === 'general'
                                ? 'bg-slate-700 text-white shadow-md font-bold'
                                : 'text-gray-600 hover:text-slate-800 hover:bg-gray-50'
                                }`}
                            onClick={() => setFilterType('general')}
                        >
                            <GraduationCap className="w-4 h-4" />
                            หลักสูตรระยะสั้นทั่วไป ({generalCount})
                        </button>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-scholar-accent/20 focus:border-scholar-accent"
                                placeholder="ค้นหาชื่อวิชา, รหัส, ผู้สอน..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowGuide(!showGuide)}
                            className={`px-3 py-2.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 flex-shrink-0 transition-colors ${showGuide
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            title="คำแนะนำประเภทหลักสูตร"
                        >
                            <HelpCircle className="w-4 h-4 text-amber-500" />
                            <span className="hidden sm:inline">เกณฑ์การเทียบโอน</span>
                            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                {/* Guide Accordion / Banner */}
                {showGuide && (
                    <div className="mb-10 bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm transition-all animate-in fade-in duration-300">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    แนวทางการเลือกประเภทหลักสูตร (Academic Guide)
                                </h3>
                                <p className="text-xs text-slate-600 mt-0.5">
                                    ทำความเข้าใจความแตกต่างของหลักสูตรเพื่อประโยชน์สูงสุดในการวางแผนการเรียนรู้ของคุณ
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Credit Bank Card */}
                            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-full blur-xl pointer-events-none" />
                                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                                    <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                                        🎓
                                    </div>
                                    <span>หลักสูตรสะสมหน่วยกิต (Credit Bank Course)</span>
                                </div>
                                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                                    <li>มีการวัดประเมินผลลัพธ์การเรียนรู้ (LOs) เทียบเคียงรายวิชา ป.ตรี</li>
                                    <li>ระบุจำนวนหน่วยกิตสะสมชัดเจน (1-3 หน่วยกิต)</li>
                                    <li>ได้รับวุฒิบัตร + บันทึกลง <strong>Credit Ledger</strong> ของมหาวิทยาลัย</li>
                                    <li><strong className="text-amber-700">สามารถนำไปยื่นเทียบโอน</strong> เพื่อขอยกเว้นรายวิชาในหลักสูตร ป.ตรี คณะสังคมศาสตร์ได้</li>
                                </ul>
                                <div className="mt-3 pt-2.5 border-t border-amber-100">
                                    <Link
                                        href="/academics/credit-bank"
                                        className="text-xs text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                                    >
                                        <span>ศึกษาระบบ Credit Bank คณะสังคมศาสตร์</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            {/* General Short Course Card */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
                                    <div className="w-6 h-6 rounded-md bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                                        📘
                                    </div>
                                    <span>หลักสูตรระยะสั้นทั่วไป (General Short Course / Non-degree)</span>
                                </div>
                                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                                    <li>เน้นฝึกทักษะเฉพาะทาง ปฏิบัติการจริง (Upskill & Reskill)</li>
                                    <li>เรียนจบตามเกณฑ์เวลาได้รับ <strong>วุฒิบัตรรับรองการผ่านการอบรม</strong></li>
                                    <li>ค่าหน่วยกิตในระบบ = 0 หน่วยกิต</li>
                                    <li><strong className="text-slate-700">ไม่สามารถนำไปเทียบโอน</strong> เป็นหน่วยกิตเพื่อขอรับปริญญาบัตรได้</li>
                                </ul>
                                <div className="mt-3 pt-2.5 border-t border-slate-100">
                                    <span className="text-xs text-slate-500 font-medium">
                                        เหมาะสำหรับบุคคลทั่วไป ผู้ประกอบการ หรือผู้ที่ต้องการเรียนรู้เชิงทักษะ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-scholar-deep" />
                        <p className="text-gray-500 text-sm">กำลังโหลดรายชื่อหลักสูตร...</p>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                            const imageSrc = course.coverImageUrl
                                ? (course.coverImageUrl.startsWith('http') ? course.coverImageUrl : `${apiUrl}${course.coverImageUrl}`)
                                : 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';

                            const targetUrl = course.lifelongUrl || 'https://lifelong.crru.ac.th/course';

                            return (
                                <div
                                    key={course.id}
                                    className={`bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col overflow-hidden group hover:-translate-y-1 ${course.isCreditBank
                                        ? 'border-amber-200/90 ring-1 ring-amber-100'
                                        : 'border-gray-100'
                                        }`}
                                >
                                    {/* Cover Image & Badges */}
                                    <div className="relative h-52 overflow-hidden bg-gray-100">
                                        <Image
                                            src={imageSrc}
                                            alt={course.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized={imageSrc.startsWith('http')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-10">
                                            {course.status === 'OPEN' && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm backdrop-blur-sm">
                                                    เปิดรับสมัคร
                                                </span>
                                            )}
                                            {course.status === 'COMING_SOON' && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm backdrop-blur-sm">
                                                    เร็วๆ นี้
                                                </span>
                                            )}
                                            {course.status === 'CLOSED' && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-700 text-white shadow-sm backdrop-blur-sm">
                                                    ปิดรับสมัคร
                                                </span>
                                            )}
                                        </div>

                                        {/* Course Type Badge */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                                            {course.isCreditBank ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 text-amber-300 text-xs font-bold shadow-md backdrop-blur-sm border border-amber-400/40">
                                                    <Award className="w-3.5 h-3.5 text-amber-400" />
                                                    สะสม {course.creditBankValue} หน่วยกิต (Credit Bank)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-200 text-xs font-semibold shadow-md backdrop-blur-sm border border-slate-700">
                                                    <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
                                                    หลักสูตรระยะสั้นทั่วไป (Non-degree)
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Course Details */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wide ${course.isCreditBank ? 'text-amber-700' : 'text-scholar-accent'
                                                    }`}>
                                                    {course.category || (course.isCreditBank ? 'หมวดสะสมหน่วยกิต' : 'หลักสูตรอบรมทักษะ')}
                                                </span>
                                                {course.code && (
                                                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {course.code}
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-lg font-bold text-gray-900 group-hover:text-scholar-deep transition-colors line-clamp-2 leading-snug">
                                                {course.title}
                                            </h2>

                                            {course.instructorName && (
                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                                                    <UserCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{course.instructorName}</span>
                                                </p>
                                            )}

                                            {course.description && (
                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                                    {course.description}
                                                </p>
                                            )}

                                            {/* Transferability indicator */}
                                            <div className="mt-3">
                                                {course.isCreditBank ? (
                                                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60">
                                                        <CheckCircle className="w-3 h-3 text-amber-600" />
                                                        เทียบโอนปริญญาตรี คณะสังคมศาสตร์ได้
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/60">
                                                        <span>📜 วุฒิบัตรรับรองทักษะ (Certificate of Completion)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Clock className="w-4 h-4 text-scholar-gold" />
                                                    {course.durationHours} ชั่วโมง
                                                </span>
                                                <span className="font-bold text-base text-scholar-deep">
                                                    {Number(course.price) > 0 ? `฿${Number(course.price).toLocaleString()}` : 'ฟรี (ไม่มีค่าใช้จ่าย)'}
                                                </span>
                                            </div>

                                            {/* Action Button linking to Lifelong CRRU */}
                                            <a
                                                href={targetUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${course.status === 'OPEN'
                                                    ? 'bg-scholar-deep hover:bg-scholar-deep/90 text-white hover:shadow-md'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                <span>
                                                    {course.status === 'OPEN'
                                                        ? 'สมัครเรียนบน CRRU Lifelong'
                                                        : 'ดูรายละเอียดบน Lifelong'}
                                                </span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <p className="text-[11px] text-center text-gray-400 mt-2">
                                                ดำเนินการผ่านระบบกลาง CRRU Lifelong Learning
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-lg mx-auto">
                        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-gray-700">ไม่พบหลักสูตรที่ตรงตามเงื่อนไข</h3>
                        <p className="text-sm text-gray-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกแท็บ "หลักสูตรทั้งหมด"</p>
                    </div>
                )}

                {/* Additional Info Box */}
                <div className="mt-16 bg-gradient-to-r from-scholar-deep/5 via-scholar-gold/10 to-scholar-deep/5 rounded-3xl p-8 border border-scholar-gold/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-scholar-deep">
                            ต้องการสะสมหน่วยกิตเข้าสู่ระบบคลังหน่วยกิต (Credit Bank)?
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            ศึกษาขั้นตอนการเรียนรู้ การเทียบโอนประสบการณ์ (RPL) และเกณฑ์การขอรับปริญญาบัตร
                        </p>
                    </div>
                    <Link
                        href="/academics/credit-bank"
                        className="px-6 py-3 rounded-full bg-scholar-deep text-white font-medium text-sm hover:bg-scholar-deep/90 transition-colors shadow-md flex-shrink-0"
                    >
                        ดูข้อมูลระบบคลังหน่วยกิต
                    </Link>
                </div>

            </div>
        </div>
    );
}
