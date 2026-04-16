# ✅ Schema Simplified - แหล่งเรียนรู้ทางวัฒนธรรม (Blog-Style)

## Overview
ปรับปรุงฐานข้อมูล "แหล่งเรียนรู้ทางวัฒนธรรม" จากสถานที่ → **Blog/Academic Articles** สำหรับนำเสนอข้อมูลทางวิชาการของผู้เชี่ยวชาญ

---

## 📊 Simplified Database Schema

### 1. **chiang_rai_learning_sites** (ตารางหลัก - Blog Posts)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, defaultRandom() | รหัสบทความ |
| `title` | VARCHAR(500) | NOT NULL | ชื่อบทความ |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| `description` | TEXT | - | คำอธิบายสั้น (abstract) |
| `content` | TEXT | - | เนื้อหาเต็ม (HTML/Markdown) |
| **Publishing** | | | |
| `isPublished` | BOOLEAN | DEFAULT true | เผยแพร่แล้ว |
| `isFeatured` | BOOLEAN | DEFAULT false | แนะนำ |
| `publishedAt` | TIMESTAMP | DEFAULT NOW() | วันที่เผยแพร่ |
| **Metadata** | | | |
| `authorId` | UUID | FK → users.id | ผู้เขียน |
| `sortOrder` | INTEGER | DEFAULT 0 | ลำดับการแสดงผล |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | วันที่แก้ไข |

**Indexes:**
- `cr_learning_sites_title_idx` (title)
- `cr_learning_sites_slug_idx` (slug)
- `cr_learning_sites_published_at_idx` (publishedAt)
- `cr_learning_sites_featured_idx` (isFeatured)
- `cr_learning_sites_author_id_idx` (authorId)

---

### 2. **chiang_rai_media** (ไฟล์สื่อ) - คงเดิม

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | รหัสไฟล์ |
| `learningSiteId` | UUID | FK, CASCADE DELETE | FK → learning_sites |
| `fileUrl` | VARCHAR(500) | NOT NULL | URL ไฟล์ |
| `mediaType` | ENUM | NOT NULL | IMAGE, VIDEO, PDF, AUDIO, DOCUMENT |
| `caption` | VARCHAR(500) | - | คำอธิบายภาพ |
| `isThumbnail` | BOOLEAN | DEFAULT false | รูปปก |
| `sortOrder` | INTEGER | DEFAULT 0 | ลำดับ |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | วันที่อัปโหลด |

---

### 3. **chiang_rai_tags** (แท็ก) - คงเดิม

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | รหัส Tag |
| `name` | VARCHAR(100) | UNIQUE | ชื่อ Tag |
| `slug` | VARCHAR(100) | UNIQUE | Slug |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |

---

### 4. **chiang_rai_learning_sites_tags** (Junction) - คงเดิม

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `learningSiteId` | UUID | FK, CASCADE DELETE | FK → learning_sites |
| `tagId` | UUID | FK, CASCADE DELETE | FK → tags |

**Primary Key:** Composite (learningSiteId, tagId)

---

## ❌ Removed Fields (สถานที่ → บทความ)

### From `chiang_rai_learning_sites`:
- ❌ `type` (ENUM - MUSEUM, TEMPLE, etc.)
- ❌ `address`, `subdistrict`, `district`, `province`, `postalCode`
- ❌ `latitude`, `longitude`
- ❌ `phone`, `email`, `website`, `facebook`, `lineOfficial`
- ❌ `openingHours`, `closedDays`
- ❌ `admissionFee`, `isFree`
- ❌ `facilities` (ARRAY)

### Removed Enums:
- ❌ `cr_learning_site_type` (8 types)

### Kept Enums:
- ✅ `cr_media_type` (IMAGE, VIDEO, PDF, AUDIO, DOCUMENT)

---

## 📝 Sample Data (Blog-Style)

```typescript
{
  id: "uuid",
  title: "อัตลักษณ์ล้านนา: การอนุรักษ์และการพัฒนา",
  slug: "lanna-identity-preservation-development",
  description: "บทความวิชาการว่าด้วยการรักษาอัตลักษณ์ล้านนาในยุควัฒนธรรมโลกาภิวัตน์",
  content: "<p>เนื้อหาฉบับเต็ม...</p>",
  isPublished: true,
  isFeatured: true,
  authorId: "uuid",
  sortOrder: 0,
  
  // Media (1 thumbnail + gallery)
  media: [
    {
      fileUrl: "https://example.com/lanna-culture.jpg",
      mediaType: "IMAGE",
      caption: "วัฒนธรรมล้านนา",
      isThumbnail: true,
      sortOrder: 0
    }
  ],
  
  // Tags (Many-to-Many)
  tags: [
    { id: "uuid-1", name: "ล้านนา", slug: "ล้านนา" },
    { id: "uuid-2", name: "วัฒนธรรม", slug: "วัฒนธรรม" },
    { id: "uuid-3", name: "อัตลักษณ์", slug: "อัตลักษณ์" }
  ]
}
```

