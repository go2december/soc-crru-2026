---
description: Faculty admin workflow for dashboard CRUD, auth validation, and post-change documentation sync
---
1. Confirm the scope of work under `/admin` and identify which area is affected: `dashboard`, `staff`, `departments`, `positions`, `users`, or `news`.
2. Review the relevant frontend files in `frontend/app/admin/` or matching admin route groups before editing.
3. Review the corresponding backend modules in `backend/src/` such as `staff`, `departments`, `programs`, `auth`, or `news` before making changes.
4. Verify all client-side API calls use the correct `/api/...` prefix and current backend base URL conventions.
5. If the task affects authentication, confirm the login and callback flow still works with `/admin/login`, `/api/auth/google` or `/api/auth/dev/login`, and `/admin/callback`.
6. If the task affects uploaded media or profile images, preserve the relative-path storage convention and verify rendered URLs remain valid.
7. After implementation, verify impacted list, create, edit, delete, and detail flows for the affected admin entity.
8. Update `docs/WORKFLOW-project-status.md` and `docs/PLAN-soc-crru-baseline.md` if completion status, pending work, or workflow behavior changed.
9. Update human-readable docs only if the operational process changed in a meaningful way.
10. Finish with a concise summary of what changed, what still remains pending, and any recommended manual QA.
