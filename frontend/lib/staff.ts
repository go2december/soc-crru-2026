/**
 * Shared Utilities for Staff and Researcher Profiles
 * Provides consistent formatting for academic titles, names, and Webometrics links.
 */

export interface StaffNameFields {
    prefixTh?: string | null;
    firstNameTh: string;
    lastNameTh: string;
    prefixEn?: string | null;
    firstNameEn?: string | null;
    lastNameEn?: string | null;
    academicPosition?: string | null;
}

/**
 * Extract academic title abbreviation
 * e.g. "ผู้ช่วยศาสตราจารย์ (ผศ.)" -> "ผศ."
 * e.g. "อาจารย์ (อ.)" -> "อาจารย์"
 */
export const getAcademicAbbr = (position: string | null | undefined): string => {
    if (!position) return '';
    if (position.includes('ผู้ช่วยศาสตราจารย์')) return 'ผศ.';
    if (position.includes('รองศาสตราจารย์')) return 'รศ.';
    if (position.includes('ศาสตราจารย์')) return 'ศ.';
    if (position.includes('อาจารย์')) return 'อาจารย์';
    return position.trim();
};

/**
 * Formats full Thai name with academic title according to standard rules:
 * - Option A for Doctoral Lecturers: "อาจารย์ ดร. [ชื่อ นามสกุล]"
 * - Standard academic ranks: "ผศ.ดร. [ชื่อ นามสกุล]", "รศ.ดร. [ชื่อ นามสกุล]"
 * - Deduplication: Prevents double prefixes like "ผศ.ผศ.ดร."
 */
export const getFullName = (staff: {
    prefixTh?: string | null;
    firstNameTh: string;
    lastNameTh: string;
    academicPosition?: string | null;
}): string => {
    const acadPos = getAcademicAbbr(staff.academicPosition);
    const prefix = (staff.prefixTh || '').trim();
    const name = `${staff.firstNameTh} ${staff.lastNameTh}`.trim();

    // ป้องกันกรณีที่ prefix ในฐานข้อมูลมีตำแหน่งวิชาการอยู่แล้ว (เช่น "ผศ.ดร." หรือ "อาจารย์ ดร.")
    if (acadPos && prefix.includes(acadPos)) {
        return `${prefix}${name}`;
    }

    if (acadPos && prefix) {
        // Option A: อาจารย์ + ดร. -> "อาจารย์ ดร. [ชื่อ นามสกุล]"
        if (acadPos === 'อาจารย์') {
            return `อาจารย์ ${prefix}${name}`;
        }
        // กรณี ผศ./รศ./ศ. + ดร. -> "ผศ.ดร.[ชื่อ นามสกุล]"
        return `${acadPos}${prefix}${name}`;
    } else if (acadPos) {
        return `${acadPos}${name}`;
    } else if (prefix) {
        return `${prefix}${name}`;
    }
    return name;
};

/**
 * Formats full English name
 * e.g. "Asst.Prof.Dr. Anchalee Wongvijit"
 */
export const getFullNameEn = (staff: {
    prefixEn?: string | null;
    firstNameEn?: string | null;
    lastNameEn?: string | null;
}): string => {
    if (!staff.firstNameEn && !staff.lastNameEn) return '';
    const prefix = staff.prefixEn ? `${staff.prefixEn.trim()} ` : '';
    return `${prefix}${staff.firstNameEn || ''} ${staff.lastNameEn || ''}`.trim();
};

/**
 * Normalizes Google Scholar URL from user ID or full URL
 */
export const getGoogleScholarLink = (val: string | null | undefined): string => {
    if (!val) return '';
    const trimmed = val.trim();
    return trimmed.startsWith('http') ? trimmed : `https://scholar.google.com/citations?user=${trimmed}`;
};

/**
 * Normalizes ORCID URL from 16-digit ID or full URL
 */
export const getOrcidLink = (val: string | null | undefined): string => {
    if (!val) return '';
    const trimmed = val.trim();
    return trimmed.startsWith('http') ? trimmed : `https://orcid.org/${trimmed.replace(/^https?:\/\/orcid\.org\//, '')}`;
};

/**
 * Normalizes Scopus Author URL from ID or full URL
 */
export const getScopusLink = (val: string | null | undefined): string => {
    if (!val) return '';
    const trimmed = val.trim();
    return trimmed.startsWith('http') ? trimmed : `https://www.scopus.com/authid/detail.uri?authorId=${trimmed}`;
};
