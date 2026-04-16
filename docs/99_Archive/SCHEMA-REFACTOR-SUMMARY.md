# Schema Refactoring Summary - Learning Sites

## Overview
ปรับปรุงโครงสร้างฐานข้อมูลของ "แหล่งเรียนรู้ทางวัฒนธรรม" ให้เป็น Normalized Form ตามหลักการออกแบบฐานข้อมูลที่ดี

---

## 📊 New Schema Structure

### 1. ตารางหลัก: `chiang_rai_learning_sites` (Posts equivalent)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | รหัสแหล่งเรียนรู้ |
| `title` | VARCHAR(500) | ชื่อสถานที่ |
| `slug` | VARCHAR(255, Unique) | URL slug |
| `type` | ENUM | ประเภท (MUSEUM, TEMPLE, etc.) |
| `description` | TEXT | คำอธิบายสั้น |
| `content` | TEXT | เนื้อหาเต็ม (HTML) |
| `address` | TEXT | ที่อยู่ |
| `subdistrict` | VARCHAR(255) | ตำบล |
| `district` | VARCHAR(255) | อำเภอ |
| `province` | VARCHAR(255) | จังหวัด |
| `postalCode` | VARCHAR(10) | รหัสไปรษณีย์ |
| `latitude` | VARCHAR(50) | พิกัดละติจูด |
| `longitude` | VARCHAR(50) | พิกัดลองจิจูด |
| `phone` | VARCHAR(50) | เบอร์โทรศัพท์ |
| `email` | VARCHAR(255) | อีเมล |
| `website` | VARCHAR(500) | เว็บไซต์ |
| `facebook` | VARCHAR(500) | Facebook URL |
| `lineOfficial` | VARCHAR(255) | LINE Official |
| `openingHours` | TEXT | เวลาเปิด-ปิด |
| `closedDays` | TEXT[] | วันปิด |
| `admissionFee` | VARCHAR(255) | ค่าเข้าชม |
| `isFree` | BOOLEAN | เข้าฟรีหรือไม่ |
| `facilities` | TEXT[] | สิ่งอำนวยความสะดวก |
| `isPublished` | BOOLEAN | เผยแพร่แล้ว |
| `isFeatured` | BOOLEAN | แนะนำ |
| `publishedAt` | TIMESTAMP | วันที่เผยแพร่ |
| `authorId` | UUID (FK → users.id) | ผู้เขียน |
| `sortOrder` | INTEGER | ลำดับการแสดงผล |
| `createdAt` | TIMESTAMP | วันที่สร้าง |
| `updatedAt` | TIMESTAMP | วันที่แก้ไข |

---

### 2. ตาราง: `chiang_rai_media` (Media)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | รหัสไฟล์สื่อ |
| `learningSiteId` | UUID (FK → chiang_rai_learning_sites.id, **ON DELETE CASCADE**) | เชื่อมโยงแหล่งเรียนรู้ |
| `fileUrl` | VARCHAR(500) | URL/Path ของไฟล์ |
| `mediaType` | ENUM (IMAGE, VIDEO, PDF, AUDIO, DOCUMENT) | ประเภทไฟล์ |
| `caption` | VARCHAR(500) | คำอธิบายภาพ |
| `isThumbnail` | BOOLEAN | เป็นรูปปกหรือไม่ |
| `sortOrder` | INTEGER | ลำดับการแสดงผล |
| `createdAt` | TIMESTAMP | วันที่อัปโหลด |

**Indexes:**
- `cr_media_learning_site_id_idx`
- `cr_media_type_idx`
- `cr_media_is_thumbnail_idx`

---

### 3. ตาราง: `chiang_rai_tags` (Tags)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | รหัส Tag |
| `name` | VARCHAR(100, **Unique**) | ชื่อ Tag |
| `slug` | VARCHAR(100, **Unique**) | Slug ของ Tag |
| `createdAt` | TIMESTAMP | วันที่สร้าง |

---

### 4. ตาราง: `chiang_rai_learning_sites_tags` (Post_Tags Junction)

| Field | Type | Description |
|-------|------|-------------|
| `learningSiteId` | UUID (FK → chiang_rai_learning_sites.id, **ON DELETE CASCADE**) | รหัสแหล่งเรียนรู้ |
| `tagId` | UUID (FK → chiang_rai_tags.id, **ON DELETE CASCADE**) | รหัส Tag |

**Primary Key:** Composite (learningSiteId, tagId)

**Indexes:**
- `cr_learning_sites_tags_pk`
- `cr_learning_sites_tags_tag_id_idx`

---

## 🔄 Enum Types

### `cr_learning_site_type`
- MUSEUM - พิพิธภัณฑ์
- CULTURAL_CENTER - ศูนย์วัฒนธรรม
- COMMUNITY - ชุมชนท่องเที่ยว
- TEMPLE - วัด
- HISTORICAL_SITE - โบราณสถาน
- LOCAL_WISDOM - ศูนย์ภูมิปัญญา
- ART_SPACE - พื้นที่ศิลปะ
- OTHER - อื่นๆ

