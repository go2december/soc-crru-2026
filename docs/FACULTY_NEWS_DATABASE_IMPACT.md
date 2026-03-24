# Faculty News Database Impact & Safe Rollout
**Updated:** March 24, 2026

## 📊 Database Changes Overview

### 1. Schema Changes

#### `news_category` Enum
```sql
ALTER TYPE "public"."news_category" ADD VALUE IF NOT EXISTS 'JOB';
```
- **Impact:** เพิ่ม category ใหม่ "สมัครงาน"
- **Compatibility:** `IF NOT EXISTS` ทำให้ safe บน production ที่มีอยู่แล้ว
- **Risk:** ต่ำมาก

#### `news` Table Columns
```sql
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "media_urls" text[];
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "attachments" jsonb;
ALTER TABLE "news" ALTER COLUMN "published_at" DROP NOT NULL;
```
- **media_urls:** Array สำหรับเก็บ URL รูปภาพเพิ่มเติม
- **attachments:** JSONB สำหรับเก็บ metadata ไฟล์แนบ
- **published_at:** ทำให้ nullable สำหรับรองรับ draft news

---

## 🚀 Safe Rollout Steps

### Phase 1: Preparation
1. **Backup Database**
   ```bash
   # ถ้าใช้ Docker
   docker exec soc_postgres pg_dump -U postgres soc_crru > backup_before_news.sql
   ```

2. **Review Migration Files**
   - `backend/drizzle/migrations/0003_faculty_news_assets.sql`
   - `backend/migration.sql` (manual fallback)

### Phase 2: Migration Execution

#### Option A: Drizzle Migration (Recommended)
```bash
cd backend
npm run db:generate  # ถ้าต้องการ generate ใหม่
npm run db:migrate     # รัน Drizzle migration
```

#### Option B: Manual SQL (Fallback)
```bash
cd backend
# รันผ่าน psql หรือ pgAdmin
psql -h localhost -U postgres -d soc_crru -f drizzle/migrations/0003_faculty_news_assets.sql
```

#### Option C: Docker Exec
```bash
docker exec -i soc_postgres psql -U postgres -d soc_crru < backend/drizzle/migrations/0003_faculty_news_assets.sql
```

### Phase 3: Verification
```sql
-- ตรวจ enum
SELECT unnest(enum_range(NULL::news_category));

-- ตรวจ table structure
\d news;

-- ตรวจ columns ใหม่
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'news' 
AND column_name IN ('media_urls', 'attachments', 'published_at');
```

---

## 🔍 Impact Analysis

### Backward Compatibility
- ✅ **Existing Data:** ไม่กระทบข้อมูลเดิม
- ✅ **Existing Code:** ใช้ `IF NOT EXISTS` ทำให้ safe
- ✅ **API Endpoints:** เพิ่มใหม่ ไม่แก้เดิม

### Performance Impact
- 📈 **Storage:** เพิ่ม storage สำหรับ media URLs และ attachments
- 📈 **Query:** การ query จะมีข้อมูลเพิ่ม แต่ไม่กระทบ performance มาก
- 📈 **Index:** อาจต้องพิจารณา index บน `published_at` ถ้า query บ่อย

### File System Impact
- 📁 **New Directories:** `./uploads/news/attachments`
- 📁 **Permissions:** ต้องแน่ใจว่า backend สามารถ write ได้

---

## 🛠️ Rollback Plan

### If Migration Fails
```sql
-- ลบ columns ใหม่ (ถ้าต้องการ rollback)
ALTER TABLE "news" DROP COLUMN IF EXISTS "media_urls";
ALTER TABLE "news" DROP COLUMN IF EXISTS "attachments";
ALTER TABLE "news" ALTER COLUMN "published_at" SET NOT NULL;

-- ลบ enum value (complicated บน PostgreSQL)
-- แนะนำให้ใช้ backup/restore แทน
```

### Quick Rollback
```bash
# Restore from backup
docker exec -i soc_postgres psql -U postgres -d soc_crru < backup_before_news.sql
```

---

## 📋 Post-Migration Checklist

### Database Verification
- [ ] `news_category` enum มี 'JOB' แล้ว
- [ ] `news.media_urls` column มีอยู่ (array)
- [ ] `news.attachments` column มีอยู่ (jsonb)
- [ ] `news.published_at` เป็น nullable
- [ ] ไม่มี error ใน migration logs

### Application Verification
- [ ] Backend start ปกติ
- [ ] Admin pages ทำงาน
- [ ] Public pages ทำงาน
- [ ] Upload directories สร้างอัตโนมัติ

### File System Verification
- [ ] `./uploads/news` exists และ writable
- [ ] `./uploads/news/attachments` exists และ writable
- [ ] Permission ถูกต้อง (755 หรือ 775)

---

## 🚨 Potential Issues & Solutions

### Issue 1: Enum Value Already Exists
**Problem:** `JOB` already exists in enum
**Solution:** `IF NOT EXISTS` clause handles this automatically

### Issue 2: Permission Denied
**Problem:** Cannot alter table
**Solution:** Check database user permissions, use superuser if needed

### Issue 3: File System Permissions
**Problem:** Backend cannot write to upload directories
**Solution:**
```bash
# บน Linux/Mac
chmod -R 755 ./uploads
chown -R $(whoami):$(whoami) ./uploads

# บน Docker อาจต้อง mount volumes ถูกต้อง
```

### Issue 4: Migration Timeout
**Problem:** Large table causes timeout
**Solution:** Run migration during low traffic, consider splitting into smaller migrations

---

## 📈 Monitoring After Rollout

### Database Metrics
- Monitor table size growth
- Monitor query performance on news table
- Monitor storage usage for attachments

### Application Metrics
- Monitor upload success rates
- Monitor file cleanup operations
- Monitor error logs for file operations

### File System Metrics
- Monitor disk space usage in uploads directory
- Monitor file count growth

---

## 🎯 Success Criteria

Rollout สำเร็จเมื่อ:

- ✅ Migration รันสำเร็จโดยไม่มี error
- ✅ Application ทำงานปกติ
- ✅ สามารถสร้าง/แก้ไข/ลบข่าวได้
- ✅ สามารถอัปโหลดรูปและไฟล์แนบได้
- ✅ File cleanup ทำงานเมื่อลบข่าว
- ✅ Public pages แสดงข่าวถูกต้อง
- ✅ Performance ไม่ลดลงอย่างเห็นได้

---

## 📞 Support Contacts

- **Database Issues:** ติดต่อ DBA
- **Application Issues:** ติดต่อ Development Team
- **File System Issues:** ติดต่อ DevOps Team

---

**Migration Approved By:** ________________________  
**Migration Date:** ________________________  
**Migration Performed By:** ________________________
