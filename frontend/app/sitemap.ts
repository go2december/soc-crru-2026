import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th';
const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4001';

async function fetchJson(path: string) {
    try {
        const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || json || [];
    } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [facultyNews, activities, articles, learningSites, artifacts] = await Promise.all([
        fetchJson('/api/news'),
        fetchJson('/api/chiang-rai/activities?limit=200'),
        fetchJson('/api/chiang-rai/articles?limit=200'),
        fetchJson('/api/chiang-rai/learning-sites?limit=200'),
        fetchJson('/api/chiang-rai/artifacts?limit=500'),
    ]);

    const dynamicUrls = [
        ...(Array.isArray(facultyNews) ? facultyNews : []).map((item: any) => ({
            url: `${BASE_URL}/news/${item.slug}`,
            lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
        ...(Array.isArray(activities) ? activities : []).map((item: any) => ({
            url: `${BASE_URL}/chiang-rai-studies/activities/${item.slug}`,
            lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
        ...(Array.isArray(articles) ? articles : []).map((item: any) => ({
            url: `${BASE_URL}/chiang-rai-studies/articles/${item.slug}`,
            lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
        ...(Array.isArray(learningSites) ? learningSites : []).map((item: any) => ({
            url: `${BASE_URL}/chiang-rai-studies/learning-sites/${item.slug}`,
            lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
        ...(Array.isArray(artifacts) ? artifacts : []).map((item: any) => ({
            url: `${BASE_URL}/chiang-rai-studies/archive/${item.id}`,
            lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];

    return [
        // Faculty pages
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/about/staff`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/about/executive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/about/structure`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
        { url: `${BASE_URL}/programs`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${BASE_URL}/admissions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },

        // Chiang Rai Studies - static
        { url: `${BASE_URL}/chiang-rai-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/chiang-rai-studies/about/history`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/chiang-rai-studies/about/objectives`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/chiang-rai-studies/about/goals-mission`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/chiang-rai-studies/about/structure`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/chiang-rai-studies/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/chiang-rai-studies/articles`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/chiang-rai-studies/activities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/chiang-rai-studies/learning-sites`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/chiang-rai-studies/staff`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/chiang-rai-studies/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },

        // Dynamic content pages
        ...dynamicUrls,
    ];
}
