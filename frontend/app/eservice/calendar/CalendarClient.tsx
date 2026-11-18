'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { CalendarEvent } from '@/lib/calendar/ical-parser';
import CalendarHero from './components/CalendarHero';
import CalendarOfficialBanner from './components/CalendarOfficialBanner';
import CalendarControlBar from './components/CalendarControlBar';
import CalendarMonthGrid from './components/CalendarMonthGrid';
import CalendarAgendaList from './components/CalendarAgendaList';
import CalendarEventDialog from './components/CalendarEventDialog';

interface CalendarClientProps {
  initialEvents: CalendarEvent[];
}

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

interface EventCategoryStyle {
  badgeText: string;
  chipBg: string;
  listRibbon: string;
  badgeClass: string;
  dotColor: string;
}

function getEventStyle(title: string = ''): EventCategoryStyle {
  const t = (title || '').toLowerCase();

  if (t.includes('สอบ') || t.includes('exam') || t.includes('คะแนน') || t.includes('เกรด')) {
    return {
      badgeText: 'การสอบ / วัดผล',
      chipBg: 'bg-rose-700 hover:bg-rose-800 text-white shadow-2xs',
      listRibbon: 'bg-rose-700 text-white',
      badgeClass: 'bg-rose-50 text-rose-800 border border-rose-200',
      dotColor: 'bg-rose-500',
    };
  }

  if (t.includes('ประชุม') || t.includes('meeting') || t.includes('office') || t.includes('คณะกรรมการ')) {
    return {
      badgeText: 'การประชุม',
      chipBg: 'bg-slate-800 hover:bg-slate-900 text-white shadow-2xs',
      listRibbon: 'bg-slate-800 text-white',
      badgeClass: 'bg-stone-100 text-slate-800 border border-stone-300',
      dotColor: 'bg-slate-500',
    };
  }

  if (t.includes('อบรม') || t.includes('สัมมนา') || t.includes('workshop') || t.includes('โครงการ') || t.includes('พัฒนา') || t.includes('ทักษะ')) {
    return {
      badgeText: 'อบรม / โครงการ',
      chipBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs',
      listRibbon: 'bg-amber-600 text-white',
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
      dotColor: 'bg-amber-500',
    };
  }

  if (t.includes('กิจกรรม') || t.includes('วันสำคัญ') || t.includes('สถาปนา') || t.includes('ประกวด') || t.includes('รำลึก')) {
    return {
      badgeText: 'กิจกรรม / วันสำคัญ',
      chipBg: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs',
      listRibbon: 'bg-emerald-700 text-white',
      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      dotColor: 'bg-emerald-500',
    };
  }

  // Default / Academic
  return {
    badgeText: 'วิชาการ / ทั่วไป',
    chipBg: 'bg-primary hover:bg-[#9A3412] text-white shadow-2xs',
    listRibbon: 'bg-primary text-white',
    badgeClass: 'bg-orange-50 text-primary border border-orange-200',
    dotColor: 'bg-primary',
  };
}

function formatThaiMonthYear(date: Date) {
  const month = THAI_MONTHS[date.getMonth()];
  const yearBe = date.getFullYear() + 543;
  return `${month} พ.ศ. ${yearBe}`;
}

