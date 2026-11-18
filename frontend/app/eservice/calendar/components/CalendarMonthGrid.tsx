'use client';

import React from 'react';
import { isSameMonth, isToday, format } from 'date-fns';
import { CalendarEvent } from '@/lib/calendar/ical-parser';

interface EventCategoryStyle {
  badgeText: string;
  chipBg: string;
  listRibbon: string;
  badgeClass: string;
  dotColor: string;
}

interface CalendarMonthGridProps {
  gridDays: Date[];
  currentMonth: Date;
  getEventsForDay: (day: Date) => CalendarEvent[];
  getEventStyle: (title?: string) => EventCategoryStyle;
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDay: (day: Date, events: CalendarEvent[]) => void;
}

const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export default function CalendarMonthGrid({
  gridDays,
  currentMonth,
  getEventsForDay,
  getEventStyle,
  onSelectEvent,
  onSelectDay,
}: CalendarMonthGridProps) {
  return (
    <div className="bg-white border border-stone-200/90 rounded-sm shadow-xs overflow-hidden">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/80 text-center font-heading text-xs font-semibold uppercase tracking-wider text-slate-700">
        {THAI_DAYS_SHORT.map((day, idx) => (
          <div
            key={day}
            className={`py-2.5 px-1 border-r last:border-r-0 border-stone-200 ${
              idx === 0 ? 'text-rose-600' : idx === 6 ? 'text-amber-600' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-stone-200">
        {gridDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                if (dayEvents.length > 0) {
                  onSelectDay(day, dayEvents);
                }
              }}
              className={`min-h-[95px] sm:min-h-[120px] p-1.5 sm:p-2 transition-colors flex flex-col justify-between ${
                !isCurrentMonth
                  ? 'bg-stone-50/50 text-slate-300'
                  : 'bg-white hover:bg-stone-50/80'
              } ${dayEvents.length > 0 ? 'cursor-pointer' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-mono font-bold w-6 h-6 rounded-sm flex items-center justify-center ${
                    isCurrentDay
                      ? 'bg-primary text-white shadow-xs'
                      : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Chips List */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((evt) => {
                  const style = getEventStyle(evt.title);

                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className={`w-full text-left px-1.5 py-0.5 rounded-xs text-[10px] sm:text-[11px] font-medium leading-tight truncate block transition-transform active:scale-[0.98] ${style.chipBg}`}
                      title={evt.title}
                    >
                      {evt.title}
                    </button>
                  );
                })}

                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-primary font-semibold block text-center mt-0.5">
                    +{dayEvents.length - 3} เพิ่มเติม
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
