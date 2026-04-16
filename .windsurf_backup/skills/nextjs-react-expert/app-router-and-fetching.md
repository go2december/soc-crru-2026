# App Router and Fetching

## Core Rules

- Use Next.js App Router conventions under `frontend/app/`.
- Prefer server-friendly data fetching and avoid unnecessary client-only logic.
- For SSR or server-side fetches, verify whether the code should use internal Docker URLs or localhost fallbacks.
- If multiple independent requests are needed, avoid sequential waterfalls.

## When Reviewing Routes

- Check whether the route should remain a server component.
- Verify metadata, loading, and error boundaries if route behavior changes.
- Keep public pages and admin pages aligned with their route-specific UI framework constraints.
