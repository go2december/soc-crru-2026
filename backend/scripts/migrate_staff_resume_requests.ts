import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function runStaffResumeRequestsMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Staff Resume Requests migration...');

    // 1. Create Enum if not exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "resume_request_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SENT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Create Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "staff_resume_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "staff_id" uuid NOT NULL REFERENCES "staff_profiles"("id") ON DELETE CASCADE,
        "requester_name" varchar(255) NOT NULL,
        "organization" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "phone" varchar(50),
        "purpose" varchar(100) NOT NULL,
        "notes" text,
        "status" "resume_request_status" DEFAULT 'PENDING' NOT NULL,
        "approved_by" uuid REFERENCES "users"("id"),
        "rejection_reason" text,
        "sent_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "staff_resume_req_staff_id_idx" ON "staff_resume_requests"("staff_id");
      CREATE INDEX IF NOT EXISTS "staff_resume_req_status_idx" ON "staff_resume_requests"("status");
      CREATE INDEX IF NOT EXISTS "staff_resume_req_email_idx" ON "staff_resume_requests"("email");
      CREATE INDEX IF NOT EXISTS "staff_resume_req_created_at_idx" ON "staff_resume_requests"("created_at");
    `);

    console.log('✅ staff_resume_requests table created successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runStaffResumeRequestsMigration();
