const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  
  try {
    console.log('Adding media fields to programs');
    await client.query(`
      ALTER TABLE "programs" ADD COLUMN IF NOT EXISTS "gallery_images" text[];
      ALTER TABLE "programs" ADD COLUMN IF NOT EXISTS "attachments" jsonb;
      ALTER TABLE "programs" ADD COLUMN IF NOT EXISTS "youtube_video_url" character varying(500);
      ALTER TABLE "programs" ADD COLUMN IF NOT EXISTS "facebook_video_url" character varying(500);
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
