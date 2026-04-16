# Fix and Verify

## Verification Checklist

- Confirm the bug no longer reproduces.
- Confirm related list/create/edit/delete or public/detail flows still work.
- Confirm no new issues were introduced.
- Add or recommend regression protection where practical.

## Project-Specific High-Risk Areas

- Admin auth login/callback loops
- `/api` prefix mismatches
- Public/admin route consumer drift
- Upload/media cleanup regressions
- SSR vs client URL resolution issues
