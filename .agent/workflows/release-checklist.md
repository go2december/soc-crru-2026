---
description: QA, SEO, responsive, and deployment-readiness checklist for release preparation
---
1. Verify the highest-priority pending items in `docs/WORKFLOW-project-status.md` and the relevant `docs/PLAN-*.md` are addressed or explicitly deferred.
2. Run frontend lint and relevant backend lint or tests for the affected scope.
3. Review critical public pages for responsive behavior on mobile, tablet, and desktop.
4. Verify metadata, sitemap, robots, canonical URLs, and social cards for affected public routes.
5. Check admin CRUD flows that were changed: list, create, edit, delete, and public consumer behavior.
6. Validate uploaded images and media URLs, ensuring no backend-only absolute URLs leak into stored content.
7. Confirm environment variables and Docker/local runtime assumptions are documented and still valid.
8. Update project status and plan documents with completed release-readiness tasks.
9. Summarize release blockers, completed checks, and recommended next actions.
