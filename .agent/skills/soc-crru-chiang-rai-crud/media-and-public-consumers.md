# Media and Public Consumers

## Media Rules

- Store uploaded file references as relative paths only.
- Do not store backend-only absolute URLs in the database.
- For admin rendering, verify `NEXT_PUBLIC_API_URL` resolution.
- For SSR/public rendering, verify `INTERNAL_API_URL` or current fallback logic.
- Avoid orphaning media files when edit/delete flows expect cleanup.

## Public Consumer Rules

- If content models change, inspect homepage sections, list pages, detail pages, tags, search, sitemap, metadata, and JSON-LD generation.
- If the entity uses slug-based public routes, verify both by-id admin flow and public slug flow.
