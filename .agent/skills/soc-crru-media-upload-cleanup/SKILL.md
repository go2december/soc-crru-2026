---
name: soc-crru-media-upload-cleanup
description: Standards for managing secure media/document uploads, storing references, and cleaning up orphaned file-system assets.
---

# Media Upload & Asset Cleanup Guidelines

This guide specifies how to securely upload media files (images, documents, PDFs) and clean up orphaned files on the server when database records are deleted or modified.

---

## 📂 1. Directory Structure & Naming Conventions

* All uploaded files must be saved under the dedicated uploads directory in backend:
  * `backend/uploads/`
* Recommended subfolders based on data modules:
  * `/uploads/news/`
  * `/uploads/staff/`
  * `/uploads/chiang-rai/`
  * `/uploads/research/`
* **Filename Sanitization**: Always sanitize and rename uploaded files using unique identifiers (such as UUIDs or timestamps concatenated with random characters) to prevent overwriting existing files:
  ```typescript
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const newName = `${uniqueSuffix}${ext}`;
  ```

---

## 🛡️ 2. Validation & Security Rules

* **Size Limits**: Prevent excessive disk usage. Limit image uploads (JPEG, PNG, WebP) to `5MB` and document uploads (PDF, DOCX) to `10MB`.
* **MIME-Type Whitelist**:
  * Images: `image/jpeg`, `image/png`, `image/webp`
  * Documents: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
* **Input Sanity**: Validate incoming files via NestJS interceptors (`FileInterceptor`) to ensure only clean files are accepted.

---

## 🗑️ 3. Orphaned File Cleanup Strategy

To prevent disk storage bloat:
1. **Cascade Deletes**: When a DB record containing a file path/URL is deleted, the server must delete the referenced physical file.
2. **File Update (Replacement)**: When an admin updates an article or profile with a new file, the old file must be removed from the disk immediately if it exists.
3. **Execution Safety**: Always wrap file system deletions in `try-catch` blocks so that a missing file on disk does not block database deletions:

```typescript
import * as fs from 'fs';
import * as path from 'path';

function removeFileSafely(relativePath: string) {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Successfully removed file: ${relativePath}`);
    }
  } catch (error) {
    console.error(`Failed to remove file: ${relativePath}`, error);
  }
}
```
