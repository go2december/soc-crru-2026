# Data and Media

## Data Fetching

- Frontend requests must account for the backend `/api` global prefix.
- For SSR/server-side fetches, verify whether `INTERNAL_API_URL` or localhost fallback is appropriate.
- Keep explicit TypeScript types for API-driven data.

## Media Rules

- Stored image paths should remain relative, e.g. `/uploads/...`.
- Public rendering should resolve media against the correct runtime base URL.
- If a public detail page depends on slug-based data, verify both list and detail consumers after changes.
