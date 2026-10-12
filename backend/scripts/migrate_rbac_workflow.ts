import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('🚀 Running migration: Add Department Scope & Publication Workflow fields...');

    // 1. Create publication_status enum
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "publication_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ publication_status enum verified.');

    // 2. Add department_id to users
    await pool.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id");
    `);
    console.log('✅ Added department_id to users.');

    // 3. Add department_id to programs
    await pool.query(`
      ALTER TABLE "programs" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id");
    `);
    console.log('✅ Added department_id to programs.');

    // 4. Add department_id to short_courses
    await pool.query(`
      ALTER TABLE "short_courses" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id");
    `);
    console.log('✅ Added department_id to short_courses.');

    // 5. Add department_id to research_projects
    await pool.query(`
      ALTER TABLE "research_projects" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id");
    `);
    console.log('✅ Added department_id to research_projects.');

    // 6. Add department_id to academic_services
    await pool.query(`
      ALTER TABLE "academic_services" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id");
    `);
    console.log('✅ Added department_id to academic_services.');

    // 7. Add workflow fields to news
    await pool.query(`
      ALTER TABLE "news" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id"),
      ADD COLUMN IF NOT EXISTS "publication_status" "publication_status" DEFAULT 'DRAFT' NOT NULL,
      ADD COLUMN IF NOT EXISTS "reviewer_id" UUID REFERENCES "users"("id"),
      ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "reject_reason" TEXT;
    `);
    // Sync existing published news to PUBLISHED status
    await pool.query(`
      UPDATE "news"
      SET "publication_status" = 'PUBLISHED'
      WHERE "is_published" = true AND "publication_status" = 'DRAFT';
    `);
    console.log('✅ Added workflow fields to news and synced published items.');

    // 8. Add workflow fields to procurement_records
    await pool.query(`
      ALTER TABLE "procurement_records" 
      ADD COLUMN IF NOT EXISTS "department_id" INTEGER REFERENCES "departments"("id"),
      ADD COLUMN IF NOT EXISTS "publication_status" "publication_status" DEFAULT 'DRAFT' NOT NULL,
      ADD COLUMN IF NOT EXISTS "reviewer_id" UUID REFERENCES "users"("id"),
      ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "reject_reason" TEXT;
    `);
    // Sync existing published procurement to PUBLISHED status
    await pool.query(`
      UPDATE "procurement_records"
      SET "publication_status" = 'PUBLISHED'
      WHERE "is_published" = true AND "publication_status" = 'DRAFT';
    `);
    console.log('✅ Added workflow fields to procurement_records and synced published items.');

    console.log('🎉 Phase 1: Database Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
