import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getAcademicPositionAbbr(nameTh: string | null | undefined): string | null {
    if (!nameTh) return null;

    // 1. Extract from parentheses if available, e.g. "ผู้ช่วยศาสตราจารย์ (ผศ.)" -> "ผศ."
    const match = nameTh.match(/\((.*?)\)/);
    if (match && match[1]) {
        return match[1].trim();
    }

    // 2. Fallback to predefined mapping
    const map: Record<string, string> = {
        'ศาสตราจารย์': 'ศ.',
        'รองศาสตราจารย์': 'รศ.',
        'ผู้ช่วยศาสตราจารย์': 'ผศ.',
        'อาจารย์': 'อ.',
        'lecturer': 'Lect.',
        'assistant professor': 'Asst. Prof.',
        'associate professor': 'Assoc. Prof.',
        'professor': 'Prof.',
    };
    const lower = nameTh.toLowerCase();
    for (const [key, abbr] of Object.entries(map)) {
        if (lower.includes(key.toLowerCase())) return abbr;
    }
    return nameTh.length > 6 ? nameTh.substring(0, 4) + '.' : nameTh;
}

/**
 * รูปแบบมาตรฐานสำหรับการแสดงชื่อบุคลากร (Memorized Format)
 * 1. ตำแหน่งทางวิชาการ (ตัวย่อในวงเล็บทั้งหมด) มาวางก่อนแบบ ไม่เว้นวรรค
 * 2. ตามด้วย คำนำหน้า (Prefix)
 * 3. จากนั้นจึงเป็น เว้นวรรค + ชื่อ + เว้นวรรค + นามสกุล
 */
export function formatStaffName(staff: {
    academicPositionNameTh?: string | null;
    prefixTh?: string | null;
    firstNameTh?: string | null;
    lastNameTh?: string | null;
}): string {
    const positionAbbr = getAcademicPositionAbbr(staff.academicPositionNameTh);
    const titlePart = [positionAbbr, staff.prefixTh].filter(Boolean).join('');
    return [titlePart, staff.firstNameTh, staff.lastNameTh].filter(Boolean).join(' ');
}
