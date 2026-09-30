import { Metadata } from 'next';
import {
    getFullName,
    getFullNameEn,
    getGoogleScholarLink,
    getOrcidLink,
    getScopusLink,
} from '@/lib/staff';
import { getApiBaseUrl, getAssetUrl } from '@/lib/api-config';

const API_URL = getApiBaseUrl();

interface Props {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        const res = await fetch(`${API_URL}/api/staff/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) {
            return {
                title: 'ข้อมูลอาจารย์และนักวิจัย | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
                description: 'ข้อมูลทำเนียบอาจารย์และนักวิจัย คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย (Chiang Rai Rajabhat University)',
            };
        }

        const staff = await res.json();
        const fullName = getFullName(staff);
        const fullNameEn = getFullNameEn(staff);
        const position = staff.adminPosition || staff.academicPosition || 'อาจารย์ประจำคณะสังคมศาสตร์';
        const department = staff.department || 'คณะสังคมศาสตร์';

        const title = `${fullName}${fullNameEn ? ` (${fullNameEn})` : ''} | ${position} มหาวิทยาลัยราชภัฏเชียงราย`;
        const description = `ข้อมูลประวัติ ความเชี่ยวชาญ และผลงานวิจัยของ ${fullName} สังกัด${department} คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย (Chiang Rai Rajabhat University)`;

        const assetImageUrl = staff.imageUrl ? getAssetUrl(staff.imageUrl) : null;

        return {
            title,
            description,
            openGraph: {
                title: `${fullName} - Chiang Rai Rajabhat University`,
                description,
                url: `https://soc.crru.ac.th/about/staff/${id}`,
                siteName: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
                images: assetImageUrl ? [{ url: assetImageUrl }] : undefined,
                type: 'profile',
            },
            alternates: {
                canonical: `https://soc.crru.ac.th/about/staff/${id}`,
            },
        };
    } catch {
        return {
            title: 'ข้อมูลอาจารย์และนักวิจัย | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
            description: 'ข้อมูลทำเนียบอาจารย์และนักวิจัย คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
        };
    }
}

export default async function StaffDetailLayout({
    params,
    children
}: {
    params: Promise<{ id: string }>;
    children: React.ReactNode
}) {
    const { id } = await params;
    let personSchema = null;

    try {
        const res = await fetch(`${API_URL}/api/staff/${id}`, { next: { revalidate: 60 } });
        console.log(`[StaffDetailLayout] fetching ${API_URL}/api/staff/${id} -> status: ${res.status}`);
        if (res.ok) {
            const staff = await res.json();
            const hasScholar = Boolean(staff.googleScholarUrl);
            const hasOrcid = Boolean(staff.orcidId);
            const hasScopus = Boolean(staff.scopusAuthorId);

            personSchema = {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": getFullName(staff),
                "alternateName": getFullNameEn(staff) || undefined,
                "url": `https://soc.crru.ac.th/about/staff/${id}`,
                "jobTitle": staff.adminPosition || staff.academicPosition || 'อาจารย์ประจำคณะสังคมศาสตร์',
                "worksFor": {
                    "@type": "EducationalOrganization",
                    "name": "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
                    "alternateName": "Faculty of Social Sciences, Chiang Rai Rajabhat University",
                    "url": "https://soc.crru.ac.th",
                    "parentOrganization": {
                        "@type": "CollegeOrUniversity",
                        "name": "มหาวิทยาลัยราชภัฏเชียงราย (Chiang Rai Rajabhat University)",
                        "url": "https://crru.ac.th"
                    }
                },
                "email": staff.contactEmail || undefined,
                "image": staff.imageUrl ? (() => {
                    const cleanUrl = getAssetUrl(staff.imageUrl);
                    return cleanUrl.startsWith('http') ? cleanUrl : `https://soc.crru.ac.th${cleanUrl}`;
                })() : undefined,
                "knowsAbout": staff.expertise && staff.expertise.length > 0 ? staff.expertise : undefined,
                "sameAs": [
                    hasScholar ? getGoogleScholarLink(staff.googleScholarUrl) : null,
                    hasOrcid ? getOrcidLink(staff.orcidId) : null,
                    hasScopus ? getScopusLink(staff.scopusAuthorId) : null,
                ].filter(Boolean),
            };
        }
    } catch (err) {
        console.error('[StaffDetailLayout] fetch error:', err);
    }

    return (
        <>
            {personSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
            )}
            {children}
        </>
    );
}
