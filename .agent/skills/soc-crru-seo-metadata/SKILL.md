---
name: soc-crru-seo-metadata
description: Directives for Next.js Metadata API, sitemap structures, Open Graph tags, and Webometrics search engine optimization rules.
---

# SOC-CRRU SEO & Metadata Standards (Webometrics Aligned)

This guide defines rules for Next.js Metadata APIs, Open Graph protocols, structured data (JSON-LD), sitemaps, and **Webometrics Ranking** compliance for the Faculty of Social Sciences, CRRU.

---

## 🏛️ 1. Webometrics 3-Dimension Alignment

All metadata and indexing strategies support the university's Webometrics ranking metrics (refer to `[[docs/04_Webometrics_Guidelines/04_Webometrics_Core_Indicators]]`):

| Webometrics Dimension | Weight | SEO / Technical Requirement |
|---|---|---|
| **1. Visibility (Impact)** | 50% | Shareable permanent URLs, canonical tags, high-resolution Open Graph images for social sharing, rich preview metadata. |
| **2. Openness (Transparency)** | 10% | Staff profiles with `Person` JSON-LD schema linking **Google Scholar**, **ORCID**, and ResearchGate URLs. Public downloadable PDF metadata. |
| **3. Excellence** | 40% | Research publication pages with `ScholarlyArticle` JSON-LD schema (DOI, Scopus Author ID, citations, journal volume/issue). |

---

## 🏷️ 2. Next.js Metadata API Standards

### 2.1 Metadata Base
Always configure `metadataBase` in the root layout (`frontend/app/layout.tsx`):
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th'),
  title: {
    default: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    template: '%s | คณะสังคมศาสตร์ มร.ชร.',
  },
  description: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย Faculty of Social Sciences, Chiang Rai Rajabhat University',
};
```

### 2.2 Dynamic Metadata Generation
For dynamic detail pages (news, research, staff, Chiang Rai studies):
```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const staff = await getStaffById(id);
  if (!staff) return { title: 'ไม่พบบุคลากร' };

  const fullName = `${staff.academicPosition || ''} ${staff.firstNameTh} ${staff.lastNameTh}`.trim();
  const title = `${fullName} | บุคลากรคณะสังคมศาสตร์ มร.ชร.`;
  const description = `${fullName} ${staff.position || ''} คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`;

  return {
    title,
    description,
    alternates: {
      canonical: `/about/staff/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/about/staff/${id}`,
      images: staff.avatarUrl ? [{ url: staff.avatarUrl, width: 800, height: 1066, alt: fullName }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
```

---

## 🧩 3. Structured Data (JSON-LD Schemas)

Inject JSON-LD schemas using `<script type="application/ld+json">` for rich search engine snippets:

### 3.1 Staff Profile (`Person` Schema - Openness Metric)
```tsx
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: fullName,
  jobTitle: staff.position,
  worksFor: {
    '@type': 'EducationalOrganization',
    name: 'Chiang Rai Rajabhat University',
    url: 'https://soc.crru.ac.th',
  },
  sameAs: [
    staff.orcidUrl,
    staff.googleScholarUrl,
    staff.researchGateUrl,
  ].filter(Boolean),
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
    {/* Page Content */}
  </>
);
```

### 3.2 Research Publication (`ScholarlyArticle` - Excellence Metric)
```tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline: research.titleTh,
  author: research.authors?.map((a: string) => ({ '@type': 'Person', name: a })),
  datePublished: research.publishedAt,
  description: research.abstractTh,
  sameAs: research.doi ? `https://doi.org/${research.doi}` : undefined,
};
```

---

## 🗺️ 4. Sitemaps & robots.txt

* **`frontend/app/sitemap.ts`**:
  - Dynamically index static core routes, news, announcements, research outputs, staff profiles, curricula, and Chiang Rai studies archives.
  - Set appropriate `changeFrequency` (`daily` for news, `monthly` for staff/programs) and `priority` (`1.0` for home, `0.8` for research and news).
* **`frontend/app/robots.ts`**:
  - Allow all search crawlers (`User-agent: *`) on public paths.
  - Disallow admin panels: `/admin/` and `/chiang-rai-studies/admin/`.
