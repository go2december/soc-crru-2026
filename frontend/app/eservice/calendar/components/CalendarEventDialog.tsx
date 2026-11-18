'use client';

import React from 'react';
import {
  Clock,
  MapPin,
  ExternalLink,
  CalendarPlus,
} from 'lucide-react';
import { CalendarEvent } from '@/lib/calendar/ical-parser';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EventCategoryStyle {
  badgeText: string;
  chipBg: string;
  listRibbon: string;
  badgeClass: string;
  dotColor: string;
}

interface CalendarEventDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getEventStyle: (title?: string) => EventCategoryStyle;
  formatEventTime: (startIso: string, endIso: string, isAllDay: boolean) => string;
  createGoogleCalendarUrl: (event: CalendarEvent) => string;
}

export default function CalendarEventDialog({
  event,
  open,
  onOpenChange,
  getEventStyle,
  formatEventTime,
  createGoogleCalendarUrl,
}: CalendarEventDialogProps) {
  if (!event) return null;

  const style = getEventStyle(event.title);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 rounded-sm border-stone-200 overflow-hidden">
        {/* Header Strip */}
        <div className={`p-6 text-white ${style.chipBg}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white border border-white/20">
              {style.badgeText}
            </span>
            {event.isAllDay && (
              <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded-sm">
                ALL-DAY EVENT
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white leading-snug">
            {event.title}
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Time & Location */}
          <div className="space-y-3 p-4 rounded-sm bg-stone-50 border border-stone-200/80 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  วันและเวลา
                </span>
                <span className="font-semibold text-slate-900">
                  {formatEventTime(event.start, event.end, event.isAllDay)}
                </span>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-200/70">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                    สถานที่
                  </span>
                  <span className="font-medium text-slate-800">{event.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-heading">
                รายละเอียดกำหนดการ
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <Button
              asChild
              size="sm"
              className="rounded-sm bg-primary hover:bg-[#9A3412] text-white text-xs font-medium gap-1.5 shadow-xs"
            >
              <a
                href={createGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>เพิ่มลง Google Calendar</span>
                <ExternalLink className="w-3 h-3 text-white/70" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-sm border-stone-300 text-xs"
            >
              ปิดหน้าต่าง
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
