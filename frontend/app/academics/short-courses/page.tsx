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
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const [filterType, setFilterType] = useState<string>('all');
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
        <div className="bg-slate-50/50 font-sans text-slate-800 min-h-screen">
            {/* Header Banner - Scholar Academic Theme */}
            <div className="bg-[#0B132B] text-white py-16 px-4 shadow-md relative overflow-hidden border-b-4 border-amber-500">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
                <div className="container mx-auto relative z-10 max-w-6xl">
                    <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/programs' }, { label: 'หลักสูตรระยะสั้น' }]} />
                    
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-400/40 text-xs px-3 py-1 font-semibold uppercase tracking-wider backdrop-blur-xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1.5" />
                            LIFELONG LEARNING &amp; CREDIT BANK
                        </Badge>
                        <Badge variant="outline" className="bg-white/10 text-slate-200 border-white/20 text-xs px-2.5 py-1">
                            CRRU Lifelong Network
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 leading-tight font-heading text-white">
                        หลักสูตรระยะสั้น (Short Courses)
                    </h1>
                    
                    <p className="text-slate-300 mt-3 max-w-3xl text-sm sm:text-base font-light leading-relaxed">
                        พัฒนาและต่อยอดทักษะแห่งอนาคต (Upskill &amp; Reskill) โดยคณาจารย์ผู้ทรงคุณวุฒิ คณะสังคมศาสตร์ 
                        พร้อมระบบสะสมผลลัพธ์การเรียนรู้เทียบโอนหน่วยกิตเข้าสู่ปริญญาบัตรผ่าน <span className="text-amber-400 font-medium">ระบบคลังหน่วยกิต (Credit Bank)</span>
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">

                {/* Filter Tabs & Search Bar using shadcn/ui */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
                    {/* shadcn Tabs */}
                    <Tabs value={filterType} onValueChange={setFilterType} className="w-full lg:w-auto">
                        <TabsList className="bg-slate-100 p-1 rounded-xl h-auto flex flex-wrap gap-1 w-full lg:w-auto">
                            <TabsTrigger 
                                value="all" 
                                className="rounded-lg text-xs sm:text-sm font-semibold px-3.5 py-2 data-[state=active]:bg-[#0B132B] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                                ทั้งหมด ({courses.length})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="credit-bank" 
                                className="rounded-lg text-xs sm:text-sm font-semibold px-3.5 py-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                <Award className="w-3.5 h-3.5 mr-1.5 text-amber-200" />
                                สะสม Credit Bank ({creditBankCount})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="general" 
                                className="rounded-lg text-xs sm:text-sm font-semibold px-3.5 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                                หลักสูตรอบรมทั่วไป ({generalCount})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Search & Guide Toggle */}
                    <div className="flex items-center gap-2.5 w-full lg:w-auto">
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                className="pl-10 pr-4 h-10 text-xs sm:text-sm bg-slate-50 border-slate-200 focus-visible:ring-amber-500 rounded-xl"
                                placeholder="ค้นหาชื่อวิชา, รหัส, ผู้สอน..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowGuide(!showGuide)}
                            className={`h-10 px-3 rounded-xl border text-xs font-semibold gap-1.5 shrink-0 transition-colors ${
                                showGuide 
                                    ? 'bg-amber-50 border-amber-300 text-amber-900' 
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <HelpCircle className="w-4 h-4 text-amber-600" />
                            <span className="hidden sm:inline">เกณฑ์การเทียบโอน</span>
                            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                </div>

                {/* Academic Guide Box using shadcn Card */}
                {showGuide && (
                    <Card className="border-amber-200/80 bg-gradient-to-r from-amber-50/50 via-white to-slate-50/50 shadow-sm animate-in fade-in duration-200">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                <CardTitle className="text-base text-slate-900 font-bold">
                                    แนวทางการเลือกประเภทหลักสูตร (Academic Guide)
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs text-slate-600">
                                ทำความเข้าใจความแตกต่างของหลักสูตรเพื่อประโยชน์สูงสุดในการวางแผนสะสมผลลัพธ์การเรียนรู้
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Credit Bank Card */}
                                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                                        <Badge className="bg-amber-500 hover:bg-amber-500 text-slate-950 font-bold text-[11px] px-2 py-0.5">
                                            Credit Bank
                                        </Badge>
                                        <span>หลักสูตรสะสมหน่วยกิต (Credit Bank Course)</span>
                                    </div>
                                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                        <li>มีการวัดประเมินผลลัพธ์การเรียนรู้ (Learning Outcomes) เทียบเคียงรายวิชา ป.ตรี</li>
                                        <li>ระบุจำนวนหน่วยกิตสะสมชัดเจน (1–3 หน่วยกิต)</li>
                                        <li>ได้รับวุฒิบัตร + บันทึกลง <strong>Credit Ledger</strong> ของมหาวิทยาลัย</li>
                                        <li><strong className="text-amber-800">สามารถนำไปยื่นเทียบโอน</strong> ยกเว้นรายวิชาในหลักสูตรปริญญาตรี คณะสังคมศาสตร์ได้</li>
                                    </ul>
                                    <div className="pt-2 border-t border-amber-100">
                                        <Link
                                            href="/academics/credit-bank"
                                            className="text-xs text-amber-700 font-semibold hover:underline inline-flex items-center gap-1"
                                        >
                                            <span>ศึกษาระบบ Credit Bank คณะสังคมศาสตร์</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>

                                {/* General Course Card */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                        <Badge variant="outline" className="bg-slate-100 text-slate-700 font-bold text-[11px] px-2 py-0.5">
                                            Non-degree
                                        </Badge>
                                        <span>หลักสูตรระยะสั้นทั่วไป (General Short Course)</span>
                                    </div>
                                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                        <li>เน้นฝึกทักษะเฉพาะทาง ปฏิบัติการจริง (Upskill &amp; Reskill)</li>
                                        <li>เรียนจบตามเกณฑ์เวลาได้รับ <strong>วุฒิบัตรรับรองการผ่านการอบรม</strong></li>
                                        <li>ค่าหน่วยกิตในระบบ = 0 หน่วยกิต</li>
                                        <li><strong className="text-slate-700">ไม่สามารถนำไปเทียบโอน</strong> เป็นหน่วยกิตเพื่อขอรับปริญญาบัตรได้</li>
                                    </ul>
                                    <div className="pt-2 border-t border-slate-100">
                                        <span className="text-xs text-slate-500">
                                            เหมาะสำหรับบุคคลทั่วไป ผู้ประกอบการ หรือผู้ที่ต้องการเรียนรู้เชิงทักษะเฉพาะกิจ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Course Cards Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                        <p className="text-slate-500 text-sm">กำลังโหลดรายชื่อหลักสูตร...</p>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                            const imageSrc = course.coverImageUrl
                                ? (course.coverImageUrl.startsWith('http') ? course.coverImageUrl : `${apiUrl}${course.coverImageUrl}`)
                                : 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';

                            const targetUrl = course.lifelongUrl || 'https://lifelong.crru.ac.th/course';

                            return (
                                <Card 
                                    key={course.id}
                                    className={`overflow-hidden border flex flex-col justify-between hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5 ${
                                        course.isCreditBank 
                                            ? 'border-amber-200/90 shadow-xs' 
                                            : 'border-slate-200 shadow-2xs'
                                    }`}
                                >
                                    {/* Cover Image & Badges */}
                                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                                        <Image
                                            src={imageSrc}
                                            alt={course.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized={imageSrc.startsWith('http')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
                                            {course.status === 'OPEN' && (
                                                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 shadow-sm">
                                                    เปิดรับสมัคร
                                                </Badge>
                                            )}
                                            {course.status === 'COMING_SOON' && (
                                                <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 shadow-sm">
                                                    เร็วๆ นี้
                                                </Badge>
                                            )}
                                            {course.status === 'CLOSED' && (
                                                <Badge variant="secondary" className="bg-slate-700 text-white text-[11px] font-bold px-2.5 py-0.5 shadow-sm">
                                                    ปิดรับสมัคร
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Course Type Badge */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                                            {course.isCreditBank ? (
                                                <Badge className="bg-slate-950/90 hover:bg-slate-950 text-amber-300 text-xs font-bold px-3 py-1 shadow-md border border-amber-400/40 gap-1.5">
                                                    <Award className="w-3.5 h-3.5 text-amber-400" />
                                                    สะสม {course.creditBankValue} หน่วยกิต (Credit Bank)
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-slate-900/90 text-slate-200 text-xs font-semibold px-3 py-1 shadow-md border border-slate-700 gap-1.5">
                                                    <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
                                                    หลักสูตรอบรมทั่วไป (Non-degree)
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`text-[11px] font-bold uppercase tracking-wide ${
                                                    course.isCreditBank ? 'text-amber-800' : 'text-slate-600'
                                                }`}>
                                                    {course.category || (course.isCreditBank ? 'หมวดสะสมหน่วยกิต' : 'หลักสูตรอบรมทักษะ')}
                                                </span>
                                                {course.code && (
                                                    <Badge variant="outline" className="font-mono text-[10px] text-slate-600 bg-slate-100 border-slate-200 px-1.5 py-0">
                                                        {course.code}
                                                    </Badge>
                                                )}
                                            </div>

                                            <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                                                {course.title}
                                            </h2>

                                            {course.instructorName && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">{course.instructorName}</span>
                                                </p>
                                            )}

                                            {course.description && (
                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                    {course.description}
                                                </p>
                                            )}

                                            {/* Transferability indicator */}
                                            <div className="pt-1">
                                                {course.isCreditBank ? (
                                                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/70">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                                                        เทียบโอนปริญญาตรี คณะสังคมศาสตร์ได้
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70">
                                                        <span>📜 วุฒิบัตรรับรองทักษะ (Certificate)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-slate-600">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                    {course.durationHours} ชั่วโมง
                                                </span>
                                                <span className="font-bold text-sm text-slate-900">
                                                    {Number(course.price) > 0 ? `฿${Number(course.price).toLocaleString()}` : 'ฟรี (ไม่มีค่าใช้จ่าย)'}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <Button 
                                                asChild 
                                                className={`w-full text-xs font-semibold h-10 shadow-sm ${
                                                    course.status === 'OPEN'
                                                        ? 'bg-[#0B132B] hover:bg-slate-800 text-white'
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <a
                                                    href={targetUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5"
                                                >
                                                    <span>
                                                        {course.status === 'OPEN'
                                                            ? 'สมัครเรียนบน CRRU Lifelong'
                                                            : 'ดูรายละเอียดบน Lifelong'}
                                                    </span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </Button>
                                            <p className="text-[10px] text-center text-slate-400">
                                                ดำเนินการผ่านระบบกลาง CRRU Lifelong Learning
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 max-w-lg mx-auto">
                        <CardContent className="space-y-3">
                            <Award className="w-12 h-12 text-slate-300 mx-auto" />
                            <h3 className="text-base font-bold text-slate-800">ไม่พบหลักสูตรที่ตรงตามเงื่อนไข</h3>
                            <p className="text-xs text-slate-500">ลองเปลี่ยนคำค้นหา หรือเลือกแท็บ &quot;ทั้งหมด&quot;</p>
                            <Button variant="outline" size="sm" onClick={() => { setFilterType('all'); setSearchQuery(''); }}>
                                ล้างตัวกรองทั้งหมด
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Additional Info / Cross-link Box */}
                <Card className="bg-gradient-to-r from-slate-900 to-[#0B132B] text-white border-0 shadow-md">
                    <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                                <Award className="w-5 h-5 text-amber-400" />
                                ต้องการสะสมหน่วยกิตเข้าสู่ระบบคลังหน่วยกิต (Credit Bank)?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 font-light">
                                ศึกษาขั้นตอนการเรียนรู้ การเทียบโอนประสบการณ์ (RPL) และเกณฑ์การขอรับปริญญาบัตร
                            </p>
                        </div>
                        <Button asChild className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-10 px-5 shrink-0 shadow-sm">
                            <Link href="/academics/credit-bank" className="flex items-center gap-1.5">
                                <span>ดูข้อมูลระบบคลังหน่วยกิต</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
