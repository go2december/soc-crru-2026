import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import {
    Award,
    ExternalLink,
    Clock,
    UserCheck,
    CheckCircle2,
    XCircle,
    ArrowRight,
    GraduationCap,
    BookOpen,
    Layers,
    ShieldCheck,
    ChevronRight,
    HelpCircle,
    Calendar,
    Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ระบบคลังหน่วยกิต (Credit Bank) | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description: 'เรียนรู้ตลอดชีวิต สะสมหน่วยกิต และเทียบโอนประสบการณ์สู่ปริญญาบัตรผ่านระบบคลังหน่วยกิต คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ร่วมกับ CRRU Lifelong Learning',
};

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

async function getFeaturedCreditCourses(): Promise<ShortCourse[]> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/short-courses?isCreditBank=true`, {
            next: { revalidate: 60 },
        });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch {
        // Fallback for SSR
    }
    return fallbackCourses;
}

export default async function CreditBankPage() {
    const featuredCourses = await getFeaturedCreditCourses();

    return (
        <div className="bg-white font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">

            {/* 1. Hero Section - Academic Editorial & Authority */}
            <section className="relative bg-[#071727] text-white pt-24 pb-20 border-b border-slate-800 overflow-hidden">
                {/* Structural Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumb items={[{ label: 'การจัดการศึกษา', href: '/academics/overview' }, { label: 'ระบบคลังหน่วยกิต (Credit Bank)' }]} />

                    <div className="max-w-4xl mt-8">
                        {/* Official Collaboration Tag */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-slate-800/80 border border-slate-700/80 text-xs font-semibold tracking-wide text-slate-200 mb-6 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span>ความร่วมมือทางวิชาการ: คณะสังคมศาสตร์ x สถาบันการเรียนรู้ตลอดชีวิต (CRRU Lifelong)</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
                            ระบบคลังหน่วยกิต <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">
                                Credit Bank System
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-3xl mb-10">
                            เปิดมิติการศึกษายุคใหม่ภายใต้แนวคิด <strong>"เรียนรู้ตลอดชีวิต สะสม เทียบโอนประสบการณ์ (RPL)"</strong> เพื่อให้บุคคลทุกช่วงวัย 
                            สามารถสะสมผลลัพธ์การเรียนรู้จากการอบรมหลักสูตรระยะสั้นและประสบการณ์ทำงานจริง 
                            นำไปเทียบโอนสู่ปริญญาบัตรของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href="#featured-courses"
                                className="px-6 py-3.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md inline-flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                เลือกหลักสูตรของคณะ
                            </a>
                            <a
                                href="#comparison-matrix"
                                className="px-6 py-3.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all inline-flex items-center gap-2"
                            >
                                ตารางเปรียบเทียบระบบ
                            </a>
                            <a
                                href="https://lifelong.crru.ac.th/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3.5 rounded-sm text-slate-400 hover:text-white font-medium text-sm transition-colors inline-flex items-center gap-1.5"
                            >
                                <span>ไปยัง CRRU Lifelong Portal</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* 4 Pillars Stat Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800/80">
                        <div className="border-l-2 border-amber-400 pl-4">
                            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">ระยะเวลาสะสม</div>
                            <div className="text-xl sm:text-2xl font-bold text-white mt-1">ไม่จำกัดเวลา</div>
                            <div className="text-xs text-slate-400 mt-0.5">สะสมได้ตลอดชีวิต ไม่ตัดหน่วยกิต</div>
                        </div>
                        <div className="border-l-2 border-amber-400 pl-4">
                            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">การเทียบโอน</div>
                            <div className="text-xl sm:text-2xl font-bold text-white mt-1">RPL Supported</div>
                            <div className="text-xs text-slate-400 mt-0.5">เทียบโอนประสบการณ์ทำงานจริง</div>
                        </div>
                        <div className="border-l-2 border-amber-400 pl-4">
                            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">วุฒิการศึกษา</div>
                            <div className="text-xl sm:text-2xl font-bold text-white mt-1">Dual Certificate</div>
                            <div className="text-xs text-slate-400 mt-0.5">ได้ทั้งวุฒิบัตรวิชาและปริญญาบัตร</div>
                        </div>
                        <div className="border-l-2 border-amber-400 pl-4">
                            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">การรับรอง</div>
                            <div className="text-xl sm:text-2xl font-bold text-white mt-1">สภามหาวิทยาลัย</div>
                            <div className="text-xs text-slate-400 mt-0.5">ตามเกณฑ์มาตรฐานกระทรวง อว.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Process Stepper (Roadmap สู่ปริญญาบัตร) */}
            <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
                            Step-by-Step Pathway
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            4 ขั้นตอนการสะสมหน่วยกิตสู่ปริญญาบัตร
                        </h2>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                            ขั้นตอนที่โปร่งใสและเป็นระบบ ตั้งแต่การสมัครสมาชิก การเข้าเรียนคอร์สระยะสั้น จนถึงการขอรับปริญญาบัตร
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                step: '01',
                                title: 'เปิดบัญชีคลังหน่วยกิต',
                                desc: 'สมัครสมาชิกในระบบ CRRU Lifelong Learning เพื่อรับสมุดบัญชีคลังหน่วยกิตส่วนบุคคล',
                                badge: 'เริ่มต้น'
                            },
                            {
                                step: '02',
                                title: 'เลือกเรียนหลักสูตรคณะ',
                                desc: 'ลงทะเบียนเรียนหลักสูตรระยะสั้นของคณะสังคมศาสตร์ ที่รองรับ Credit Bank ตามความสนใจ',
                                badge: 'Upskill / Reskill'
                            },
                            {
                                step: '03',
                                title: 'ประเมินผลและเทียบโอน',
                                desc: 'ผ่านการวัดผลตามเกณฑ์รายวิชา หรือยื่นเอกสารเทียบโอนประสบการณ์การทำงานจริง (RPL)',
                                badge: 'สะสมหน่วยกิต'
                            },
                            {
                                step: '04',
                                title: 'สำเร็จการศึกษา',
                                desc: 'เมื่อสะสมหน่วยกิตครบตามโครงสร้างหลักสูตร สามารถยื่นขอรับปริญญาบัตรศิลปศาสตรบัณฑิต',
                                badge: 'รับปริญญา'
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-slate-200 rounded-sm p-6 relative flex flex-col justify-between hover:border-slate-400 transition-all hover:shadow-sm"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl font-black font-mono text-slate-300">
                                            {item.step}
                                        </span>
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-xs leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700">
                                    <span>ระยะที่ {idx + 1}</span>
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Featured Courses Section (หลักสูตรสะสมหน่วยกิตของคณะ) */}
            <section id="featured-courses" className="py-20 bg-white border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
                                Faculty Course Catalog
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                หลักสูตรสะสมหน่วยกิตของคณะสังคมศาสตร์
                            </h2>
                            <p className="text-slate-600 text-sm mt-1">
                                เลือกเรียนคอร์สคุณภาพที่พัฒนาโดยคณาจารย์ผู้ทรงคุณวุฒิ พร้อมเข้าเรียนได้ทันทีบนระบบ CRRU Lifelong Learning
                            </p>
                        </div>
                        <Link
                            href="/academics/short-courses"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors uppercase tracking-wider flex-shrink-0"
                        >
                            <span>ดูหลักสูตรระยะสั้นทั้งหมด</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCourses.map((c) => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                            const imageSrc = c.coverImageUrl
                                ? (c.coverImageUrl.startsWith('http') ? c.coverImageUrl : `${apiUrl}${c.coverImageUrl}`)
                                : 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';

                            const targetUrl = c.lifelongUrl || 'https://lifelong.crru.ac.th/course';

                            return (
                                <div
                                    key={c.id}
                                    className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col justify-between hover:border-slate-400 transition-all hover:shadow-md group"
                                >
                                    {/* Cover Image */}
                                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                                        <Image
                                            src={imageSrc}
                                            alt={c.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            unoptimized={imageSrc.startsWith('http')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                                        {/* Status Tag */}
                                        <div className="absolute top-3 right-3">
                                            {c.status === 'OPEN' && (
                                                <span className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                                                    เปิดรับสมัคร
                                                </span>
                                            )}
                                            {c.status === 'COMING_SOON' && (
                                                <span className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-blue-600 text-white shadow-sm">
                                                    เร็วๆ นี้
                                                </span>
                                            )}
                                        </div>

                                        {/* Credit Badge */}
                                        <div className="absolute bottom-3 left-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-slate-900/90 text-amber-300 text-xs font-bold tracking-wide border border-amber-400/30">
                                                <Award className="w-3.5 h-3.5 text-amber-400" />
                                                สะสม {c.creditBankValue} หน่วยกิต
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                                                    {c.category || 'หลักสูตรสะสมหน่วยกิต'}
                                                </span>
                                                {c.code && (
                                                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                                        {c.code}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                                                {c.title}
                                            </h3>

                                            {c.instructorName && (
                                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                                    <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                    <span className="truncate">{c.instructorName}</span>
                                                </p>
                                            )}

                                            {c.description && (
                                                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-light">
                                                    {c.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {c.durationHours} ชั่วโมง
                                                </span>
                                                <span className="font-bold text-sm text-slate-900">
                                                    {Number(c.price) > 0 ? `฿${Number(c.price).toLocaleString()}` : 'ฟรี (ไม่มีค่าใช้จ่าย)'}
                                                </span>
                                            </div>

                                            <a
                                                href={targetUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full py-2.5 px-4 rounded-sm text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${c.status === 'OPEN'
                                                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                    }`}
                                            >
                                                <span>
                                                    {c.status === 'OPEN'
                                                        ? 'สมัครเรียน / เข้าสู่บทเรียน'
                                                        : 'ดูรายละเอียดบน Lifelong'}
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cross Link to General Catalog */}
                    <div className="mt-10 p-5 rounded-sm bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-amber-500/10 text-amber-700 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">
                                    สนใจหลักสูตรฝึกอบรมทักษะระยะสั้นทั่วไป (Non-degree)?
                                </h4>
                                <p className="text-xs text-slate-600 mt-0.5">
                                    ค้นหาหลักสูตร Upskill & Reskill เพื่อพัฒนาตนเองและงานอดิเรกโดยคณาจารย์คณะสังคมศาสตร์
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/academics/short-courses"
                            className="px-5 py-2.5 rounded-sm bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs whitespace-nowrap shadow-sm transition-all inline-flex items-center gap-2 flex-shrink-0"
                        >
                            <span>ดูแคตตาล็อกหลักสูตรทั้งหมด</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Comparison Matrix: ระบบการเรียนปกติ VS ระบบคลังหน่วยกิต */}
            <section id="comparison-matrix" className="py-20 bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
                            Academic Comparison
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            เปรียบเทียบการเรียนในระบบปกติ VS ระบบคลังหน่วยกิต (Credit Bank)
                        </h2>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                            ตารางเปรียบเทียบความแตกต่างเพื่อช่วยในการวางแผนเส้นทางการศึกษาที่ตอบโจทย์รูปแบบการใช้ชีวิตของคุณ
                        </p>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-sm bg-white shadow-sm">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-100/80 text-xs font-bold uppercase text-slate-700">
                                    <th className="p-4 w-1/4">มิติการจัดการศึกษา</th>
                                    <th className="p-4 w-3/8 text-slate-600">การศึกษาในระบบปกติ (Traditional)</th>
                                    <th className="p-4 w-3/8 bg-amber-50/70 text-slate-950 border-l border-amber-200">
                                        <div className="flex items-center gap-1.5 text-amber-800">
                                            <Award className="w-4 h-4" />
                                            <span>ระบบคลังหน่วยกิต (Credit Bank)</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs leading-relaxed">
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-900">คุณสมบัติผู้เรียน</td>
                                    <td className="p-4 text-slate-600">ต้องมีวุฒิ ม.6 หรือ ปวช. และผ่านการคัดเลือกเป็นนักศึกษา</td>
                                    <td className="p-4 bg-amber-50/30 border-l border-amber-100 font-semibold text-slate-900">
                                        เปิดกว้างสำหรับทุกคน ทุกวัย วัยทำงาน นักเรียน หรือผู้เกษียณอายุ
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-900">ความยืดหยุ่นของเวลา</td>
                                    <td className="p-4 text-slate-600">เรียนตามตารางสอนในภาคการศึกษาปกติ วันจันทร์–ศุกร์ หรือเสาร์–อาทิตย์</td>
                                    <td className="p-4 bg-amber-50/30 border-l border-amber-100 font-semibold text-slate-900">
                                        Anywhere, Anytime เรียนออนไลน์หรืออบรมระยะสั้นตามเวลาที่สะดวก
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-900">การเทียบโอนประสบการณ์ (RPL)</td>
                                    <td className="p-4 text-slate-600">จำกัดเฉพาะรายวิชาที่เคยลงทะเบียนเรียนในระดับอุดมศึกษา</td>
                                    <td className="p-4 bg-amber-50/30 border-l border-amber-100 font-semibold text-slate-900">
                                        เทียบโอนประสบการณ์ทำงานจริงและผลงานวิชาชีพ (RPL) เป็นหน่วยกิตได้
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-900">การชำระค่าธรรมเนียม</td>
                                    <td className="p-4 text-slate-600">ชำระค่าธรรมเนียมการศึกษาแบบเหมาจ่ายรายภาคการศึกษา</td>
                                    <td className="p-4 bg-amber-50/30 border-l border-amber-100 font-semibold text-slate-900">
                                        จ่ายเฉพาะค่าลงทะเบียนรายวิชาหรือคอร์สอบรมที่ต้องการเรียนรู้จริง
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-900">อายุการสะสมหน่วยกิต</td>
                                    <td className="p-4 text-slate-600">มีระยะเวลาการศึกษาตามเกณฑ์ (เช่น ปริญญาตรีไม่เกิน 8 ปี)</td>
                                    <td className="p-4 bg-amber-50/30 border-l border-amber-100 font-semibold text-emerald-800">
                                        สะสมได้ต่อเนื่อง ไม่จำกัดระยะเวลาการหมดอายุของหน่วยกิต
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-900">วุฒิการศึกษาที่ได้รับ</td>
                                    <td className="p-4 text-slate-600">ได้รับปริญญาบัตรเมื่อสำเร็จการศึกษาครบตามหลักสูตร</td>
                                    <td className="p-4 bg-amber-50/30 border-l border-amber-100 font-semibold text-slate-900">
                                        ได้รับวุฒิบัตรทุกวิชาที่จบ และได้รับปริญญาบัตรเมื่อสะสมครบเกณฑ์
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 5. Benefits & Institutional Credibility */}
            <section className="py-20 bg-white border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
                                Institutional Advantage
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
                                สิทธิประโยชน์และมาตรฐานทางวิชาการ
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-8">
                                คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ดำเนินการจัดการศึกษาตามแนวทางมาตรฐานการอุดมศึกษา 
                                เพื่อรองรับการพัฒนากำลังคนในยุคดิจิทัลและการเรียนรู้ตลอดชีวิตอย่างแท้จริง
                            </p>

                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'การรับรองมาตรฐานสภามหาวิทยาลัย',
                                        desc: 'หน่วยกิตที่สะสมได้รับการรับรองตามข้อบังคับมหาวิทยาลัยราชภัฏเชียงราย ว่าด้วยคลังหน่วยกิต'
                                    },
                                    {
                                        title: 'ลดระยะเวลาและค่าใช้จ่ายในการศึกษา',
                                        desc: 'เทียบโอนหน่วยกิตสะสมเพื่อลดระยะเวลาเรียนในมหาวิทยาลัย และประหยัดค่าใช้จ่ายได้สูงสุด'
                                    },
                                    {
                                        title: 'บูรณาการความรู้สู่การทำงานจริง',
                                        desc: 'หลักสูตรถูกออกแบบโดยเน้นสมรรถนะ (Competency-based) ตรงความต้องการของตลาดงาน'
                                    }
                                ].map((b, i) => (
                                    <div key={i} className="flex items-start gap-3.5 p-4 rounded-sm border border-slate-100 bg-slate-50/50">
                                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{b.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Card */}
                        <div className="border border-slate-200 rounded-sm p-8 bg-slate-900 text-white relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Academic Recognition</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    พร้อมก้าวสู่เส้นทางปริญญาบัตรด้วยตัวคุณเอง
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-light mb-8">
                                    ไม่ว่าคุณจะเป็นวัยทำงานที่ต้องการ Upskill ทักษะเฉพาะทาง หรือผู้ที่ต้องการเปลี่ยนสายอาชีพ 
                                    ระบบคลังหน่วยกิตของคณะสังคมศาสตร์พร้อมเป็นสะพานเชื่อมสู่ความสำเร็จทางวิชาการ
                                </p>

                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>ระดับการศึกษาที่รองรับ:</span>
                                        <span className="font-semibold text-white">ปริญญาตรี (ศศ.บ.)</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>ระบบบริหารบทเรียน:</span>
                                        <span className="font-semibold text-white">CRRU Lifelong Learning</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>การเทียบโอนผลการเรียนรู้:</span>
                                        <span className="font-semibold text-amber-400">RPL Portfolio Assessment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Academic Advisory Call To Action */}
            <section className="py-16 bg-[#071727] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                                Need Academic Guidance?
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">
                                ปรึกษาการสะสมหน่วยกิตและเทียบโอนประสบการณ์ (RPL)
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
                                งานวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย พร้อมให้คำปรึกษาในการเทียบโอนรายวิชา
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                            <Link
                                href="/contact"
                                className="px-5 py-3 rounded-sm bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs tracking-wide transition-colors"
                            >
                                ติดต่อฝ่ายวิชาการคณะ
                            </Link>
                            <a
                                href="https://lifelong.crru.ac.th/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition-colors inline-flex items-center gap-1.5"
                            >
                                <span>เข้าสู่ระบบ Lifelong</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
