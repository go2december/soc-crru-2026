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
}

// Environment handling for Docker vs Local
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Client-side: always use the exposed localhost URL
        return 'http://localhost:3001';
    }
    // Server-side: Try to use internal Docker URL if available (env var), otherwise fallback to localhost
    // We default to soc_backend:3000 for Docker internal networking
    return process.env.INTERNAL_API_URL || 'http://soc_backend:3000';
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
            if (typeof window === 'undefined' && baseUrl.includes('soc_backend')) {
                console.warn(`[API] Internal fetch failed, retrying localhost...`);
                try {
                    const fallbackRes = await fetch(`http://localhost:3001/api/programs`, { cache: 'no-store' });
                    if (fallbackRes.ok) return fallbackRes.json();
                } catch (e) { }
            }
            throw new Error(`Failed to fetch programs: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        // If the first fetch completely failed (network error), try fallback for server-side hybrid dev
        if (typeof window === 'undefined' && baseUrl.includes('soc_backend')) {
            try {
                const fallbackRes = await fetch(`http://localhost:3001/api/programs`, { cache: 'no-store' });
                if (fallbackRes.ok) return fallbackRes.json();
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
            if (typeof window === 'undefined' && baseUrl.includes('soc_backend')) {
                try {
                    const fallbackRes = await fetch(`http://localhost:3001/api/programs/code/${code}`, { cache: 'no-store' });
                    if (fallbackRes.ok) return fallbackRes.json();
                } catch (e) { }
            }
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch program: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        if (typeof window === 'undefined' && baseUrl.includes('soc_backend')) {
            try {
                const fallbackRes = await fetch(`http://localhost:3001/api/programs/code/${code}`, { cache: 'no-store' });
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
