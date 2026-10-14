import { NextResponse } from 'next/server';
import { parseIcsContent } from '@/lib/calendar/ical-parser';

export const revalidate = 1800; // Cache for 30 minutes (ISR)

const GOOGLE_CALENDAR_ICS_URL =
    'https://calendar.google.com/calendar/ical/c_classroome6d5584c%40group.calendar.google.com/public/basic.ics';

export async function GET() {
    try {
        const response = await fetch(GOOGLE_CALENDAR_ICS_URL, {
            next: { revalidate: 1800 },
            headers: {
                'User-Agent': 'SOC-CRRU-Web/1.0 (+https://soc.crru.ac.th)'
            }
        });

        if (!response.ok) {
            throw new Error(`Google Calendar returned HTTP status ${response.status}`);
        }

        const icsText = await response.text();
        const events = parseIcsContent(icsText);

        return NextResponse.json(
            {
                success: true,
                count: events.length,
                updatedAt: new Date().toISOString(),
                events
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
                }
            }
        );
    } catch (error) {
        console.error('Failed to fetch/parse Google Calendar feed:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'ไม่สามารถดึงข้อมูลปฏิทินจาก Google Calendar ได้ในขณะนี้',
                events: []
            },
            { status: 500 }
        );
    }
}
