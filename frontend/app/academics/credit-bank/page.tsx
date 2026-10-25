"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import {
    Award,
    ExternalLink,
    Clock,
    UserCheck,
    CheckCircle2,
    Info,
    GraduationCap,
    BookOpen,
    Layers,
    ShieldCheck,
    ChevronRight,
    HelpCircle,
    Calendar,
    Sparkles,
    FileText,
    ArrowUpRight,
    School,
    Users,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ShortCourse {
    id: string;
    code: string | null;
    title: string;
    category: string | null;
    description: string | null;
    instructorName: string | null;
    coverImageUrl: string | null;
    durationHours: number;
    creditBankValue: number;
    isOnline: boolean;
    price: string | number;
    lifelongUrl: string | null;
    isCreditBank: boolean;
    status: 'OPEN' | 'COMING_SOON' | 'CLOSED';
}

const fallbackCourses: ShortCourse[] = [
    {
        id: '1',
        code: 'LL6506004',
        title: 'ตุงและโคมประดิษฐ์',
        category: 'ศิลปวัฒนธรรมและภูมิปัญญาท้องถิ่น',
        description: 'เรียนรู้แนวคิด ลักษณะ ความสำคัญ ประเภท และการใช้งานตามคติความเชื่อของตุงและโคมล้านนา รวมถึงการฝึกปฏิบัติการประดิษฐ์ตุงและโคมล้านนาในรูปแบบต่างๆ',
        instructorName: 'ผู้ช่วยศาสตราจารย์ ดร.ณรงค์ เจนใจ',
        coverImageUrl: 'https://lifelong.crru.ac.th/upload-assets/images/course/GJvgMnqsxNFVkQiSCEyup9zI5TXe8c.webp',
        durationHours: 6,
        creditBankValue: 1,
        isOnline: false,
        price: 0,
        lifelongUrl: 'https://lifelong.crru.ac.th/course/detail/%E0%B8%95%E0%B8%B8%E0%B8%87%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%82%E0%B8%84%E0%B8%A1%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B4%E0%B8%A9%E0%B8%90%E0%B9%8C',
        isCreditBank: true,
        status: 'OPEN',
    }
];

