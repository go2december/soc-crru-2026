---
description: Chiang Rai Studies admin workflow for CRUD, media handling, and post-change documentation sync
---
1. Confirm the scope of work under `/chiang-rai-studies/admin` and identify which entity is affected: `articles`, `artifacts`, `activities`, `learning-sites`, `staff`, or `settings`.
2. Review the relevant implementation files in `frontend/app/chiang-rai-studies/admin/` and matching backend handlers in `backend/src/chiang-rai/` before editing.
3. Verify API paths use the `/api/chiang-rai/...` prefix and respect the backend global prefix.
4. If the change affects authentication, verify the login flow still follows `/chiang-rai-studies/admin/login` → `/api/auth/google` or `/api/auth/dev/login` → callback → dashboard.
5. If the change affects media upload or deletion, preserve the relative-path convention `/uploads/chiang-rai/...` and confirm frontend rendering still resolves URLs correctly.
6. For `learning-sites`, preserve thumbnail, media gallery, and content image cleanup behavior. For `activities`, apply the same cleanup pattern if the task is related to image deletion.
7. After implementation, verify impacted create, edit, list, and detail flows for the affected entity.
8. Update `docs/WORKFLOW-project-status.md` and `docs/PLAN-chiang-rai-studies.md` if feature status, pending items, or workflow behavior changed.
9. Update `docs/WORKFLOW-chiang-rai-admin.md` only if the human-readable admin process changed.
10. Summarize what changed, what remains pending, and whether any manual QA is still recommended.
