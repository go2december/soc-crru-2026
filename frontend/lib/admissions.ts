import { getApiBaseUrl } from './api-config';

export interface AdmissionSchedule {
    id: string;
    roundName: string;
    description?: string | null;
    period: string;
    channel: string;
    status: 'OPEN' | 'CLOSED' | 'UPCOMING' | 'ALWAYS';
    link?: string | null;
    sortOrder: number;
}

export interface AdmissionDocument {
    id: string;
    title: string;
    fileUrl: string;
    sortOrder: number;
}

export interface AdmissionConfig {
    id?: number;
    youtubeVideoUrl?: string | null;
    brochureUrl?: string | null;
    bachelorLink?: string | null;
    graduateLink?: string | null;
    tableTitle?: string | null;
}

const DEFAULT_CONFIG: AdmissionConfig = {
    youtubeVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    brochureUrl: '/images/admission-brochure.png',
    bachelorLink: 'https://admission.crru.ac.th/',
    graduateLink: 'https://orasis.crru.ac.th/gds_crru/index.php/main/home',
    tableTitle: 'ตารางรอบรับสมัคร ประจำปีการศึกษา 2569',
};

export async function fetchAdmissionConfig(): Promise<AdmissionConfig> {
    try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/admissions/config`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return DEFAULT_CONFIG;
        const data = await res.json();
        return {
            ...DEFAULT_CONFIG,
            ...data,
        };
    } catch (err) {
        console.error('Failed to fetch admission config:', err);
        return DEFAULT_CONFIG;
    }
}

export async function fetchAdmissionSchedules(): Promise<AdmissionSchedule[]> {
    try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/admissions/schedules`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error('Failed to fetch admission schedules:', err);
        return [];
    }
}

export async function fetchAdmissionDocuments(): Promise<AdmissionDocument[]> {
    try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/admissions/documents`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error('Failed to fetch admission documents:', err);
        return [];
    }
}
