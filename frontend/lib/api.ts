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
    concentrations?: {
        title: string;
        description: string;
    }[];
    // PR Media
    galleryImages?: string[];
    attachments?: { originalName: string; fileUrl: string; size?: number; mimeType?: string }[];
    youtubeVideoUrl?: string;
    facebookVideoUrl?: string;
    // Instructors
    instructors?: ProgramInstructor[];
}

// Environment handling for Docker vs Local
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Client-side: use empty string to let Next.js rewrites proxy it (avoiding CORS and port issues)
        return '';
    }
    // Server-side: Use internal API URL if set, otherwise fallback to external gateway
    return process.env.INTERNAL_API_URL || 'http://localhost:4201';
};

export async function fetchPrograms(): Promise<Program[]> {
    const baseUrl = getBaseUrl();
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
                    const fallbackRes = await fetch(`http://localhost:4201/api/programs`, { cache: 'no-store' });
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
                const fallbackRes = await fetch(`http://localhost:4201/api/programs`, { cache: 'no-store' });
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
    const baseUrl = getBaseUrl();
    try {
        const res = await fetch(`${baseUrl}/api/programs/code/${code}`, {
            cache: 'no-store',
            next: { tags: [`program-${code}`] }
        });

        if (!res.ok) {
            if (typeof window === 'undefined' && !baseUrl.includes('localhost')) {
                try {
                    const fallbackRes = await fetch(`http://localhost:4201/api/programs/code/${code}`, { cache: 'no-store' });
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
                const fallbackRes = await fetch(`http://localhost:4201/api/programs/code/${code}`, { cache: 'no-store' });
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
