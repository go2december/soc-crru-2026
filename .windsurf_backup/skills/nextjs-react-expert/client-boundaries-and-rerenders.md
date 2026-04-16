# Client Boundaries and Re-renders

## Client Component Rules

- Add `'use client'` only when interactivity or browser APIs require it.
- Keep expensive stateful logic localized to the smallest useful component.
- Use memoization only when it solves a real re-render or computation problem.

## Review Focus

- Excessive re-renders in admin tables/forms
- Large client-only trees that could remain server-rendered
- Avoidable effect-driven data fetching on route load
