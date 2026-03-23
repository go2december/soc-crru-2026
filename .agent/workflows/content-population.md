---
description: Populate and validate real content across SOC-CRRU public and admin-managed sections
---
1. Identify the target area: Faculty public pages, Chiang Rai Studies public pages, or admin-managed records.
2. Review the current content model and field requirements before editing data structures or page rendering.
3. Preserve existing route structure, slugs, tags, media conventions, and publish-state behavior.
4. When adding real content, validate that titles, summaries, body content, tags, dates, authors, and media fields are internally consistent.
5. If content is stored through admin CRUD, ensure the public page still renders correctly for SSR and client-side navigation.
6. For uploaded images or embedded media, keep database values as relative paths or supported embed values only.
7. Re-check list pages, detail pages, breadcrumbs, metadata generation, and any tag or filter behavior affected by the new content.
8. If content completion changes milestone status, update `docs/WORKFLOW-project-status.md` and the relevant `docs/PLAN-*.md` file.
9. Record any remaining placeholder content or missing source material as explicit pending items.
10. Finish with a concise verification summary of which sections were populated and which still need content.