function formatThaiDateFull(date: Date) {
  return date.toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatEventTime(startIso: string, endIso: string, isAllDay: boolean) {
  if (isAllDay) {
    return 'ตลอดทั้งวัน (All-day)';
  }

  const startDate = new Date(startIso);
  const endDate = new Date(endIso);

  const startTime = startDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  if (isSameDay(startDate, endDate)) {
    return `${startTime} - ${endTime} น.`;
  }

  return `${formatThaiDateFull(startDate)} ${startTime} น. - ${formatThaiDateFull(endDate)} ${endTime} น.`;
}

function createGoogleCalendarUrl(event: CalendarEvent): string {
  const title = encodeURIComponent(event.title || 'กิจกรรมคณะสังคมศาสตร์');
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');

  const startObj = new Date(event.start);
  const endObj = new Date(event.end);

  const formatDateForGCal = (d: Date, isAllDay: boolean) => {
    if (isAllDay) {
      return format(d, 'yyyyMMdd');
    }
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dates = `${formatDateForGCal(startObj, event.isAllDay)}/${formatDateForGCal(endObj, event.isAllDay)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export default function CalendarClient({ initialEvents }: CalendarClientProps) {
  const isMounted = useMounted();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh events from /api/calendar
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/calendar', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to reload calendar data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenEventDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleSelectDay = (_day: Date, dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 1) {
      handleOpenEventDialog(dayEvents[0]);
    } else if (dayEvents.length > 1) {
      // In grid view, click on day with multiple events switches to agenda or opens first
      handleOpenEventDialog(dayEvents[0]);
    }
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase().trim();
    return events.filter(
      (evt) =>
        evt.title.toLowerCase().includes(q) ||
        (evt.description && evt.description.toLowerCase().includes(q)) ||
        (evt.location && evt.location.toLowerCase().includes(q))
    );
  }, [events, searchQuery]);

  // Calculations for month stats
  const stats = useMemo(() => {
    const totalEventsCount = events.length;
    let examEventsCount = 0;
    let meetingEventsCount = 0;
    let trainingEventsCount = 0;

    for (const evt of events) {
      const t = evt.title.toLowerCase();
      if (t.includes('สอบ') || t.includes('exam')) examEventsCount++;
      else if (t.includes('ประชุม') || t.includes('meeting')) meetingEventsCount++;
      else if (t.includes('อบรม') || t.includes('สัมมนา') || t.includes('โครงการ')) trainingEventsCount++;
    }

    return {
      totalEventsCount,
      examEventsCount,
      meetingEventsCount,
      trainingEventsCount,
    };
  }, [events]);

  // Grid days calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const gridDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Events in current visible month for Agenda view
  const currentMonthEvents = useMemo(() => {
    return filteredEvents.filter((evt) => {
      const d = parseISO(evt.start);
      return isSameMonth(d, currentMonth);
    });
  }, [filteredEvents, currentMonth]);

  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter((evt) => {
      const start = parseISO(evt.start);
      const end = parseISO(evt.end);

      if (isSameDay(start, day)) return true;
      if (evt.isAllDay && day >= start && day < end) return true;
      if (!evt.isAllDay && day >= start && day <= end) return true;
      return false;
    });
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 max-w-7xl pt-10 pb-20 font-sans animate-pulse">
        <div className="h-64 bg-stone-200/60 rounded-sm mb-6" />
        <div className="h-96 bg-stone-100 rounded-sm" />
      </div>
    );
  }

  return (
    <>
      {/* 1. HERO SECTION (Editorial Lanna + Quick Stats Ribbon) */}
      <CalendarHero
        totalEventsCount={stats.totalEventsCount}
        examEventsCount={stats.examEventsCount}
        meetingEventsCount={stats.meetingEventsCount}
        trainingEventsCount={stats.trainingEventsCount}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="container mx-auto px-4 max-w-7xl pt-10 pb-20 relative z-10 font-sans">
        {/* 2.1 Official Academic Schedule Banner */}
        <CalendarOfficialBanner />

        {/* 2.2 Calendar Control Bar */}
        <CalendarControlBar
          currentMonthLabel={formatThaiMonthYear(currentMonth)}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onGoToToday={goToToday}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          totalFilteredCount={filteredEvents.length}
        />

        {/* 2.3 Dual Mode View (Monthly Grid vs Agenda List) */}
        {viewMode === 'grid' ? (
          <CalendarMonthGrid
            gridDays={gridDays}
            currentMonth={currentMonth}
            getEventsForDay={getEventsForDay}
            getEventStyle={getEventStyle}
            onSelectEvent={handleOpenEventDialog}
            onSelectDay={handleSelectDay}
          />
        ) : (
          <CalendarAgendaList
            events={currentMonthEvents}
            getEventStyle={getEventStyle}
            formatEventTime={formatEventTime}
            onSelectEvent={handleOpenEventDialog}
          />
        )}

        {/* 2.4 Event Details Dialog */}
        <CalendarEventDialog
          event={selectedEvent}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          getEventStyle={getEventStyle}
          formatEventTime={formatEventTime}
          createGoogleCalendarUrl={createGoogleCalendarUrl}
        />
      </main>
    </>
  );
}
