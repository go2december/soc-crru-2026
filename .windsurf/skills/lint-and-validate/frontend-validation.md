# Frontend Validation

## Core Checks

- Run frontend lint from `frontend/` when relevant.
- If type verification is needed, run TypeScript checks appropriate to the workspace setup.
- Verify route-level behavior for the changed surface, especially public vs admin framework separation.

## UI Validation Focus

- Public pages use DaisyUI only
- Admin pages use shadcn/ui only
- No broken fetch paths or rendering regressions in the changed flow
