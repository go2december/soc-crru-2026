const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  
  try {
    console.log('Creating admission_schedule_status enum if not exists');
    try {
      await client.query(`CREATE TYPE "public"."admission_schedule_status" AS ENUM('CLOSED', 'OPEN', 'UPCOMING', 'ALWAYS');`);
    } catch(e) {
      console.log('Enum may already exist');
    }

    console.log('Creating admission_config table');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "admission_config" (
        "id" integer PRIMARY KEY DEFAULT 1,
        "youtube_video_url" varchar(500),
        "brochure_url" varchar(500),
        "bachelor_link" varchar(500),
        "graduate_link" varchar(500),
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('Creating admission_schedules table');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "admission_schedules" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "round_name" varchar(255) NOT NULL,
        "description" varchar(500),
        "period" varchar(255) NOT NULL,
        "channel" varchar(255) NOT NULL,
        "status" "public"."admission_schedule_status" DEFAULT 'UPCOMING' NOT NULL,
        "link" varchar(500),
        "sort_order" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    console.log('Creating admission_documents table');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "admission_documents" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(500) NOT NULL,
        "file_url" varchar(500) NOT NULL,
        "sort_order" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Add table_title column if it doesn't exist yet
    console.log('Adding table_title to admission_config (if needed)');
    try {
      await client.query(`
        ALTER TABLE "admission_config"
        ADD COLUMN IF NOT EXISTS "table_title" varchar(255) DEFAULT 'ตารางรอบรับสมัคร ประจำปีการศึกษา 2569';
      `);
    } catch(e) {
      console.log('table_title column may already exist');
    }

    console.log('Migration complete!');
  } catch(e) {
    console.error('Migration failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}

run();
