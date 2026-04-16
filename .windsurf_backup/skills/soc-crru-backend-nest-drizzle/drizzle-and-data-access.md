# Drizzle and Data Access

## Database Rules

- Keep database access patterns consistent with the existing Drizzle-based implementation.
- Respect current PostgreSQL table naming and domain grouping.
- Prefer minimal, targeted schema and query changes.

## When Editing Data Models

- Check matching frontend types and form expectations.
- For Chiang Rai entities, inspect public consumers such as list pages, detail pages, tags, search, metadata, and sitemap generation.
- For Faculty entities, inspect related admin and public consumers together.