### `cr_media_type`
- IMAGE
- VIDEO
- PDF
- AUDIO
- DOCUMENT

---

## 📝 Key Changes from Previous Schema

### ❌ Removed (Denormalized Arrays)
- `thumbnailUrl` (VARCHAR) → ✅ Moved to `chiang_rai_media` with `isThumbnail=true`
- `imageUrls` (TEXT[]) → ✅ Moved to `chiang_rai_media`
- `videoUrls` (TEXT[]) → ✅ Moved to `chiang_rai_media`
- `tags` (TEXT[]) → ✅ Moved to `chiang_rai_tags` + junction table
- `author` (VARCHAR) → ✅ Changed to `authorId` (FK → users.id)

### ✅ New Features
1. **Media Management**
   - Multiple media files per learning site
   - Support for IMAGE, VIDEO, PDF, AUDIO, DOCUMENT
   - Caption for each media
   - Thumbnail selection (isThumbnail flag)
   - Sort order for gallery

2. **Tag System**
   - Reusable tags across learning sites
   - Many-to-many relationship
   - Auto-create tags if not exist
   - Unique slug for each tag

3. **Cascade Delete**
   - Deleting a learning site automatically deletes its media and tag relations
   - Deleting a tag automatically removes it from all learning sites

---

## 🔌 API Changes

### Response Format (GET /learning-sites)

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "หอฝิ่น อุทยานสามเหลี่ยมทองคำ",
      "slug": "hall-of-opium-golden-triangle",
      "type": "MUSEUM",
      "description": "...",
      "content": "...",
      "media": [
        {
          "id": "uuid",
          "fileUrl": "https://example.com/image.jpg",
          "mediaType": "IMAGE",
          "caption": "หอฝิ่น",
          "isThumbnail": true,
          "sortOrder": 0
        }
      ],
      "tags": [
        {
          "id": "uuid",
          "name": "พิพิธภัณฑ์",
          "slug": "พิพิธภัณฑ์"
        }
      ],
      "thumbnail": {
        "id": "uuid",
        "fileUrl": "https://example.com/image.jpg",
        "mediaType": "IMAGE",
        "isThumbnail": true
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

### New Endpoints
- `GET /api/chiang-rai/tags` - Get all tags

---

## 🛠️ Migration Steps

### 1. Generate Migration
```bash
cd backend
npx drizzle-kit generate
```

### 2. Run Migration
```bash
npx drizzle-kit migrate
```

### 3. Data Migration (if existing data)
- Media arrays → Insert into `chiang_rai_media`
- Tags arrays → Insert into `chiang_rai_tags` + junction table
- `author` string → Map to `authorId` (or keep NULL for legacy data)

---

## 📱 Frontend Changes

### Create/Edit Form
- **Media Upload:**
  - Separate thumbnail upload
  - Gallery upload (multiple files)
  - Set any image as thumbnail
  - Remove images from gallery
  - Preview grid

- **Tags:**
  - Same tag input UI (auto-complete ready)
  - Backend handles tag creation/reuse

### Public Pages
- **Listing:** Use `thumbnail` from media array
- **Detail:** 
  - Gallery view with all media
  - Filter by media type (IMAGE, VIDEO, PDF)
  - Tags with links to filtered views

---

## ✅ Benefits

1. **Data Integrity**
   - Foreign key constraints prevent orphaned records
   - Cascade delete maintains consistency

2. **Query Performance**
   - Indexes on foreign keys
   - Efficient filtering by tag
   - Efficient media queries

3. **Flexibility**
   - Reusable tags
   - Multiple media types
   - Sortable gallery
   - Rich media metadata (caption, type)

4. **Scalability**
   - No array size limits
   - Efficient pagination
   - Easy to add new features (ratings, comments, etc.)

---

## 📄 Files Modified

### Backend
- ✅ `backend/src/drizzle/schema.ts` - New normalized tables
- ✅ `backend/src/chiang-rai/chiang-rai.service.ts` - Updated CRUD with media/tags
- ✅ `backend/src/chiang-rai/chiang-rai.controller.ts` - Added /tags endpoint
- ✅ `backend/drizzle/migrations/*.sql` - New migration files

### Frontend
- ✅ `frontend/app/chiang-rai-studies/admin/learning-sites/create/page.tsx` - Updated form
- ⏳ `frontend/app/chiang-rai-studies/admin/learning-sites/edit/[id]/page.tsx` - To be updated
- ⏳ `frontend/app/chiang-rai-studies/learning-sites/page.tsx` - To use thumbnail from media
- ⏳ `frontend/app/chiang-rai-studies/learning-sites/[slug]/page.tsx` - To display gallery

---

## 🚀 Next Steps

1. ✅ Run migration to create new tables
2. ✅ Test create/edit forms
3. ⏳ Update edit page to match create page
4. ⏳ Update public pages to display media gallery
5. ⏳ Add tag filtering on public listing
6. ⏳ Add media type filtering (show only videos, etc.)

---

## 📞 Support

For questions or issues, contact: **ศูนย์เชียงรายศึกษา**
