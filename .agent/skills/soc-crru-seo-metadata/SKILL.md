---
name: soc-crru-seo-metadata
description: Directives for Next.js Metadata API, sitemap structures, Open Graph tags, and search engine optimization rules.
---

# SOC-CRRU SEO & Metadata Standards

This guide outlines rules for managing meta tags, dynamic header information, sitemaps, and Open Graph configs for search engine discovery and social sharing preview optimization.

---

## 🏷️ 1. Next.js Metadata API

For all public page routes in Next.js, leverage the native Next.js Metadata API.

### Static Metadata
Defined at the top of static pages:
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'หลักสูตรการศึกษา | คณะสังคมศาสตร์ มร.ชร.',
  description: 'หลักสูตรปริญญาตรี ปริญญาโท และปริญญาเอก คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
};
```

### Dynamic Metadata
For dynamic pages (e.g. news detail, article detail):
```typescript
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: `${article.titleTh} | คณะสังคมศาสตร์ มร.ชร.`,
    description: article.summaryTh || article.contentTh.slice(0, 160),
    openGraph: {
      title: article.titleTh,
      description: article.summaryTh,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  };
}
```

---

## 🌐 2. Open Graph (OG) & Social Card Compliance

* Every public-facing page should include descriptive OG tags:
  * `og:title` -> descriptive, clean page title.
  * `og:description` -> snippet under 160 characters.
  * `og:image` -> absolute image link to prevent blank previews on Facebook, Line, or Twitter.
  * `og:url` -> canonical page address.
* Twitter/X: Configure `twitter:card: 'summary_large_image'`.

---

## 🗺️ 3. Sitemaps & robots.txt

* Ensure `sitemap.xml` dynamic generators parse new articles, academic programs, and learning sites.
* Maintain `robots.txt` configuration:
  * Allow all crawler robots (`User-agent: *`) on public paths.
  * Disallow crawling on administrative panels (e.g. `/admin/` and `/chiang-rai-studies/admin/`).
