import { getApiBaseUrl } from './api-config';

export interface BannerItem {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  badgeText?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  order: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export async function getActiveBanners(): Promise<BannerItem[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/banners`, {
      next: { tags: ['banners'], revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching active banners:', err);
    return [];
  }
}
