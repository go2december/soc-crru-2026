'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, FileCheck, UserCheck, GraduationCap, Clock, HelpCircle } from 'lucide-react';
import { AdmissionSchedule } from '@/lib/admissions';

interface DirectAdmissionStepsProps {
    schedules: AdmissionSchedule[];
    bachelorLink: string;
}

interface StepItem {
    step: number;
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    actionLabel?: string;
}

const ADMISSION_STEPS: StepItem[] = [
    {
        step: 1,
        title: 'เลือกสาขาวิชาที่สนใจ',
        subtitle: 'สำรวจ 7 สาขาวิชาคุณภาพ',
        description: 'เลือกสาขาที่ตรงกับเป้าหมายอาชีพของคุณ มีทั้งหลักสูตร 4 ปีปกติ และเทียบโอน 2 ปี (สำหรับผู้จบ ปวส.)',
        highlights: [
            'ม.6 / ปวช. / กศน. สมัครได้ทุกสาขา',
            'เทียบโอน ปวส. เรียนต่อ 2 ปี',
            'มีทั้งภาคปกติ และภาคเสาร์-อาทิตย์ (สำหรับคนทำงาน)',
        ],
        actionLabel: 'ดูข้อมูล 7 สาขาวิชา',
    },
    {
        step: 2,
        title: 'ยื่นใบสมัครตรงออนไลน์',
        subtitle: 'ไม่ต้องสอบ • ไม่ต้องยื่น TCAS',
        description: 'กรอกข้อมูลสมัครออนไลน์ผ่านระบบรับสมัครตรงของมหาวิทยาลัยราชภัฏเชียงราย ไม่ต้องผ่านระบบ mytcas.com และไม่ต้องใช้คะแนน TGAT/TPAT/A-Level',
        highlights: [
            'สมัครออนไลน์ได้ตลอด 24 ชั่วโมง',
            'ไม่ต้องใช้คะแนนสอบกลางใดๆ',
            'ค่าสมัครตามระเบียบมหาวิทยาลัย',
        ],
        actionLabel: 'กรอกใบสมัครออนไลน์',
    },
    {
        step: 3,
        title: 'ตรวจสอบคุณสมบัติ & เอกสาร',
        subtitle: 'ใช้เพียงใบผลการเรียน (GPAX) • ไม่มีสอบสัมภาษณ์',
        description: 'แนบสำเนาหลักฐานการศึกษา (ใบ ปพ.1 หรือ Transcript) ตรวจสอบคุณสมบัติตามเกณฑ์ที่สาขาวิชากำหนด โดยไม่มีการสอบสัมภาษณ์',
        highlights: [
            'พิจารณาจากผลการเรียน (GPAX)',
            'ไม่มีการสอบสัมภาษณ์',
            'ตรวจสอบคุณสมบัติสะดวกรวดเร็ว',
        ],
    },
    {
        step: 4,
        title: 'รายงานตัว & สิทธิ์กู้ยืม กยศ.',
        subtitle: 'ยืนยันสิทธิ์ขึ้นทะเบียนนักศึกษาใหม่',
        description: 'รายงานตัวขึ้นทะเบียนเป็นนักศึกษาใหม่ตามกำหนดการ พร้อมรับคำปรึกษาและยื่นกู้ยืมกองทุน กยศ. ตามระเบียบและหลักเกณฑ์ที่กองทุนกำหนด',
        highlights: [
            'มีสิทธิ์ยื่นกู้ยืม กยศ. ตามเกณฑ์กองทุน',
            'มีทุนการศึกษาคณะสนับสนุน',
            'รับรหัสนักศึกษาและเตรียมเปิดภาคเรียน',
        ],
    },
];

export default function DirectAdmissionSteps({ schedules, bachelorLink }: DirectAdmissionStepsProps) {
    const [selectedStep, setSelectedStep] = useState<number>(2);

    const activeSchedule = schedules.find((s) => s.status === 'OPEN' || s.status === 'ALWAYS');
    const current = ADMISSION_STEPS.find((s) => s.step === selectedStep) || ADMISSION_STEPS[1];

    return (
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header with Direct Admission Highlights */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        ระบบรับสมัครตรง (Direct Admission)
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0B132B] font-heading">
                        สมัครง่าย 4 ขั้นตอน ไม่ต้องสอบข้อเขียน • ไม่มีสอบสัมภาษณ์ • ไม่ต้องยื่น TCAS
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                        คณะสังคมศาสตร์เปิดรับสมัครบุคคลเข้าศึกษาต่อโดยตรง พิจารณาจากผลการเรียน (GPAX) และรายงานตัวเข้าศึกษาได้ทันที
                    </p>
                </div>

                {activeSchedule && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>รอบปัจจุบัน: {activeSchedule.roundName}</span>
                    </div>
                )}
            </div>

            {/* Direct Admission Advantage Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-gradient-to-r from-[#0B132B] to-[#1e293b] text-white text-xs">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C2410C] text-white flex items-center justify-center shrink-0 font-bold">
                        1
                    </div>
                    <div>
                        <div className="font-bold text-amber-300 text-sm">ไม่ต้องสอบข้อเขียน</div>
                        <div className="text-slate-300 text-[11px]">ไม่ใช้คะแนน TGAT, TPAT, A-Level</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C2410C] text-white flex items-center justify-center shrink-0 font-bold">
                        2
                    </div>
                    <div>
                        <div className="font-bold text-amber-300 text-sm">ไม่ต้องยื่น TCAS</div>
                        <div className="text-slate-300 text-[11px]">สมัครตรงกับมหาวิทยาลัยได้ทันที</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C2410C] text-white flex items-center justify-center shrink-0 font-bold">
                        3
                    </div>
                    <div>
                        <div className="font-bold text-emerald-400 text-sm">ไม่มีสอบสัมภาษณ์</div>
                        <div className="text-slate-300 text-[11px]">พิจารณาจาก GPAX แล้วรายงานตัวได้เลย</div>
                    </div>
                </div>
            </div>

            {/* Step Selection Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {ADMISSION_STEPS.map((item) => {
                    const isSelected = selectedStep === item.step;
                    return (
                        <button
                            key={item.step}
                            type="button"
                            onClick={() => setSelectedStep(item.step)}
                            className={`p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer relative ${
                                isSelected
                                    ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-md ring-2 ring-[#C2410C]/30'
                                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={`text-xs font-black tracking-widest px-2 py-0.5 rounded ${
                                        isSelected
                                            ? 'bg-[#C2410C] text-white'
                                            : 'bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    STEP {item.step}
                                </span>
                                {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                                )}
                            </div>
                            <h3 className={`font-bold text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {item.title}
                            </h3>
                            <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                {item.subtitle}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Selected Step Detail Box */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-1 bg-[#0B132B] text-white rounded-md">
                            ขั้นตอนที่ {current.step}: {current.title}
                        </span>
                        <span className="text-xs text-[#C2410C] font-semibold">
                            {current.subtitle}
                        </span>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed font-normal">
                        {current.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-xs font-semibold text-slate-500">ข้อมูลสำคัญ:</span>
                        {current.highlights.map((h, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs font-medium"
                            >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {h}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                    <a
                        href={bachelorLink || 'https://admission.crru.ac.th/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 rounded-lg bg-[#C2410C] hover:bg-[#9a3412] text-white text-xs font-bold tracking-wide transition-all shadow-sm"
                    >
                        <span>เข้าสู่ระบบรับสมัครตรง</span>
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
