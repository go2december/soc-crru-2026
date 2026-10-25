import Link from 'next/link';
import { Sparkles, GraduationCap, BookOpen, Calendar, ArrowDown, ExternalLink } from 'lucide-react';

interface AdmissionsHeroProps {
    bachelorLink: string;
    graduateLink: string;
    openRoundCount: number;
}

export default function AdmissionsHero({
    bachelorLink,
    graduateLink,
    openRoundCount,
}: AdmissionsHeroProps) {
    return (
        <section className="relative bg-[#0B132B] text-white overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-white/10">
            {/* Subtle Architectural Grid Background (No blurry blobs) */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Subtle Gradient Accent from top corner */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C2410C]/20 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="max-w-3xl space-y-6">
                    {/* Badge & Institutional Tag */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C2410C] text-white text-xs font-bold tracking-wider uppercase shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            รับสมัครตรง 2569
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold">
                            ไม่ต้องสอบ • ไม่ต้องยื่น TCAS
                        </span>
                        {openRoundCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                เปิดรับสมัคร {openRoundCount} รอบขณะนี้
                            </span>
                        )}
                    </div>

                    {/* Headline (Editorial Typographic Gravitas) */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-heading">
                        เปิดรับสมัครนักศึกษาใหม่ <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F59E0B] to-[#F97316]">
                            ระดับปริญญาตรี และ บัณฑิตศึกษา
                        </span>
                    </h1>

                    {/* Narrative Description */}
                    <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                        เปิดรับสมัครตรงโดยมหาวิทยาลัยราชภัฏเชียงราย <strong className="text-white font-semibold">ไม่ต้องสอบข้อเขียน ไม่ต้องยื่น TCAS และไม่มีสอบสัมภาษณ์</strong> ใช้เพียงหลักฐานผลการเรียน (GPAX) สมัครผ่านเกณฑ์แล้วรายงานตัวเข้าศึกษาได้ทันที พร้อมสิทธิ์ยื่นกู้ยืมกองทุน กยศ.
                    </p>

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                            href={bachelorLink || 'https://admission.crru.ac.th/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#a3360a] text-white font-bold text-sm tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <GraduationCap className="w-4 h-4 text-amber-200" />
                            <span>สมัครเรียนระดับปริญญาตรี</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>

                        <a
                            href={graduateLink || 'https://orasis.crru.ac.th/gds_crru/index.php/main/home'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm backdrop-blur-xs transition-all"
                        >
                            <BookOpen className="w-4 h-4 text-slate-300" />
                            <span>สมัครระดับบัณฑิตศึกษา</span>
                        </a>

                        <a
                            href="#schedules-table"
                            className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>ดูปฏิทินรอบรับสมัคร</span>
                            <ArrowDown className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* Institutional Key Highlights Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300">
                        <div>
                            <span className="block text-xl sm:text-2xl font-bold text-white font-heading">7 สาขาวิชา</span>
                            <span className="text-slate-400 text-xs">ครอบคลุมทุกมิติสังคมศาสตร์</span>
                        </div>
                        <div>
                            <span className="block text-xl sm:text-2xl font-bold text-amber-400 font-heading">กองทุน กยศ.</span>
                            <span className="text-slate-400 text-xs">มีสิทธิ์ยื่นกู้ยืมตามเกณฑ์</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <span className="block text-xl sm:text-2xl font-bold text-emerald-400 font-heading">Credit Bank</span>
                            <span className="text-slate-400 text-xs">สะสมหน่วยกิตล่วงหน้าได้</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
