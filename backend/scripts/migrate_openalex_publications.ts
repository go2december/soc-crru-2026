import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('Migrating OpenAlex columns and staff_publications table...');

    await pool.query(`
      ALTER TABLE staff_profiles
      ADD COLUMN IF NOT EXISTS openalex_author_id VARCHAR(100),
      ADD COLUMN IF NOT EXISTS openalex_synced_at TIMESTAMP;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff_publications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        staff_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
        openalex_work_id VARCHAR(100) NOT NULL,
        doi VARCHAR(255),
        title TEXT NOT NULL,
        publication_year INTEGER,
        publication_date VARCHAR(20),
        journal_name VARCHAR(500),
        type VARCHAR(100),
        cited_by_count INTEGER NOT NULL DEFAULT 0,
        is_oa BOOLEAN NOT NULL DEFAULT FALSE,
        oa_url VARCHAR(1000),
        authors JSONB,
        synced_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS staff_publications_staff_work_idx
      ON staff_publications (staff_profile_id, openalex_work_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS staff_publications_staff_id_idx
      ON staff_publications (staff_profile_id);
    `);

    console.log('OpenAlex migration completed.');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
