# Storage and URL Rules

## Storage

- Store uploaded file references as relative paths only.
- Do not store backend-only absolute URLs in the database.
- Be careful with static upload paths and any logic related to `/uploads`.

## URL Resolution

- Admin/client rendering should resolve URLs against `NEXT_PUBLIC_API_URL` conventions.
- SSR/public rendering should resolve URLs against `INTERNAL_API_URL` or the current fallback strategy.
- When editing image rendering, verify both Docker and localhost assumptions if relevant.
