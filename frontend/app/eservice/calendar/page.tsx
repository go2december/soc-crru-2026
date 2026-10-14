import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar as CalendarIcon, FileDown, ExternalLink, ArrowLeft } from 'lucide-react';
import { parseIcsContent, CalendarEvent } from '@/lib/calendar/ical-parser';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
    title: 'ปฏิทินวิชาการและกิจกรรม | สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description: 'ปฏิทินกิจกรรม วันสอบ และกำหนดการสำคัญของสำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ซิงค์สดจาก Google Calendar'
};

export const revalidate = 1800; // ISR cache every 30 minutes

const GOOGLE_CALENDAR_ICS_URL =
    'https://calendar.google.com/calendar/ical/c_classroome6d5584c%40group.calendar.google.com/public/basic.ics';

async function getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
        const response = await fetch(GOOGLE_CALENDAR_ICS_URL, {
            next: { revalidate: 1800 },
            headers: {
                'User-Agent': 'SOC-CRRU-Web/1.0 (+https://soc.crru.ac.th)'
            }
        });

        if (!response.ok) {
            console.error(`Google Calendar returned status ${response.status}`);
            return [];
        }

        const icsText = await response.text();
        return parseIcsContent(icsText);
    } catch (error) {
        console.error('Error fetching calendar data server-side:', error);
        return [];
    }
}

export default async function CalendarPage() {
    const events = await getCalendarEvents();

    return (
        <main className="min-h-screen bg-base-100 text-base-content pb-20">
            {/* Header Hero Section */}
            <section className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white py-14 px-4 shadow-sm relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center gap-2 text-rose-200 text-xs sm:text-sm mb-3">
                        <Link href="/eservice" className="hover:underline inline-flex items-center gap-1">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            บริการอิเล็กทรอนิกส์ (e-Services)
                        </Link>
                        <span>/</span>
                        <span className="text-white font-medium">ปฏิทินวิชาการและกิจกรรม</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
                                ปฏิทินวิชาการและกิจกรรม
                            </h1>
                            <p className="text-base sm:text-lg text-rose-100 mt-2 font-light">
                                Academic & Event Calendar — สำนักวิชาสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                            </p>
                        </div>

                        {/* Direct PDF Download / External Reg Link */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <a
                                href="https://reg.crru.ac.th"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                สำนักส่งเสริมวิชาการและงานทะเบียน
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Official Academic Calendar Banner */}
                <div className="card bg-base-200/80 border border-base-300 mb-8 shadow-sm">
                    <div className="card-body p-4 sm:p-6 sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base sm:text-lg text-base-content">
                                    ปฏิทินการศึกษา มหาวิทยาลัยราชภัฏเชียงราย
                                </h2>
                                <p className="text-xs sm:text-sm text-base-content/70 mt-0.5">
                                    กำหนดการเปิด-ปิดภาคเรียน การลงทะเบียน และวันสอบฉบับทางการ
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://reg.crru.ac.th"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm gap-2 w-full sm:w-auto"
                        >
                            <FileDown className="w-4 h-4" />
                            ดาวน์โหลดฉบับทางการ (PDF)
                        </a>
                    </div>
                </div>

                {/* Interactive Calendar Component */}
                <CalendarClient initialEvents={events} />
            </div>
        </main>
    );
}
