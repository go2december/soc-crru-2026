---
description: Review and synchronize project status, plans, and workflow artifacts after meaningful changes
---
1. Start from `docs/WORKFLOW-project-status.md` and compare its status against the current repository state.
2. Review `docs/PLAN-soc-crru-baseline.md` and `docs/PLAN-chiang-rai-studies.md` for outdated completion states, priorities, or pending items.
3. Review `docs/WORKFLOW-chiang-rai-admin.md` for operational notes that no longer match the implementation.
4. Review `docs/PLAN-workflow-standardization.md` to ensure the documentation structure still reflects the repository.
5. Check that `.windsurf/workflows/` (and `.agent/workflows/`) contains the required executable workflows and that their steps still match current implementation behavior.
6. Update statuses using only the standard labels `✅ COMPLETE`, `🔄 IN PROGRESS`, and `📋 PENDING`.
7. Update checklist items so completed work is marked with `[x]` and remaining work is marked with `[ ]`.
8. If a workflow and a status snapshot conflict, resolve the conflict by updating the older or less specific artifact.
9. Record the review date in the documents you modify when appropriate.
10. Finish by summarizing the synchronized source-of-truth state and the next priority items.
