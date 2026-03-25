# Authoritative Paths

## Backend

- `backend/src/chiang-rai/` is the authoritative backend area.
- Keep entity names and namespaces aligned with the existing `chiang-rai` convention.
- Backend uses a global `/api` prefix.

## Frontend

- Public routes live under `/chiang-rai-studies/*`
- Admin routes live under `/chiang-rai-studies/admin/*`
- Inspect public consumers such as homepage sections, list pages, detail pages, search, tags, stats, sitemap, metadata, and JSON-LD when making model changes.
