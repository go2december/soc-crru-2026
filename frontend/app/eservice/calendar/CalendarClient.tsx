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
    isToday,
    parseISO
} from 'date-fns';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List,
    Clock,
    MapPin,
    Search,
    ExternalLink,
    CalendarPlus,
    X,
    RotateCw
} from 'lucide-react';
import { CalendarEvent } from '@/lib/calendar/ical-parser';

interface CalendarClientProps {
    initialEvents: CalendarEvent[];
}

const emptySubscribe = () => () => {};

// Official React 18/19 pattern to detect client hydration without cascading renders
function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

// Color tokens adhering to CRRU Palette and Purple Ban (No violet/purple)
const EVENT_COLOR_STYLES = [
    {
        bg: 'bg-red-50 dark:bg-red-950/50',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        dot: 'bg-red-500'
    },
    {
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        dot: 'bg-blue-500'
    },
    {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500'
    },
    {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-800 dark:text-amber-300',
        dot: 'bg-amber-500'
    },
    {
        bg: 'bg-cyan-50 dark:bg-cyan-950/50',
        border: 'border-cyan-200 dark:border-cyan-800',
        text: 'text-cyan-800 dark:text-cyan-300',
        dot: 'bg-cyan-500'
    }
];

function getEventStyle(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % EVENT_COLOR_STYLES.length;
    return EVENT_COLOR_STYLES[index];
}

function formatThaiMonthYear(date: Date) {
    const month = THAI_MONTHS[date.getMonth()];
    const yearBe = date.getFullYear() + 543;
    const yearCe = date.getFullYear();
    return `${month} ${yearBe} (${yearCe})`;
}

