import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function runMouMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🚀 Starting MOU & Partnerships migration...');

    // 1. Create Enum if not exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "mou_partner_type" AS ENUM ('GOVERNMENT', 'COMMUNITY', 'ACADEMIC', 'PRIVATE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Create Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "mous" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(500) NOT NULL,
        "partner_name" varchar(255) NOT NULL,
        "partner_type" "mou_partner_type" DEFAULT 'GOVERNMENT' NOT NULL,
        "partner_logo_url" text,
        "scope" text,
        "start_date" timestamp,
        "end_date" timestamp,
        "is_active" boolean DEFAULT true NOT NULL,
        "document_url" text,
        "website_url" text,
        "is_published" boolean DEFAULT true NOT NULL,
        "display_order" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "mous_title_idx" ON "mous"("title");
      CREATE INDEX IF NOT EXISTS "mous_partner_type_idx" ON "mous"("partner_type");
      CREATE INDEX IF NOT EXISTS "mous_is_published_idx" ON "mous"("is_published");
    `);

    // 3. Register System Module in dynamic RBAC system_modules if present
    await client.query(`
      INSERT INTO "system_modules" ("key", "name_th", "description", "category", "route_path", "is_workflow_required", "is_core")
      VALUES ('mous', 'เครือข่ายความร่วมมือและ MOU', 'จัดการบันทึกข้อตกลงความร่วมมือและภาคีเครือข่าย', 'Research', '/admin/mou', false, true)
      ON CONFLICT ("key") DO NOTHING;

      -- Grant permissions to ADMIN, EDITOR, STAFF
      INSERT INTO "role_permissions" ("role", "module_key", "can_create", "can_read", "can_update", "can_delete", "can_approve", "scope_type")
      VALUES 
        ('ADMIN', 'mous', true, true, true, true, true, 'GLOBAL'),
        ('EDITOR', 'mous', true, true, true, true, true, 'GLOBAL'),
        ('STAFF', 'mous', false, true, false, false, false, 'GLOBAL'),
        ('GUEST', 'mous', false, true, false, false, false, 'GLOBAL')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ "mous" table and system permissions created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMouMigration().catch((e) => {
  console.error(e);
  process.exit(1);
});
