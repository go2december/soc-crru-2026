/**
 * Lightweight RFC 5545 iCalendar (.ics) Parser
 * Zero external dependencies, robust and safe.
 */

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    location: string;
    start: string; // ISO 8601 string
    end: string;   // ISO 8601 string
    isAllDay: boolean;
    status?: string;
    googleCalendarUrl?: string;
}

/**
 * Parses iCalendar date string to Date object
 * Formats:
 * - 20260928 (Date only)
 * - 20250626T053000Z (UTC datetime)
 * - 20250626T123000 (Local datetime)
 */
function parseIcsDate(dateStr: string): { date: Date; isAllDay: boolean } {
    const cleanStr = dateStr.trim();

    // Check for Date-only format (YYYYMMDD)
    if (/^\d{8}$/.test(cleanStr)) {
        const year = parseInt(cleanStr.substring(0, 4), 10);
        const month = parseInt(cleanStr.substring(4, 6), 10) - 1;
        const day = parseInt(cleanStr.substring(6, 8), 10);
        return {
            date: new Date(year, month, day, 0, 0, 0),
            isAllDay: true
        };
    }

    // Check for DateTime format (YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ)
    const dtMatch = cleanStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
    if (dtMatch) {
        const [, y, m, d, hh, mm, ss, isUtc] = dtMatch;
        const year = parseInt(y, 10);
        const month = parseInt(m, 10) - 1;
        const day = parseInt(d, 10);
        const hour = parseInt(hh, 10);
        const minute = parseInt(mm, 10);
        const second = parseInt(ss, 10);

        if (isUtc) {
            return {
                date: new Date(Date.UTC(year, month, day, hour, minute, second)),
                isAllDay: false
            };
        } else {
            return {
                date: new Date(year, month, day, hour, minute, second),
                isAllDay: false
            };
        }
    }

    // Fallback to standard Date parse
    const fallback = new Date(cleanStr);
    return {
        date: isNaN(fallback.getTime()) ? new Date() : fallback,
        isAllDay: false
    };
}

/**
 * Unescapes RFC 5545 escaped characters in text fields
 */
function unescapeIcsText(text: string): string {
    if (!text) return '';
    return text
        .replace(/\\n/gi, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\')
        .trim();
}

/**
 * Parses raw .ics file text into array of CalendarEvents
 */
export function parseIcsContent(icsContent: string): CalendarEvent[] {
    if (!icsContent || !icsContent.includes('BEGIN:VCALENDAR')) {
        return [];
    }

    // RFC 5545 Line Unfolding: Remove CRLF followed by single space or tab
    const unfolded = icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
    const lines = unfolded.split(/\r\n|\n|\r/);

    const events: CalendarEvent[] = [];
    let insideEvent = false;
    let currentEvent: Partial<CalendarEvent> = {};
    let rawDtStart = '';
    let rawDtEnd = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line === 'BEGIN:VEVENT') {
            insideEvent = true;
            currentEvent = {
                title: 'ไม่มีชื่อกิจกรรม',
                description: '',
                location: '',
                isAllDay: false
            };
            rawDtStart = '';
            rawDtEnd = '';
            continue;
        }

        if (line === 'END:VEVENT') {
            if (insideEvent && rawDtStart) {
                const parsedStart = parseIcsDate(rawDtStart);
                const parsedEnd = rawDtEnd ? parseIcsDate(rawDtEnd) : parsedStart;

                // In ICS, an all-day event DTEND is exclusive.
                // If it spans 1 day, DTSTART=20260928, DTEND=20260929.
                const isAllDay = parsedStart.isAllDay;

                currentEvent.isAllDay = isAllDay;
                currentEvent.start = parsedStart.date.toISOString();
                currentEvent.end = parsedEnd.date.toISOString();
                if (!currentEvent.id) {
                    currentEvent.id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                }

                events.push(currentEvent as CalendarEvent);
            }
            insideEvent = false;
            currentEvent = {};
            continue;
        }

        if (!insideEvent) continue;

        // Extract key and value (handling parameters like DTSTART;VALUE=DATE:20260928)
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const propPart = line.substring(0, colonIndex);
        const valuePart = line.substring(colonIndex + 1);

        const propName = propPart.split(';')[0].toUpperCase();

        switch (propName) {
            case 'UID':
                currentEvent.id = valuePart;
                break;
            case 'SUMMARY':
                currentEvent.title = unescapeIcsText(valuePart);
                break;
            case 'DESCRIPTION':
                currentEvent.description = unescapeIcsText(valuePart);
                break;
            case 'LOCATION':
                currentEvent.location = unescapeIcsText(valuePart);
                break;
            case 'STATUS':
                currentEvent.status = valuePart;
                break;
            case 'DTSTART':
                rawDtStart = valuePart;
                break;
            case 'DTEND':
                rawDtEnd = valuePart;
                break;
        }
    }

    // Sort chronologically by start date
    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return events;
}
