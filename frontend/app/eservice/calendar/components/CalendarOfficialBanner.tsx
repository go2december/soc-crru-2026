'use client';

import React from 'react';
import { Calendar as CalendarIcon, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarOfficialBanner() {
  return (
    <div className="bg-white border border-stone-200/90 rounded-sm p-5 sm:p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-sm bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0 border border-white/10 shadow-xs">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary block mb-0.5">
            OFFICIAL CRRU ACADEMIC SCHEDULE
          </span>
          <h2 className="font-bold text-base sm:text-lg font-heading text-slate-900 leading-snug">
            ปฏิทินการศึกษา มหาวิทยาลัยราชภัฏเชียงราย
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-light">
            กำหนดการเปิด-ปิดภาคเรียน การลงทะเบียนเรียน และตารางสอบไล่ประจำปีการศึกษา
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-sm border-stone-300 text-xs text-slate-700 hover:text-slate-900 font-medium gap-1.5 w-full sm:w-auto"
        >
          <a
            href="https://reg.crru.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5"
          >
            <span>สำนักส่งเสริมวิชาการและงานทะเบียน (REG)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </Button>

        <Button
          asChild
          size="sm"
          className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs font-medium gap-1.5 w-full sm:w-auto shadow-xs"
        >
          <a
            href="https://reg.crru.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดปฏิทินทางการ (PDF)</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
