/**
 * Central API Configuration & URL Resolver (Single Source of Truth)
 * Resolves endpoints correctly between Docker internal network, local host dev, and client browser.
 */

const DEFAULT_INTERNAL_URL = 'http://api-gateway:3000';
const DEFAULT_EXTERNAL_URL = 'http://localhost:4001';

/**
 * Resolves the base URL for API requests:
 * - Server-side (SSR / generateMetadata / Server Components):
 *   Uses INTERNAL_API_URL (e.g. http://api-gateway:3000 in Docker) or falls back to NEXT_PUBLIC_API_URL / localhost:4001.
 * - Client-side (Browser):
 *   Uses NEXT_PUBLIC_API_URL or defaults to empty string '' to let Next.js rewrites proxy /api/* requests.
 */
export function getApiBaseUrl(): string {
    if (typeof window === 'undefined') {
        return (
            process.env.INTERNAL_API_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            DEFAULT_INTERNAL_URL
        );
    }
    return process.env.NEXT_PUBLIC_API_URL || '';
}

/**
 * Normalizes asset/image URLs:
 * - Removes legacy hardcoded origins (localhost, api-gateway, backend, soc_backend)
 * - Returns clean relative paths (/uploads/...) or intact external links (https://...)
 */
export function getAssetUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    const legacyPrefixes = [
        'http://localhost:4001',
        'http://localhost:4201',
        'http://localhost:4501',
        'http://localhost:3000',
        'http://api-gateway:3000',
        'http://backend:3000',
        'http://soc_backend:4000',
        'http://soc_backend:4001',
        'http://soc_backend:4501',
    ];

    for (const prefix of legacyPrefixes) {
        if (url.startsWith(prefix)) {
            return url.substring(prefix.length);
        }
    }

    return url;
}

/**
 * Wrapper for fetch that automatically prepends the correct base API URL
 */
export async function apiFetch(endpoint: string, init?: RequestInit): Promise<Response> {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return fetch(`${baseUrl}${cleanEndpoint}`, init);
}