export default function CreditBankPage() {
    const [courses, setCourses] = useState<ShortCourse[]>(fallbackCourses);
    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${apiUrl}/api/short-courses?isCreditBank=true`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setCourses(data);
                    }
                }
            } catch (err) {
                console.error('Failed to load credit bank courses:', err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <TooltipProvider delayDuration={150}>
            <div className="bg-slate-50/50 font-sans text-slate-800 min-h-screen pb-16">

                {/* 1. Academic Header: Compact, Structured & Authoritative */}
                <header className="bg-[#0B132B] text-white pt-12 pb-10 px-4 border-b-4 border-amber-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
                    
                    <div className="container mx-auto max-w-6xl relative z-10 space-y-4">
                        <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/programs' }, { label: 'ระบบคลังหน่วยกิต (Credit Bank)' }]} />

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                            <div className="space-y-2 max-w-3xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-400/40 text-xs px-2.5 py-0.5 font-semibold">
                                        <Sparkles className="w-3 h-3 text-amber-300 mr-1" />
                                        Lifelong Learning Framework
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/10 text-slate-200 border-white/20 text-xs px-2.5 py-0.5">
                                        คณะสังคมศาสตร์ x CRRU Lifelong
                                    </Badge>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-heading">
                                    ระบบคลังหน่วยกิต (Credit Bank System)
                                </h1>

                                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                                    กลไกการจัดการศึกษาตลอดชีวิตและการเทียบโอนผลลัพธ์การเรียนรู้และประสบการณ์ทำงาน (RPL) 
                                    เพื่อสะสมหน่วยกิตสู่ปริญญาบัตร คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                                <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-9 px-4 shadow-sm">
                                    <a href="https://lifelong.crru.ac.th/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                        <span>CRRU Lifelong Portal</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/15 text-white border-white/20 text-xs h-9 px-3.5">
                                    <Link href="/contact">
                                        ปรึกษาฝ่ายวิชาการ
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Interactive Key Facts with Tooltips */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/10">
                            {/* Fact 1 */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-lg border border-white/10 cursor-help flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[11px] text-slate-300 flex items-center gap-1">
                                                <span>ระยะเวลาสะสม</span>
                                                <Info className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <div className="text-xs sm:text-sm font-bold text-white">ไม่จำกัดเวลา</div>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">หน่วยกิตที่สะสมผ่านระบบคลังหน่วยกิตจะไม่มีวันหมดอายุ สามารถสะสมได้ตลอดชีวิตจนกว่าจะพร้อมขอสำเร็จการศึกษา</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Fact 2 */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-lg border border-white/10 cursor-help flex items-start gap-2">
                                        <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[11px] text-slate-300 flex items-center gap-1">
                                                <span>เทียบโอนประสบการณ์</span>
                                                <Info className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <div className="text-xs sm:text-sm font-bold text-white">RPL Supported</div>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs"><strong>Recognition of Prior Learning (RPL):</strong> สามารถนำผลงาน แฟ้มสะสมงาน หรือประสบการณ์ทำงานจริงมายื่นเทียบโอนเป็นหน่วยกิตรายวิชาได้</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Fact 3 */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-lg border border-white/10 cursor-help flex items-start gap-2">
                                        <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[11px] text-slate-300 flex items-center gap-1">
                                                <span>วุฒิการศึกษา</span>
                                                <Info className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <div className="text-xs sm:text-sm font-bold text-white">Dual Certificate</div>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">ได้รับทั้งวุฒิบัตรรับรองทักษะเฉพาะวิชา (Certificate) เมื่อเรียนจบแต่ละคอร์ส และมีสิทธิ์ขอรับปริญญาบัตรเมื่อสะสมครบโครงสร้าง</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Fact 4 */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-lg border border-white/10 cursor-help flex items-start gap-2">
                                        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[11px] text-slate-300 flex items-center gap-1">
                                                <span>การรับรองมาตรฐาน</span>
                                                <Info className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <div className="text-xs sm:text-sm font-bold text-white">เกณฑ์กระทรวง อว.</div>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">เป็นไปตามข้อบังคับมหาวิทยาลัยราชภัฏเชียงราย และเกณฑ์มาตรฐานระบบคลังหน่วยกิตของกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.)</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </header>

                {/* 2. Structured Tabbed Content (Modular Information Architecture) */}
                <main className="container mx-auto px-4 max-w-6xl mt-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        
                        {/* Tab Navigation Controls */}
                        <div className="border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs">
                            <TabsList className="bg-transparent p-0 flex flex-wrap gap-1 h-auto justify-start">
                                <TabsTrigger 
                                    value="overview"
                                    className="data-[state=active]:bg-[#0B132B] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all gap-2"
                                >
                                    <School className="w-4 h-4" />
                                    <span>ภาพรวมและหลักเกณฑ์</span>
                                </TabsTrigger>

                                <TabsTrigger 
                                    value="pathway"
                                    className="data-[state=active]:bg-[#0B132B] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all gap-2"
                                >
                                    <Layers className="w-4 h-4" />
                                    <span>ขั้นตอนการสะสม (Pathway)</span>
                                </TabsTrigger>

                                <TabsTrigger 
                                    value="comparison"
                                    className="data-[state=active]:bg-[#0B132B] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all gap-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span>เปรียบเทียบระบบการเรียน</span>
                                </TabsTrigger>

                                <TabsTrigger 
                                    value="courses"
                                    className="data-[state=active]:bg-[#0B132B] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all gap-2"
                                >
                                    <Award className="w-4 h-4 text-amber-500 data-[state=active]:text-amber-300" />
                                    <span>หลักสูตรสะสมหน่วยกิต ({courses.length})</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* TAB 1: OVERVIEW & REGULATIONS */}
                        <TabsContent value="overview" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left 2 Columns: Core Concept & Framework */}
                                <div className="md:col-span-2 space-y-6">
                                    <Card className="border-slate-200 shadow-xs">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2 text-amber-800">
                                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[10px] font-bold">
                                                    ACADEMIC FRAMEWORK
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg font-bold text-slate-900">
                                                แนวคิดและสิทธิประโยชน์ของระบบคลังหน่วยกิต
                                            </CardTitle>
                                            <CardDescription className="text-xs text-slate-600">
                                                สิทธิประโยชน์ตามข้อบังคับมหาวิทยาลัยราชภัฏเชียงราย ว่าด้วยการสะสมหน่วยกิตในระบบคลังหน่วยกิต
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                                            <p>
                                                ระบบคลังหน่วยกิต (Credit Bank) เป็นกลไกเปิดโอกาสให้บุคคลทุกช่วงวัย ทั้งนักเรียน ม.ปลาย, วัยทำงาน, ผู้ประกอบการ และผู้เกษียณอายุ 
                                                สามารถเข้าศึกษาในหลักสูตรฝึกอบรมระยะสั้นที่เทียบเคียงผลลัพธ์การเรียนรู้ (Learning Outcomes) ของรายวิชาในหลักสูตรระดับปริญญาตรีของคณะสังคมศาสตร์
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                                    <span className="font-bold text-slate-900 block text-xs">ความยืดหยุ่นสูงสุด</span>
                                                    <span className="text-[11px] text-slate-500">เลือกเรียนตามจังหวะชีวิต จ่ายค่าลงทะเบียนเฉพาะรายวิชาที่เข้าอบรม</span>
                                                </div>
                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                                    <span className="font-bold text-slate-900 block text-xs">ลดเวลาเรียนใน มรภ.</span>
                                                    <span className="text-[11px] text-slate-500">เทียบโอนหน่วยกิตสะสมเพื่อขอยกเว้นรายวิชาเมื่อเข้าศึกษาในระบบปกติ</span>
                                                </div>
                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                                    <span className="font-bold text-slate-900 block text-xs">สมรรถนะตรงสายงาน</span>
                                                    <span className="text-[11px] text-slate-500">มุ่งเน้นทักษะที่นำไปประยุกต์ใช้ได้จริงในงานพัฒนาชุมชนและสังคม</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* RPL Explanation Card */}
                                    <Card className="border-amber-200 bg-amber-50/30 shadow-xs">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base font-bold text-amber-950 flex items-center gap-2">
                                                <Award className="w-4 h-4 text-amber-600" />
                                                การเทียบโอนผลการเรียนรู้และประสบการณ์ (RPL)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-xs text-slate-700 space-y-2.5">
                                            <p>
                                                <strong>RPL (Recognition of Prior Learning)</strong> คือกระบวนการรับรองความรู้ ทักษะ และสมรรถนะที่ผู้เรียนได้รับจากการทำงานจริง การฝึกอบรมในสถานประกอบการ หรือการเรียนรู้นอกระบบ
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge variant="outline" className="bg-white border-amber-300 text-amber-900 cursor-help gap-1 text-[11px]">
                                                            <span>Portfolio Assessment</span>
                                                            <Info className="w-3 h-3 text-amber-600" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">การประเมินจากแฟ้มสะสมผลงานจริง เอกสารรับรองการทำงาน และชิ้นงานวิชาชีพ</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge variant="outline" className="bg-white border-amber-300 text-amber-900 cursor-help gap-1 text-[11px]">
                                                            <span>Competency Interview</span>
                                                            <Info className="w-3 h-3 text-amber-600" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">การสอบสัมภาษณ์วัดสมรรถนะเชิงลึกโดยคณะกรรมการผู้เชี่ยวชาญประจำสาขาวิชา</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge variant="outline" className="bg-white border-amber-300 text-amber-900 cursor-help gap-1 text-[11px]">
                                                            <span>Credit Ledger Record</span>
                                                            <Info className="w-3 h-3 text-amber-600" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">บันทึกผลการเทียบโอนลงในสมุดบัญชีหน่วยกิตดิจิทัลอย่างเป็นทางการของมหาวิทยาลัย</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right 1 Column: Key Contacts & Portals */}
                                <div className="space-y-4">
                                    <Card className="border-slate-200 shadow-xs">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-amber-600" />
                                                หลักสูตรที่รองรับการเทียบโอน
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2.5 text-xs text-slate-600">
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span>ระดับการศึกษา:</span>
                                                <Badge variant="secondary" className="font-semibold text-slate-800">ปริญญาตรี (ศศ.บ.)</Badge>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span>สาขาวิชาที่รองรับ:</span>
                                                <span className="font-bold text-slate-900">ทุกสาขาวิชาของคณะ</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span>ระบบบทเรียน:</span>
                                                <span className="font-medium text-slate-700">CRRU Lifelong Learning</span>
                                            </div>
                                            <div className="pt-2">
                                                <Button asChild variant="outline" size="sm" className="w-full text-xs h-9 gap-1.5">
                                                    <Link href="/programs">
                                                        <span>สำรวจ 7 สาขาวิชาของคณะ</span>
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-[#0B132B] text-white border-0 shadow-xs">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                                                CRRU Lifelong Learning Portal
                                            </div>
                                            <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                                                การเปิดบัญชีคลังหน่วยกิตและการลงทะเบียนเรียนรายวิชาดำเนินการผ่านระบบกลางของสถาบันการเรียนรู้ตลอดชีวิต มหาวิทยาลัยราชภัฏเชียงราย
                                            </p>
                                            <Button asChild size="sm" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-9">
                                                <a href="https://lifelong.crru.ac.th/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                                                    <span>เปิดบัญชีคลังหน่วยกิต</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 2: STEP-BY-STEP PATHWAY */}
                        <TabsContent value="pathway" className="space-y-6 mt-0">
                            <Card className="border-slate-200 shadow-xs">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-slate-900">
                                        4 ขั้นตอนการสะสมหน่วยกิตสู่ปริญญาบัตร
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-600">
                                        กระบวนการโปร่งใสและเป็นระบบ ตั้งแต่การเปิดบัญชี จนถึงการยื่นขอสำเร็จการศึกษา
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {[
                                            {
                                                step: '01',
                                                title: 'เปิดบัญชีคลังหน่วยกิต',
                                                desc: 'สมัครสมาชิกในระบบ CRRU Lifelong เพื่อรับสมุดบัญชีหน่วยกิตส่วนบุคคล (Credit Ledger)',
                                                badge: 'ขั้นตอนแรก',
                                                details: 'บุคคลทั่วไปสามารถสมัครได้ทันทีโดยไม่ต้องผ่านการสอบคัดเลือก'
                                            },
                                            {
                                                step: '02',
                                                title: 'เลือกเรียนหลักสูตรคณะ',
                                                desc: 'ลงทะเบียนเรียนหลักสูตรระยะสั้นของคณะสังคมศาสตร์ ที่ระบุหน่วยกิต Credit Bank',
                                                badge: 'Upskill / Reskill',
                                                details: 'เรียนแบบ Online หรือ Onsite ตามเงื่อนไขของแต่ละรายวิชา'
                                            },
                                            {
                                                step: '03',
                                                title: 'ประเมินผลและเทียบโอน',
                                                desc: 'ผ่านเกณฑ์วัดผลของคอร์ส หรือยื่นเอกสารเทียบโอนประสบการณ์ทำงานจริง (RPL)',
                                                badge: 'บันทึกหน่วยกิต',
                                                details: 'ผลการเรียนรู้จะถูกบันทึกใน Credit Ledger อย่างเป็นทางการ'
                                            },
                                            {
                                                step: '04',
                                                title: 'ยื่นขอรับปริญญาบัตร',
                                                desc: 'เมื่อสะสมหน่วยกิตครบตามโครงสร้าง สามารถยื่นขอรับปริญญาศิลปศาสตรบัณฑิต',
                                                badge: 'สำเร็จการศึกษา',
                                                details: 'ได้รับปริญญาบัตรเช่นเดียวกับนักศึกษาในระบบปกติ'
                                            }
                                        ].map((item, idx) => (
                                            <div 
                                                key={idx}
                                                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl font-black font-mono text-slate-300">
                                                            {item.step}
                                                        </span>
                                                        <Badge variant="outline" className="text-[10px] font-bold bg-slate-50 text-slate-700">
                                                            {item.badge}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                                                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                                                </div>
                                                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-light">
                                                    💡 {item.details}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: COMPARISON MATRIX */}
                        <TabsContent value="comparison" className="space-y-6 mt-0">
                            <Card className="border-slate-200 overflow-hidden shadow-xs">
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-900">
                                        ตารางเปรียบเทียบ: การศึกษาในระบบปกติ vs ระบบคลังหน่วยกิต (Credit Bank)
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-600">
                                        เปรียบเทียบในมิติต่างๆ เพื่อช่วยในการวางแผนเส้นทางการศึกษาที่ตอบโจทย์รูปแบบการใช้ชีวิต
                                    </CardDescription>
                                </CardHeader>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-700">
                                                <th className="p-3.5 w-1/4">มิติการจัดการศึกษา</th>
                                                <th className="p-3.5 w-3/8 text-slate-600">การศึกษาในระบบปกติ (Traditional)</th>
                                                <th className="p-3.5 w-3/8 bg-amber-50/70 text-slate-950 border-l border-amber-200">
                                                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                                                        <Award className="w-3.5 h-3.5 text-amber-600" />
                                                        <span>ระบบคลังหน่วยกิต (Credit Bank)</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="p-3.5 font-bold text-slate-900">คุณสมบัติผู้เรียน</td>
                                                <td className="p-3.5 text-slate-600">ต้องมีวุฒิ ม.6 หรือ ปวช. และผ่านการสอบคัดเลือก</td>
                                                <td className="p-3.5 bg-amber-50/30 border-l border-amber-100 font-medium text-slate-900">
                                                    เปิดกว้างสำหรับทุกคน ไม่จำกัดวุฒิเริ่มต้นหรืออายุ
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="p-3.5 font-bold text-slate-900">ความยืดหยุ่นของเวลา</td>
                                                <td className="p-3.5 text-slate-600">เรียนตามตารางสอนปกติในภาคการศึกษา (จันทร์–ศุกร์)</td>
                                                <td className="p-3.5 bg-amber-50/30 border-l border-amber-100 font-medium text-slate-900">
                                                    Anywhere, Anytime เรียนตามความสะดวกของผู้เรียน
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="p-3.5 font-bold text-slate-900">การเทียบโอนประสบการณ์ (RPL)</td>
                                                <td className="p-3.5 text-slate-600">เทียบได้เฉพาะวิชาที่เคยเรียนในมหาวิทยาลัย</td>
                                                <td className="p-3.5 bg-amber-50/30 border-l border-amber-100 font-semibold text-amber-900">
                                                    เทียบโอนประสบการณ์ทำงานจริงและผลงานวิชาชีพได้
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="p-3.5 font-bold text-slate-900">การชำระค่าธรรมเนียม</td>
                                                <td className="p-3.5 text-slate-600">ชำระค่าธรรมเนียมการศึกษาแบบเหมาจ่ายรายเทอม</td>
                                                <td className="p-3.5 bg-amber-50/30 border-l border-amber-100 font-medium text-slate-900">
                                                    จ่ายเฉพาะรายวิชาหรือคอร์สอบรมที่ต้องการเรียนจริง
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="p-3.5 font-bold text-slate-900">อายุการสะสมหน่วยกิต</td>
                                                <td className="p-3.5 text-slate-600">มีระยะเวลาตามเกณฑ์ (ป.ตรี ไม่เกิน 8 ปี)</td>
                                                <td className="p-3.5 bg-amber-50/30 border-l border-amber-100 font-semibold text-emerald-800">
                                                    สะสมได้ตลอดชีวิต ไม่จำกัดเวลาหมดอายุ
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="p-3.5 font-bold text-slate-900">วุฒิการศึกษาที่ได้รับ</td>
                                                <td className="p-3.5 text-slate-600">ได้รับปริญญาบัตรเมื่อสำเร็จการศึกษาครบ</td>
                                                <td className="p-3.5 bg-amber-50/30 border-l border-amber-100 font-medium text-slate-900">
                                                    ได้รับวุฒิบัตรรายวิชา + ปริญญาบัตรเมื่อสะสมครบ
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* TAB 4: FACULTY CREDIT COURSES */}
                        <TabsContent value="courses" className="space-y-6 mt-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        รายวิชาสะสมหน่วยกิตของคณะสังคมศาสตร์
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        หลักสูตรระยะสั้นที่ผ่านการรับรองเกณฑ์การวัดประเมินผลเทียบเคียงรายวิชา ป.ตรี
                                    </p>
                                </div>
                                <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5 shrink-0">
                                    <Link href="/academics/short-courses">
                                        <span>ดูแคตตาล็อกหลักสูตรระยะสั้นทั้งหมด</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((c) => {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                                    const imageSrc = c.coverImageUrl
                                        ? (c.coverImageUrl.startsWith('http') ? c.coverImageUrl : `${apiUrl}${c.coverImageUrl}`)
                                        : 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
                                    const targetUrl = c.lifelongUrl || 'https://lifelong.crru.ac.th/course';

                                    return (
                                        <Card key={c.id} className="border-amber-200/90 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                                                <Image
                                                    src={imageSrc}
                                                    alt={c.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    unoptimized={imageSrc.startsWith('http')}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                                                <div className="absolute top-2.5 right-2.5">
                                                    <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5">
                                                        เปิดรับสมัคร
                                                    </Badge>
                                                </div>
                                                <div className="absolute bottom-2.5 left-2.5">
                                                    <Badge className="bg-slate-950/90 text-amber-300 text-xs font-bold px-2.5 py-0.5 border border-amber-400/40 gap-1">
                                                        <Award className="w-3 h-3 text-amber-400" />
                                                        สะสม {c.creditBankValue} หน่วยกิต
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold uppercase">
                                                        <span>{c.category || 'หมวดสะสมหน่วยกิต'}</span>
                                                        {c.code && <span className="font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded">{c.code}</span>}
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{c.title}</h3>
                                                    {c.instructorName && (
                                                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                            <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                                                            <span className="truncate">{c.instructorName}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="pt-2.5 border-t border-slate-100 space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-slate-600">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-amber-600" />
                                                            {c.durationHours} ชม.
                                                        </span>
                                                        <span className="font-bold text-slate-900">
                                                            {Number(c.price) > 0 ? `฿${Number(c.price).toLocaleString()}` : 'ฟรี'}
                                                        </span>
                                                    </div>

                                                    <Button asChild size="sm" className="w-full text-xs font-bold h-8 bg-[#0B132B] hover:bg-slate-800 text-white">
                                                        <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                                                            <span>เข้าสู่บทเรียนบน Lifelong</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>

                    </Tabs>

                    {/* 3. Academic Advisory Footer Strip */}
                    <Card className="mt-10 border-slate-200 bg-white shadow-2xs">
                        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                        มีข้อสงสัยเกี่ยวกับการสะสมหน่วยกิตและการเทียบโอนประสบการณ์ (RPL)?
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        งานวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมให้คำแนะนำโครงสร้างหลักสูตรรายบุคคล
                                    </p>
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm" className="text-xs font-bold h-9 px-4 shrink-0">
                                <Link href="/contact" className="flex items-center gap-1.5">
                                    <span>ติดต่อฝ่ายวิชาการ</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>

            </div>
        </TooltipProvider>
    );
}
