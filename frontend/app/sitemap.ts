import { MetadataRoute } from 'next';

const BASE_URL = 'https://soc.crru.ac.th';
const API_URL = process.env.INTERNAL_API_URL || 'http://soc_backend:4000';

async function getActivities() {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/activities?limit=100`, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

async function getArticles() {
    try {
        const res = await fetch(`${API_URL}/api/chiang-rai/articles?limit=100`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const activities = await getActivities();
    const articles = await getArticles();

    const activityUrls = activities.map((item: any) => ({
        url: `${BASE_URL}/chiang-rai-studies/activities/${item.slug}`,
        lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const articleUrls = (Array.isArray(articles) ? articles : []).map((item: any) => ({
        url: `${BASE_URL}/chiang-rai-studies/articles/${item.slug}`,
        lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/about/history`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/about/mission`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/about/structure`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/staff`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/archive`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/activities`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/articles`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/chiang-rai-studies/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        ...activityUrls,
        ...articleUrls,
    ];
}
