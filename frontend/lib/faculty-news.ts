export type FacultyNewsCategory = 'NEWS' | 'EVENT' | 'ANNOUNCE' | 'JOB';

export interface FacultyNewsAttachment {
  originalName: string;
  fileUrl: string;
  mimeType?: string;
  size?: number;
}

export interface FacultyNewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: FacultyNewsCategory;
  thumbnailUrl: string | null;
  mediaUrls: string[] | null;
  attachments: FacultyNewsAttachment[] | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const FACULTY_NEWS_CATEGORY_LABELS: Record<FacultyNewsCategory, string> = {
  NEWS: 'ข่าวประชาสัมพันธ์',
  EVENT: 'กิจกรรม',
  ANNOUNCE: 'ประกาศ',
  JOB: 'สมัครงาน',
};

export const FACULTY_NEWS_CATEGORY_STYLES: Record<FacultyNewsCategory, string> = {
  NEWS: 'bg-primary/10 text-primary',
  EVENT: 'bg-sky-100 text-sky-700',
  ANNOUNCE: 'bg-amber-100 text-amber-700',
  JOB: 'bg-emerald-100 text-emerald-700',
};

export function getFacultyNewsImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${baseUrl}${url}`;
  }
  return url;
}

export function getFacultyNewsPublicAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${baseUrl}${url}`;
  }
  return url;
}

export function getFacultyNewsServerAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/')) {
    const publicUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${publicUrl}${url}`;
  }
  return url;
}

export function extractFacultyNewsExcerpt(content: string, maxLength = 180): string {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
}

export function formatFacultyNewsDate(date?: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function fetchFacultyNewsList(limit?: number): Promise<FacultyNewsItem[]> {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4001';
  const query = limit ? `?limit=${limit}` : '';

  try {
    const res = await fetch(`${apiUrl}/api/news${query}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching faculty news list:', error);
    return [];
  }
}

export async function fetchFacultyNewsBySlug(slug: string): Promise<FacultyNewsItem | null> {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4001';

  try {
    const res = await fetch(`${apiUrl}/api/news/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching faculty news item:', error);
    return null;
  }
}
