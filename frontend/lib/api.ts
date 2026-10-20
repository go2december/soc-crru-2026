export interface ProgramInstructor {
    id: string;
    staffId: string;
    role: 'CHAIR' | 'MEMBER';
    sortOrder: number;
    prefixTh?: string | null;
    firstNameTh?: string | null;
    lastNameTh?: string | null;
    prefixEn?: string | null;
    firstNameEn?: string | null;
    lastNameEn?: string | null;
    imageUrl?: string | null;
    academicPositionNameTh?: string | null;
}


export interface SocialLinks {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    line?: string;
}

export interface ProgramTrack {
    id: string;
    programId: string;
    code: string;
    nameTh: string;
    nameEn?: string | null;
    trackType: 'CONCENTRATION' | 'MAJOR' | 'MINOR';
    studyPlanType: 'REGULAR_4YR' | 'TRANSFER_2YR' | 'GRADUATE';
    degreeTitleTh?: string | null;
    degreeTitleEn?: string | null;
    description?: string | null;
    structure?: {
        totalCredits: number;
        general: number;
        major: number;
        freeElective: number;
    } | null;
    careers?: string[] | null;
    highlights?: {
        title: string;
        description: string;
        icon?: string;
    }[] | null;
    bannerUrl?: string | null;
    curriculumUrl?: string | null;
    youtubeVideoUrl?: string | null;
    facebookVideoUrl?: string | null;
    socialLinks?: SocialLinks | null;
    galleryImages?: string[] | null;
    attachments?: {
        originalName: string;
        fileUrl: string;
        mimeType?: string;
        size?: number;
    }[] | null;
    sortOrder: number;
    isActive: boolean;
}

export interface ProgramConcentration {
    code: string;
    title: string;
    titleEn?: string;
    degreeTitle?: string;
    description: string;
    bannerUrl?: string;
    highlights?: {
        title: string;
        description: string;
        icon?: string;
    }[];
    careers?: string[];
    structure?: {
        totalCredits: number;
        general: number;
        major: number;
        freeElective: number;
    };
    curriculumUrl?: string;
    youtubeVideoUrl?: string;
    facebookVideoUrl?: string;
}

export interface Program {
    id: string;
    code: string;
    nameTh: string;
    degreeTitleTh?: string;
    degreeTitleEn?: string;
    degreeLevel: string;
    description: string;
    bannerUrl?: string;
    curriculumUrl?: string;
    structure?: {
        totalCredits: number;
        general: number;
        major: number;
        freeElective: number;
    };
    careers?: string[];
    highlights?: {
        title: string;
        description: string;
        icon?: string;
    }[];
    concentrations?: ProgramConcentration[];
    tracks?: ProgramTrack[];
    socialLinks?: SocialLinks;
    // PR Media
    galleryImages?: string[];
    attachments?: { originalName: string; fileUrl: string; size?: number; mimeType?: string }[];
    youtubeVideoUrl?: string;
    facebookVideoUrl?: string;
    // Instructors
    instructors?: ProgramInstructor[];
}

export { getApiBaseUrl, getAssetUrl, apiFetch } from './api-config';
import { getApiBaseUrl } from './api-config';

export async function fetchPrograms(): Promise<Program[]> {
    const baseUrl = getApiBaseUrl();
    try {
        const res = await fetch(`${baseUrl}/api/programs`, {
            cache: 'no-store', // Ensure fresh data
            next: { tags: ['programs'] }
        });

        if (!res.ok) {
            // If internal docker fail, try fallback to localhost (e.g. if running locally)
            if (typeof window === 'undefined' && !baseUrl.includes('localhost')) {
                console.warn(`[API] Internal fetch failed, retrying localhost...`);
                try {
                    const fallbackRes = await fetch(`http://localhost:4001/api/programs`, { cache: 'no-store' });
                    if (fallbackRes.ok) {
                        const fallbackJson = await fallbackRes.json();
                        return fallbackJson.data || [];
                    }
                } catch (e) { }
            }
            throw new Error(`Failed to fetch programs: ${res.status}`);
        }
        const resJson = await res.json();
        return resJson.data || [];
    } catch (error) {
        // If the first fetch completely failed (network error), try fallback for server-side hybrid dev
        if (typeof window === 'undefined' && !baseUrl.includes('localhost')) {
            try {
                const fallbackRes = await fetch(`http://localhost:4001/api/programs`, { cache: 'no-store' });
                if (fallbackRes.ok) {
                    const fallbackJson = await fallbackRes.json();
                    return fallbackJson.data || [];
                }
            } catch (e) {
                console.error('[API] Fallback fetch also failed', e);
            }
        }
        console.error('[API] Error fetching programs:', error);
        return [];
    }
}

export async function fetchProgramByCode(code: string): Promise<Program | null> {
    const baseUrl = getApiBaseUrl();
    try {
        const res = await fetch(`${baseUrl}/api/programs/code/${code}`, {
            cache: 'no-store',
            next: { tags: [`program-${code}`] }
        });

        if (!res.ok) {
            if (typeof window === 'undefined' && !baseUrl.includes('localhost')) {
                try {
                    const fallbackRes = await fetch(`http://localhost:4001/api/programs/code/${code}`, { cache: 'no-store' });
                    if (fallbackRes.ok) return fallbackRes.json();
                } catch (e) { }
            }
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch program: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        if (typeof window === 'undefined' && !baseUrl.includes('localhost')) {
            try {
                const fallbackRes = await fetch(`http://localhost:4001/api/programs/code/${code}`, { cache: 'no-store' });
                if (fallbackRes.ok) return fallbackRes.json();
                if (fallbackRes.status === 404) return null;
            } catch (e) {
                // ignore
            }
        }
        console.error(`[API] Error fetching program ${code}:`, error);
        return null;
    }
}

export async function fetchTrackByCode(programCode: string, trackCode: string): Promise<(ProgramTrack & { program: { id: string; code: string; nameTh: string; degreeLevel: string }; instructors?: ProgramInstructor[] }) | null> {
    const baseUrl = getApiBaseUrl();
    try {
        const res = await fetch(`${baseUrl}/api/programs/code/${programCode}/tracks/${trackCode}`, {
            cache: 'no-store',
            next: { tags: [`track-${programCode}-${trackCode}`] }
        });
        if (!res.ok) {
            if (typeof window === 'undefined' && !baseUrl.includes('localhost')) {
                try {
                    const fallbackRes = await fetch(`http://localhost:4001/api/programs/code/${programCode}/tracks/${trackCode}`, { cache: 'no-store' });
                    if (fallbackRes.ok) return fallbackRes.json();
                } catch (e) { }
            }
            if (res.status === 404) return null;
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`[API] Error fetching track ${programCode}/${trackCode}:`, error);
        return null;
    }
}
