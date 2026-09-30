import { MetadataRoute } from 'next';
import { getApiBaseUrl } from '@/lib/api-config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th';
const API_URL = getApiBaseUrl();

type DynamicSitemapItem = {
    id?: string;
    slug?: string;
    updatedAt?: string;
    publishedAt?: string;
    createdAt?: string;
};

async function fetchJson(path: string) {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || json || [];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [
        facultyNews,
        researchProjects,
        academicServices,
        staffProfiles,
        activities,
        articles,
        learningSites,
        artifacts
    ] = await Promise.all([
        fetchJson('/api/news'),
        fetchJson('/api/research/projects?limit=500'),
        fetchJson('/api/academic-services?limit=500'),
        fetchJson('/api/staff?limit=500'),
        fetchJson('/api/chiang-rai/activities?limit=300'),
        fetchJson('/api/chiang-rai/articles?limit=300'),
        fetchJson('/api/chiang-rai/learning-sites?limit=300'),
        fetchJson('/api/chiang-rai/artifacts?limit=1000'),
    ]);

    const facultyNewsItems = Array.isArray(facultyNews) ? (facultyNews as DynamicSitemapItem[]) : [];
    const researchItems = Array.isArray(researchProjects) ? (researchProjects as DynamicSitemapItem[]) : [];
    const academicServiceItems = Array.isArray(academicServices) ? (academicServices as DynamicSitemapItem[]) : [];
    const staffItems = Array.isArray(staffProfiles) ? (staffProfiles as DynamicSitemapItem[]) : [];
    const activityItems = Array.isArray(activities) ? (activities as DynamicSitemapItem[]) : [];
    const articleItems = Array.isArray(articles) ? (articles as DynamicSitemapItem[]) : [];
    const learningSiteItems = Array.isArray(learningSites) ? (learningSites as DynamicSitemapItem[]) : [];
    const artifactItems = Array.isArray(artifacts) ? (artifacts as DynamicSitemapItem[]) : [];

    const dynamicUrls: MetadataRoute.Sitemap = [
        ...facultyNewsItems
            .filter((item) => item.slug || item.id)
            .map((item) => ({
                url: `${BASE_URL}/news/${item.slug || item.id}`,
                lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.85,
            })),
        ...researchItems
            .filter((item) => item.slug || item.id)
            .map((item) => ({
                url: `${BASE_URL}/research/database/${item.slug || item.id}`,
                lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            })),
        ...academicServiceItems
            .filter((item) => item.id)
            .map((item) => ({
                url: `${BASE_URL}/research/services/${item.id}`,
                lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            })),
        ...staffItems
            .filter((item) => item.id)
            .map((item) => ({
                url: `${BASE_URL}/about/staff/${item.id}`,
                lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.75,
            })),
        ...activityItems
            .filter((item) => item.slug || item.id)
            .map((item) => ({
                url: `${BASE_URL}/chiang-rai-studies/activities/${item.slug || item.id}`,
                lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })),
        ...articleItems
            .filter((item) => item.slug || item.id)
            .map((item) => ({
                url: `${BASE_URL}/chiang-rai-studies/articles/${item.slug || item.id}`,
                lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            })),
        ...learningSiteItems
            .filter((item) => item.slug || item.id)
            .map((item) => ({
                url: `${BASE_URL}/chiang-rai-studies/learning-sites/${item.slug || item.id}`,
                lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            })),
        ...artifactItems
            .filter((item) => item.id)
            .map((item) => ({
                url: `${BASE_URL}/chiang-rai-studies/archive/${item.id}`,
                lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            })),
    ];

    const staticUrls: MetadataRoute.Sitemap = [
        // Faculty Main Pages
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/about/staff`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
        { url: `${BASE_URL}/about/executive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${BASE_URL}/about/structure`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
        { url: `${BASE_URL}/programs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
        { url: `${BASE_URL}/admissions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/academics/credit-bank`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/research/database`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
        { url: `${BASE_URL}/research/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },

        // Chiang Rai Studies Center
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
    ];

    return [...staticUrls, ...dynamicUrls];
}
