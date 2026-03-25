---
name: soc-crru-seo-metadata
description: SEO, metadata, sitemap, robots, canonical, OG image, and structured data rules for SOC-CRRU public routes. Use when changing public content, detail pages, list pages, or SEO-sensitive route behavior.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU SEO Metadata

> Public route changes in this project often affect metadata, sitemap coverage, canonical URLs, social cards, and structured data, especially for Chiang Rai detail and list pages.

## 🎯 Selective Reading Rule

**Read ONLY the SEO-related files relevant to the affected route type.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `metadata-and-canonical.md` | Metadata, canonical URL, and route-level SEO rules | When editing pages or route metadata |
| `sitemap-robots-and-social.md` | Sitemap, robots, and social card coverage rules | When changing route visibility or share behavior |
| `structured-data-checks.md` | JSON-LD and structured data validation guidance | When changing detail/list page semantics |

## ✅ Checklist

- [ ] Verify affected route metadata remains correct
- [ ] Verify canonical and URL assumptions remain valid
- [ ] Check sitemap/robots/social card impact if routes changed
- [ ] Check structured data if page semantics or content model changed
- [ ] Validate both detail and list pages when SEO-sensitive entities are involved
