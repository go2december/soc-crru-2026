# Bundle and Performance

## Optimization Focus

- Use dynamic imports for heavy or rarely used client-side UI when appropriate.
- Keep main bundles lean by avoiding unnecessary imports.
- Review rendering-heavy screens such as admin tables, dashboards, and rich media pages.

## High-Value Checks

- Eliminate independent sequential fetches
- Avoid oversized client bundles
- Keep image rendering and large list rendering efficient
- Prefer built-in Next.js optimizations when compatible with project constraints
