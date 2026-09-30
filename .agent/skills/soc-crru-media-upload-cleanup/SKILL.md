---
name: soc-crru-media-upload-cleanup
description: Standards for managing secure media/document uploads, storing references, and cleaning up orphaned file-system assets.
---

# Media Upload & Asset Cleanup Guidelines

This guide specifies how to securely upload media files (images, documents, PDFs) and clean up orphaned files on the server using the shared **`UploadService`** in `backend/libs/upload`.

---

## 🦥 1. Ponytail Rung 2: Reuse `UploadService`

> [!important]
> **DO NOT** hand-roll custom `fs.unlinkSync` or write ad-hoc file-writing logic in individual controllers or services.
> The codebase already provides a robust, centralized upload manager: [`backend/libs/upload/src/upload.service.ts`](file:///e:/web2026/soc-crru-web/backend/libs/upload/src/upload.service.ts). Always inject `UploadService` from `upload/upload`.

```typescript
import { Injectable } from '@nestjs/common';
import { UploadService } from 'upload/upload';

@Injectable()
export class NewsService {
  constructor(private readonly uploadService: UploadService) {}
}
```

---

## 📂 2. Dedicated Upload Folders & Methods

The `UploadService` automatically creates subdirectories under `./uploads` and provides domain-specific methods:

| Domain | Subdirectory | Save Method | Delete / Cleanup Method | Optimization |
|---|---|---|---|---|
| **News Images** | `/uploads/news/` | `saveNewsImage(file)` | `deleteNewsFile(fileUrl)` | WebP, Max 1600px width, Q82 |
| **News Attachments** | `/uploads/news/attachments/` | `saveNewsAttachment(file)` | `deleteNewsFile(fileUrl)` | Thai UTF-8 sanitization, UUID |
| **Chiang Rai** | `/uploads/chiang-rai/` | `saveChiangRaiImage(file)` | `deleteChiangRaiImage(fileUrl)` | WebP, Max 1024px width, Q80 |
| **Research** | `/uploads/research/` | `saveResearchImage(file)` | `deleteResearchImage(fileUrl)` | WebP, Max 1600px width, Q82 |
| **Staff Profiles** | `/uploads/staff/` | `saveStaffImage(file)` | `deleteStaffImage(fileUrl)` | PNG, 768x1024 fit, Q80 |
| **Programs** | `/uploads/programs/` | `saveProgramsFile(file)` | `deleteProgramsFile(fileUrl)` | WebP 1920px (images) / raw file |
| **Procurement** | `/uploads/procurement/` | `saveProcurementFile(file)` | `deleteProcurementFile(fileUrl)` | PDF only whitelist, sanitized |

---

## 🛡️ 3. Security & Validation Rules

1. **MIME-Type Whitelist:**
   - Images: JPG, JPEG, PNG, GIF, WebP (processed by Sharp).
   - Documents: PDF, DOCX (procurement strictly restricts to PDF).
2. **Thai Character Sanitization:**
   Multer default headers can distort Thai characters (`latin1` encoding). `UploadService` automatically decodes to UTF-8 and replaces unsafe characters with `_`:
   ```typescript
   const utf8Name = Buffer.from(file.originalname, 'latin1').toString('utf8');
   const sanitizedName = utf8Name.replace(/[^a-zA-Z0-9ก-๙._-]/g, '_');
   ```
3. **Serving Assets:**
   All uploaded assets are served through the central `api-gateway` via `ServeStaticModule` mapped to `/uploads/*`.

---

## 🗑️ 4. Asset Cleanup Protocol (Preventing Storage Bloat)

To maintain disk storage hygiene:

### 4.1 Cascade Delete (On Record Deletion)
When a database record containing file URLs is deleted, call the corresponding delete method:
```typescript
async deleteNews(id: string) {
  const [record] = await this.drizzle.db
    .delete(news)
    .where(eq(news.id, id))
    .returning();

  if (record?.coverImage) {
    await this.uploadService.deleteNewsFile(record.coverImage);
  }
}
```

### 4.2 Replace on Update (New File Uploaded)
When an admin updates a record with a new file, remove the old file from disk immediately:
```typescript
async updateStaffAvatar(id: string, newAvatarUrl: string) {
  const [existing] = await this.drizzle.db
    .select({ avatarUrl: staffProfiles.avatarUrl })
    .from(staffProfiles)
    .where(eq(staffProfiles.id, id))
    .limit(1);

  if (existing?.avatarUrl && existing.avatarUrl !== newAvatarUrl) {
    await this.uploadService.deleteStaffImage(existing.avatarUrl);
  }

  await this.drizzle.db
    .update(staffProfiles)
    .set({ avatarUrl: newAvatarUrl })
    .where(eq(staffProfiles.id, id));
}
```

### 4.3 Safe Deletion (No Crash on Missing File)
The delete methods in `UploadService` wrap file operations in `fs.promises.access` and `try-catch`. They return `boolean` (`true` if deleted, `false` if file did not exist or path was invalid) so database operations never fail due to a missing disk asset.
