# CRUD Surface Checks

## Shared Checks

- Verify list, create, edit, delete, and by-id/by-slug flows when relevant.
- Keep loading, empty, error, and confirmation states intact.
- Keep frontend fetch paths aligned with backend `/api` prefixes.
- If endpoint contracts change, update likely frontend consumers together.

## Media-Sensitive Entities

- Preserve relative image-path storage.
- Verify preview, replacement, and cleanup behavior.
- Check public rendering after admin media changes.
