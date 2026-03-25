const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  
  try {
    console.log('Adding is_active to programs');
    await client.query(`
      ALTER TABLE "programs" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
    `);

    console.log('Creating program_instructor_role enum');
    try {
      await client.query(`CREATE TYPE "public"."program_instructor_role" AS ENUM('CHAIR', 'MEMBER');`);
    } catch(e) {
      console.log('Enum may already exist');
    }

    console.log('Creating program_instructors table');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "program_instructors" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "program_id" uuid NOT NULL REFERENCES "programs"("id") ON DELETE cascade ON UPDATE no action,
        "staff_id" uuid NOT NULL REFERENCES "staff_profiles"("id") ON DELETE cascade ON UPDATE no action,
        "role" "public"."program_instructor_role" DEFAULT 'MEMBER' NOT NULL,
        "sort_order" integer DEFAULT 0 NOT NULL
      );
    `);
    
    console.log('Migration complete!');
  } catch(e) {
    console.error('Migration failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}

run();
