'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent } from '@/lib/calendar/ical-parser';

interface EventCategoryStyle {
  badgeText: string;
  chipBg: string;
  listRibbon: string;
  badgeClass: string;
  dotColor: string;
}

interface CalendarAgendaListProps {
  events: CalendarEvent[];
  getEventStyle: (title?: string) => EventCategoryStyle;
  formatEventTime: (startIso: string, endIso: string, isAllDay: boolean) => string;
  onSelectEvent: (event: CalendarEvent) => void;
}

export default function CalendarAgendaList({
  events,
  getEventStyle,
  formatEventTime,
  onSelectEvent,
}: CalendarAgendaListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-sm p-12 text-center text-slate-400">
        <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
        <h3 className="text-base font-bold text-slate-700 font-heading">
          ไม่มีกำหนดการในเดือนหรือเงื่อนไขที่เลือก
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-light">
          ลองเปลี่ยนเดือน หรือคลิกปุ่ม &ldquo;วันนี้&rdquo; เพื่อดูกำหนดการล่าสุด
        </p>
      </div>
    );
  }

  // Sort events chronologically
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="space-y-3">
      {sorted.map((evt) => {
        const style = getEventStyle(evt.title);
        const startDate = parseISO(evt.start);
        const dayNum = format(startDate, 'dd');
        const monthShort = startDate.toLocaleDateString('th-TH', { month: 'short' });

        return (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="group bg-white border border-stone-200/90 hover:border-primary/50 rounded-sm p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
          >
            {/* Left: Date Ribbon + Event Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Date Box */}
              <div
                className={`w-14 h-14 rounded-sm flex flex-col items-center justify-center shrink-0 border border-black/5 shadow-2xs ${style.listRibbon}`}
              >
                <span className="text-lg font-bold font-mono leading-none">{dayNum}</span>
                <span className="text-[10px] font-medium uppercase mt-0.5">{monthShort}</span>
              </div>

              {/* Info Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${style.badgeClass}`}
                  >
                    {style.badgeText}
                  </span>

                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{formatEventTime(evt.start, evt.end, evt.isAllDay)}</span>
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                  {evt.title}
                </h3>

                {evt.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1 font-light">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right: Action */}
            <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 sm:border-0 w-full sm:w-auto flex items-center justify-end">
              <span className="text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                รายละเอียด
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