---

## 🔄 API Changes

### GET /api/chiang-rai/learning-sites

**Before (สถานที่):**
```
?type=TEMPLE&district=เมือง&q=วัด&tag=ศิลปะ
```

**After (บทความ):**
```
?q=ล้านนา&tag=วัฒนธรรม&page=1&limit=12
```

### Response Format:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "อัตลักษณ์ล้านนา: การอนุรักษ์และการพัฒนา",
      "slug": "lanna-identity-preservation-development",
      "description": "บทความวิชาการว่าด้วย...",
      "content": "<p>...</p>",
      "isPublished": true,
      "isFeatured": true,
      "publishedAt": "2026-03-18T...",
      "authorId": "uuid",
      "media": [...],
      "tags": [...],
      "thumbnail": {...}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 10,
    "totalPages": 1
  }
}
```

---

## 📁 Files Modified

### Backend (3 files)
| File | Changes |
|------|---------|
| `backend/src/drizzle/schema.ts` | ✅ Removed `cr_learning_site_type` enum |
| `backend/src/drizzle/schema.ts` | ✅ Simplified `chiang_rai_learning_sites` table |
| `backend/src/chiang-rai/chiang-rai.service.ts` | ✅ Removed type filtering |
| `backend/src/chiang-rai/chiang-rai.service.ts` | ✅ Updated sample data (blog posts) |
| `backend/src/chiang-rai/chiang-rai.controller.ts` | ✅ Removed `type` query parameter |

### Frontend (2 files)
| File | Changes |
|------|---------|
| `frontend/app/chiang-rai-studies/admin/learning-sites/create/page.tsx` | ✅ Removed type selector |
| `frontend/app/chiang-rai-studies/admin/learning-sites/create/page.tsx` | ✅ Removed location/contact sections |
| `frontend/app/chiang-rai-studies/admin/learning-sites/create/page.tsx` | ✅ Removed facilities section |
| `frontend/app/chiang-rai-studies/learning-sites/page.tsx` | ✅ Removed type filter bar |
| `frontend/app/chiang-rai-studies/learning-sites/page.tsx` | ✅ Updated to blog-style cards |

---

## 🎯 New Use Case

### Before (สถานที่):
```
ผู้ใช้ค้นหาสถานที่ท่องเที่ยวทางวัฒนธรรม
→ กรองตามประเภท (พิพิธภัณฑ์, วัด, ฯลฯ)
→ ดูข้อมูลที่ตั้ง, เวลาเปิด-ปิด, ค่าเข้าชม
```

### After (บทความ):
```
ผู้อ่านค้นหางานวิชาการจากผู้เชี่ยวชาญ
→ กรองตามแท็ก (ล้านนา, วัฒนธรรม, ประวัติศาสตร์)
→ อ่านบทความออนไลน์
```

---

## 🚀 Migration Steps

### 1. Generate Migration
```bash
cd backend
npx drizzle-kit generate
```

### 2. Run Migration
```bash
npx drizzle-kit migrate
```

### 3. Data Migration (ถ้ามีข้อมูลเดิม)
- ข้อมูลสถานที่เดิม → ย้ายไปตารางอื่น หรือ archive
- สร้างข้อมูลบทความตัวอย่างใหม่

---

## ✅ Benefits

### Simplified Schema:
- ✅ **11 fields** in main table (from 33 fields)
- ✅ **1 enum** (from 2 enums)
- ✅ **Focused purpose** (blog posts vs places)

### Better Performance:
- ✅ Fewer indexes
- ✅ Simpler queries
- ✅ Faster writes

### Easier Maintenance:
- ✅ Less fields to manage
- ✅ Clear data model
- ✅ Focused domain

### Content-Focused:
- ✅ Academic articles
- ✅ Expert knowledge
- ✅ Tag-based discovery
- ✅ Rich text content

---

## 📊 Schema Comparison

| Aspect | Before (Places) | After (Blog) |
|--------|-----------------|--------------|
| **Main Table Fields** | 33 | 11 |
| **Enums** | 2 (16 values) | 1 (5 values) |
| **Indexes** | 6 | 5 |
| **Query Complexity** | High (joins + filters) | Medium (joins + tags) |
| **Use Case** | Place directory | Academic blog |

---

## 🎉 Status: **COMPLETE**

Schema simplified successfully:
- ✅ Removed location-based fields
- ✅ Removed `cr_learning_site_type` enum
- ✅ Updated service methods
- ✅ Updated admin forms
- ✅ Updated public listing
- ✅ Migration generated

**Ready for blog-style academic content!**
