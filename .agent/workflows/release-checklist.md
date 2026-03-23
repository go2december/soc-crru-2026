---
description: Release readiness checklist for QA, SEO, responsive review, and deployment preparation
---
1. Review `docs/WORKFLOW-AND-PLAN-UPDATED.md` to confirm the current release candidates and remaining high-priority items.
2. Verify the frontend and backend build assumptions, environment variables, and port mappings remain consistent with the current project setup.
3. Check high-risk public routes for rendering regressions, broken navigation, missing data, and image URL issues.
4. Run a responsive review across key Faculty and Chiang Rai Studies pages on mobile and tablet breakpoints.
5. Run an SEO review across priority public routes: titles, descriptions, Open Graph coverage, canonical behavior, structured data, `sitemap.xml`, and `robots.txt` where applicable.
6. Verify admin-critical flows still work for login, create, edit, delete, and media handling.
7. Confirm known pending items are either resolved, intentionally deferred, or documented as release risks.
8. Update `docs/WORKFLOW-AND-PLAN-UPDATED.md` with the latest release readiness status.
9. If deployment steps or assumptions changed, update the relevant docs and workflow artifacts before release.
10. Produce a go/no-go summary with blockers, warnings, and recommended next actions.
