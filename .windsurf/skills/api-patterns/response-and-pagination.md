# Response and Pagination

## Response Rules

- Keep response formats predictable for current frontend consumers.
- If changing envelopes, lists, or pagination shapes, update all callers together.
- Do not leak internal-only details in public API responses.

## Pagination Rules

- Preserve current query parameter conventions unless the task explicitly requires change.
- Verify list pages and admin tables after pagination changes.
