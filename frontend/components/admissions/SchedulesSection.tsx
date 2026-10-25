'use client';

import { useState } from 'react';
import { CalendarDays, Clock, MapPin, ExternalLink, CalendarX, ArrowUpRight, Filter } from 'lucide-react';
import { AdmissionSchedule } from '@/lib/admissions';

interface SchedulesSectionProps {
    schedules: AdmissionSchedule[];
    tableTitle?: string;
}

function formatPeriod(period: string): string {
    if (!period) return '-';
    if (period.includes('|')) {
        const [s, e] = period.split('|');
        const fmt = (d: string) => {
            if (!d) return '';
            const dt = new Date(d);
            if (isNaN(dt.getTime())) return d;
            return dt.toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        };
        return `${fmt(s)} – ${fmt(e)}`;
    }
    return period;
}

const statusMeta: Record<AdmissionSchedule['status'], { label: string; badgeClass: string; dotClass: string }> = {
    OPEN: {
        label: 'กำลังเปิดรับสมัคร',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
        dotClass: 'bg-emerald-500 animate-pulse',
    },
    ALWAYS: {
        label: 'เปิดรับตลอดปี',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-300 font-bold',
        dotClass: 'bg-sky-500',
    },
    UPCOMING: {
        label: 'เร็วๆ นี้',
        badgeClass: 'bg-amber-50 text-amber-900 border-amber-300 font-medium',
        dotClass: 'bg-amber-500',
    },
    CLOSED: {
        label: 'ปิดรับสมัครแล้ว',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-300 font-normal',
        dotClass: 'bg-slate-400',
    },
};

export default function SchedulesSection({ schedules, tableTitle }: SchedulesSectionProps) {
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'UPCOMING'>('ALL');

    const filteredSchedules = schedules.filter((s) => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'OPEN') return s.status === 'OPEN' || s.status === 'ALWAYS';
        if (filterStatus === 'UPCOMING') return s.status === 'UPCOMING';
        return true;
    });

    const openCount = schedules.filter((s) => s.status === 'OPEN' || s.status === 'ALWAYS').length;

    return (
        <section id="schedules-table" className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B132B]/5 text-[#0B132B] text-xs font-semibold mb-2">
                        <CalendarDays className="w-3.5 h-3.5 text-[#C2410C]" />
                        ปฏิทินและกำหนดการ
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0B132B] font-heading">
                        {tableTitle || 'ตารางรอบรับสมัคร ประจำปีการศึกษา 2569'}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1">
                        ข้อมูลกำหนดการและช่องทางยื่นเอกสารการสมัคร อ้างอิงตามประกาศมหาวิทยาลัยราชภัฏเชียงราย
                    </p>
                </div>

                {/* Filter Pill Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setFilterStatus('ALL')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filterStatus === 'ALL'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        ทั้งหมด ({schedules.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('OPEN')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            filterStatus === 'OPEN'
                                ? 'bg-white text-emerald-800 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        เปิดรับสมัคร ({openCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('UPCOMING')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filterStatus === 'UPCOMING'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        เร็วๆ นี้
                    </button>
                </div>
            </div>

            {/* Container for Desktop Table & Mobile Cards */}
            {filteredSchedules.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
                    {/* Desktop Table View (Hidden on mobile) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0B132B] text-white text-xs uppercase tracking-wider font-heading">
                                    <th className="py-3.5 px-6 font-semibold w-2/5">รอบการรับสมัคร</th>
                                    <th className="py-3.5 px-6 font-semibold w-1/4">ช่วงเวลารับสมัคร</th>
                                    <th className="py-3.5 px-6 font-semibold">ช่องทางการสมัคร</th>
                                    <th className="py-3.5 px-6 font-semibold text-right">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredSchedules.map((sch) => {
                                    const meta = statusMeta[sch.status] || statusMeta.UPCOMING;
                                    const isOpen = sch.status === 'OPEN' || sch.status === 'ALWAYS';
                                    return (
                                        <tr
                                            key={sch.id}
                                            className={`transition-colors hover:bg-slate-50/80 ${
                                                isOpen ? 'bg-emerald-50/25' : ''
                                            }`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-[#0B132B]">{sch.roundName}</div>
                                                {sch.description && (
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                        {sch.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-slate-700 font-medium text-xs sm:text-sm">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {formatPeriod(sch.period)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {sch.link ? (
                                                    <a
                                                        href={sch.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#C2410C] hover:underline font-semibold text-xs sm:text-sm inline-flex items-center gap-1"
                                                    >
                                                        <span>{sch.channel}</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-700 text-xs sm:text-sm">
                                                        {sch.channel}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border ${meta.badgeClass}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                                                    {meta.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card-List View (Shown on mobile only, solves overflow usability) */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredSchedules.map((sch) => {
                            const meta = statusMeta[sch.status] || statusMeta.UPCOMING;
                            const isOpen = sch.status === 'OPEN' || sch.status === 'ALWAYS';
                            return (
                                <div
                                    key={sch.id}
                                    className={`p-4 space-y-2.5 ${isOpen ? 'bg-emerald-50/30' : 'bg-white'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-[#0B132B] text-sm leading-snug">
                                            {sch.roundName}
                                        </h3>
                                        <span
                                            className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full border ${meta.badgeClass}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                                            {meta.label}
                                        </span>
                                    </div>

                                    {sch.description && (
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {sch.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span>{formatPeriod(sch.period)}</span>
                                        </div>

                                        {sch.link ? (
                                            <a
                                                href={sch.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#C2410C] font-semibold flex items-center gap-1 hover:underline"
                                            >
                                                <span>{sch.channel}</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </a>
                                        ) : (
                                            <span className="text-slate-600">{sch.channel}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                    <CalendarX className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-slate-700 font-medium text-sm">
                        ไม่พบรอบการรับสมัครที่ตรงกับตัวกรองที่เลือก
                    </p>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('ALL')}
                        className="text-xs text-[#C2410C] font-semibold hover:underline"
                    >
                        รีเซ็ตเพื่อดูทุกรอบรับสมัคร
                    </button>
                </div>
            )}
        </section>
    );
}
