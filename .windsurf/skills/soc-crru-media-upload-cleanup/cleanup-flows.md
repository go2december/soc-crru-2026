# Cleanup Flows

## Replace/Delete Rules

- When replacing or deleting media in rich content, consider thumbnails, gallery arrays, and embedded content images, not only primary image fields.
- Be careful not to orphan files on disk when edit/delete behavior is expected to perform cleanup.

## High-Risk Areas

- Chiang Rai learning sites
- Chiang Rai activities
- Staff/profile image flows
- Any admin CRUD that supports upload, replacement, or destructive delete