function formatThaiDateFull(date: Date) {
    return date.toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
    const title = encodeURIComponent(event.title || 'กิจกรรมสำนักวิชาสังคมศาสตร์');
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
    const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: Date; events: CalendarEvent[] } | null>(null);
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

    // Filter events by search query
    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) return events;
        const q = searchQuery.toLowerCase().trim();
        return events.filter(
            evt =>
                evt.title.toLowerCase().includes(q) ||
                (evt.description && evt.description.toLowerCase().includes(q)) ||
                (evt.location && evt.location.toLowerCase().includes(q))
        );
    }, [events, searchQuery]);

    // Grid days calculations
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const gridDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Events in current visible month for Agenda view
    const currentMonthEvents = useMemo(() => {
        return filteredEvents.filter(evt => {
            const d = parseISO(evt.start);
            return isSameMonth(d, currentMonth);
        });
    }, [filteredEvents, currentMonth]);

    // Navigation
    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
    const goToToday = () => setCurrentMonth(new Date());

    // Map events by day in Grid view
    const getEventsForDay = (day: Date) => {
        return filteredEvents.filter(evt => {
            const start = parseISO(evt.start);
            const end = parseISO(evt.end);

            if (isSameDay(start, day)) return true;
            if (evt.isAllDay && day >= start && day < end) return true;
            if (!evt.isAllDay && day >= start && day <= end) return true;
            return false;
        });
    };

    // Return clean skeleton during SSR to completely prevent hydration mismatch
    if (!isMounted) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Control Bar Skeleton */}
                <div className="bg-base-100 rounded-2xl p-4 sm:p-6 shadow-sm border border-base-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-28 bg-base-200 rounded-xl" />
                        <div className="h-7 w-48 bg-base-200 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="h-8 w-48 bg-base-200 rounded-lg flex-1 md:flex-initial" />
                        <div className="h-8 w-36 bg-base-200 rounded-xl" />
                    </div>
                </div>

                {/* Calendar Grid Skeleton */}
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden p-4">
                    <div className="grid grid-cols-7 gap-2 mb-3 text-center">
                        {THAI_DAYS_SHORT.map(d => (
                            <div key={d} className="h-6 bg-base-200/60 rounded font-medium text-xs flex items-center justify-center text-base-content/40">
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="min-h-[95px] sm:min-h-[125px] bg-base-200/40 rounded-xl border border-base-200/30 p-2 flex flex-col justify-between">
                                <div className="w-6 h-6 bg-base-200 rounded-full" />
                                {i % 4 === 0 && <div className="h-4 w-full bg-base-200/80 rounded" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Control & Filter Header */}
            <div className="bg-base-100 rounded-2xl p-4 sm:p-6 shadow-sm border border-base-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Month Title & Nav */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <div className="flex items-center rounded-xl bg-base-200/80 p-1 border border-base-300">
                            <button
                                onClick={prevMonth}
                                className="btn btn-ghost btn-sm btn-square"
                                aria-label="เดือนก่อนหน้า"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="btn btn-ghost btn-sm px-3 text-xs font-semibold"
                            >
                                วันนี้
                            </button>
                            <button
                                onClick={nextMonth}
                                className="btn btn-ghost btn-sm btn-square"
                                aria-label="เดือนถัดไป"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content font-heading">
                            {formatThaiMonthYear(currentMonth)}
                        </h2>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="btn btn-ghost btn-circle btn-sm"
                            title="รีเฟรชข้อมูลจาก Google Calendar"
                        >
                            <RotateCw className={`w-4 h-4 text-base-content/70 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Search & View Switcher */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {/* Search input */}
                        <div className="relative flex-1 sm:w-60">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="ค้นหากิจกรรม, สถานที่..."
                                className="input input-sm input-bordered w-full pl-9 rounded-lg text-sm bg-base-100"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* View Switcher Toggle */}
                        <div className="join bg-base-200/80 p-1 rounded-xl border border-base-300">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`join-item btn btn-sm border-none ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-content shadow-sm'
                                        : 'btn-ghost'
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4 mr-1.5" />
                                <span>ตารางเดือน</span>
                            </button>
                            <button
                                onClick={() => setViewMode('agenda')}
                                className={`join-item btn btn-sm border-none ${
                                    viewMode === 'agenda'
                                        ? 'bg-primary text-primary-content shadow-sm'
                                        : 'btn-ghost'
                                }`}
                            >
                                <List className="w-4 h-4 mr-1.5" />
                                <span>รายการ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Mode: Month Grid */}
            {viewMode === 'grid' ? (
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 border-b border-base-200 bg-base-200/40 text-center font-medium text-xs sm:text-sm text-base-content/70 py-3">
                        {THAI_DAYS_SHORT.map((dayName, idx) => (
                            <div
                                key={dayName}
                                className={idx === 0 ? 'text-red-600 font-semibold' : idx === 6 ? 'text-blue-600 font-semibold' : ''}
                            >
                                {dayName}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Matrix */}
                    <div className="grid grid-cols-7 auto-rows-fr divide-x divide-base-200 divide-y">
                        {gridDays.map(day => {
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isDayToday = isToday(day);
                            const dayEvents = getEventsForDay(day);

                            return (
                                <div
                                    key={day.toISOString()}
                                    onClick={() => {
                                        if (dayEvents.length > 0) {
                                            setSelectedDateEvents({ date: day, events: dayEvents });
                                        }
                                    }}
                                    className={`min-h-[95px] sm:min-h-[125px] p-1.5 sm:p-2 transition-colors flex flex-col justify-between ${
                                        isCurrentMonth ? 'bg-base-100 hover:bg-base-200/30' : 'bg-base-200/20 opacity-40'
                                    } ${dayEvents.length > 0 ? 'cursor-pointer' : ''}`}
                                >
                                    {/* Date Number Badge */}
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm rounded-full font-medium ${
                                                isDayToday
                                                    ? 'bg-primary text-primary-content font-bold shadow-sm'
                                                    : isCurrentMonth
                                                    ? 'text-base-content'
                                                    : 'text-base-content/40'
                                            }`}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                    </div>

                                    {/* Event Chips List */}
                                    <div className="space-y-1 flex-1 overflow-hidden">
                                        {dayEvents.slice(0, 3).map(evt => {
                                            const style = getEventStyle(evt.id);
                                            return (
                                                <button
                                                    key={evt.id}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setSelectedEvent(evt);
                                                    }}
                                                    className={`w-full text-left truncate text-[11px] sm:text-xs px-1.5 py-0.5 rounded border transition-transform hover:scale-[1.01] ${style.bg} ${style.border} ${style.text}`}
                                                    title={evt.title}
                                                >
                                                    <span className="font-medium truncate block">{evt.title}</span>
                                                </button>
                                            );
                                        })}

                                        {dayEvents.length > 3 && (
                                            <div className="text-[10px] text-base-content/60 font-semibold px-1">
                                                +{dayEvents.length - 3} รายการ
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* View Mode: Agenda / List */
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 sm:p-6">
                    {currentMonthEvents.length === 0 ? (
                        <div className="text-center py-16 text-base-content/60">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-lg font-medium">ไม่มีกิจกรรมในเดือนนี้</p>
                            <p className="text-sm mt-1">สามารถเปลี่ยนเดือนเพื่อดูกิจกรรมช่วงอื่น หรือค้นหากิจกรรมที่ต้องการ</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentMonthEvents.map(evt => {
                                const style = getEventStyle(evt.id);
                                const startDate = parseISO(evt.start);
                                return (
                                    <div
                                        key={evt.id}
                                        onClick={() => setSelectedEvent(evt)}
                                        className="group card bg-base-100 border border-base-200 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer overflow-hidden flex-col sm:flex-row"
                                    >
                                        {/* Date Ribbon */}
                                        <div
                                            className={`sm:w-28 flex flex-row sm:flex-col items-center justify-between sm:justify-center p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-base-200 ${style.bg}`}
                                        >
                                            <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
                                                {format(startDate, 'EEE')}
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-extrabold leading-none my-0 sm:my-1">
                                                {format(startDate, 'd')}
                                            </span>
                                            <span className="text-xs opacity-75 font-medium">
                                                {THAI_MONTHS[startDate.getMonth()]}
                                            </span>
                                        </div>

                                        {/* Content info */}
                                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">
                                                    {evt.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-base-content/70">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                                        {formatEventTime(evt.start, evt.end, evt.isAllDay)}
                                                    </span>
                                                    {evt.location && (
                                                        <span className="inline-flex items-center gap-1.5 text-base-content/80 font-medium">
                                                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                                            {evt.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {evt.description && (
                                                <p className="mt-3 text-xs sm:text-sm text-base-content/70 line-clamp-2">
                                                    {evt.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Quick Subscription / Google Calendar Link Banner */}
            <div className="card bg-base-200/60 border border-base-300">
                <div className="card-body p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm sm:text-base">ซิงค์ปฏิทินกับ Google Calendar หรือมือถือของคุณ</h4>
                            <p className="text-xs text-base-content/60">
                                ติดตามกำหนดการสอบและการประชุมสำนักวิชาสังคมศาสตร์ได้แบบ Real-time
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <a
                            href="https://calendar.google.com/calendar/u/0/r?cid=c_classroome6d5584c@group.calendar.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            เปิดใน Google Calendar
                        </a>
                        <a
                            href="https://calendar.google.com/calendar/ical/c_classroome6d5584c%40group.calendar.google.com/public/basic.ics"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm gap-2"
                        >
                            <CalendarPlus className="w-4 h-4" />
                            นำเข้า iCal (.ics)
                        </a>
                    </div>
                </div>
            </div>

            {/* Single Event Detail Modal */}
            {selectedEvent && (
                <div className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-lg p-6 relative">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                            aria-label="ปิด"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="badge badge-primary badge-sm">Google Calendar</span>
                            {selectedEvent.isAllDay && <span className="badge badge-ghost badge-sm">ตลอดวัน</span>}
                        </div>

                        <h3 className="font-bold text-xl text-base-content leading-snug">
                            {selectedEvent.title}
                        </h3>

                        <div className="space-y-3 mt-5 text-sm">
                            <div className="flex items-start gap-3 p-3 bg-base-200/60 rounded-xl">
                                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-medium text-xs text-base-content/60">วันและเวลา</div>
                                    <div className="text-base-content font-semibold mt-0.5">
                                        {formatEventTime(selectedEvent.start, selectedEvent.end, selectedEvent.isAllDay)}
                                    </div>
                                    <div className="text-xs text-base-content/60 mt-0.5">
                                        {formatThaiDateFull(parseISO(selectedEvent.start))}
                                    </div>
                                </div>
                            </div>

                            {selectedEvent.location && (
                                <div className="flex items-start gap-3 p-3 bg-base-200/60 rounded-xl">
                                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-xs text-base-content/60">สถานที่</div>
                                        <div className="text-base-content font-semibold mt-0.5">
                                            {selectedEvent.location}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedEvent.description && (
                                <div className="p-3 bg-base-200/40 rounded-xl border border-base-200">
                                    <div className="font-medium text-xs text-base-content/60 mb-1">
                                        รายละเอียดเพิ่มเติม (Description)
                                    </div>
                                    <p className="text-xs sm:text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Actions */}
                        <div className="modal-action mt-6 flex flex-col sm:flex-row gap-2">
                            <a
                                href={createGoogleCalendarUrl(selectedEvent)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm flex-1 gap-2"
                            >
                                <CalendarPlus className="w-4 h-4" />
                                เพิ่มลง Google Calendar ของฉัน
                            </a>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="btn btn-ghost btn-sm"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-black/40" onClick={() => setSelectedEvent(null)} />
                </div>
            )}

            {/* Date Events List Modal (When clicking a day cell on mobile or day with many events) */}
            {selectedDateEvents && !selectedEvent && (
                <div className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-md p-6 relative">
                        <button
                            onClick={() => setSelectedDateEvents(null)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                            aria-label="ปิด"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="font-bold text-lg text-base-content">
                            กิจกรรมประจำ{formatThaiDateFull(selectedDateEvents.date)}
                        </h3>
                        <p className="text-xs text-base-content/60 mt-0.5 mb-4">
                            พบ {selectedDateEvents.events.length} กิจกรรม
                        </p>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {selectedDateEvents.events.map(evt => {
                                const style = getEventStyle(evt.id);
                                return (
                                    <div
                                        key={evt.id}
                                        onClick={() => {
                                            setSelectedDateEvents(null);
                                            setSelectedEvent(evt);
                                        }}
                                        className={`p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${style.bg} ${style.border}`}
                                    >
                                        <div className={`font-semibold text-sm ${style.text}`}>{evt.title}</div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-base-content/70">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{formatEventTime(evt.start, evt.end, evt.isAllDay)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="modal-action mt-4">
                            <button
                                onClick={() => setSelectedDateEvents(null)}
                                className="btn btn-sm btn-ghost"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-black/40" onClick={() => setSelectedDateEvents(null)} />
                </div>
            )}
        </div>
    );
}
