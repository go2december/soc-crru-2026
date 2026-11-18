import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { parseIcsContent, CalendarEvent } from '@/lib/calendar/ical-parser';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'ปฏิทินวิชาการและกิจกรรม | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  description:
    'ปฏิทินกิจกรรม วันสอบ และกำหนดการสำคัญของคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ซิงค์สดจาก Google Calendar',
  alternates: {
    canonical: '/eservice/calendar',
  },
  openGraph: {
    title: 'ปฏิทินวิชาการและกิจกรรม | คณะสังคมศาสตร์ มรภ.เชียงราย',
    description:
      'กำหนดการเปิด-ปิดภาคเรียน วันสอบ การประชุม และกิจกรรมวิชาการ คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    url: '/eservice/calendar',
    type: 'website',
    locale: 'th_TH',
    siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
  },
};

export const revalidate = 1800; // ISR cache every 30 minutes

const GOOGLE_CALENDAR_ICS_URL =
  'https://calendar.google.com/calendar/ical/c_classroome6d5584c%40group.calendar.google.com/public/basic.ics';

async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(GOOGLE_CALENDAR_ICS_URL, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'SOC-CRRU-Web/1.0 (+https://soc.crru.ac.th)',
      },
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

  // Schema.org Structured Data
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ปฏิทินวิชาการและกิจกรรม คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    description:
      'ศูนย์รวมกำหนดการทางวิชาการ วันสอบ การประชุม และกิจกรรม คณะสังคมศาสตร์ มรภ.เชียงราย',
    url: 'https://soc.crru.ac.th/eservice/calendar',
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      url: 'https://soc.crru.ac.th',
    },
    hasPart: events.slice(0, 15).map((e) => ({
      '@type': 'Event',
      name: e.title,
      startDate: e.start,
      endDate: e.end,
      description: e.description || '',
      location: {
        '@type': 'Place',
        name: e.location || 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
      },
    })),
  };

  return (
    <div className="bg-stone-50/50 min-h-screen font-sans text-slate-800">
      <JsonLd data={jsonLdSchema} />
      <CalendarClient initialEvents={events} />
    </div>
  );
}
