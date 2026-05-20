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
    console.log('Updating null or empty slugs...');
    await pool.query(`
      UPDATE chiang_rai_learning_sites 
      SET slug = 'site-' || substr(id::text, 1, 8)
      WHERE slug IS NULL OR slug = '';
    `);
    
    console.log('Fixing duplicate slugs if any...');
    await pool.query(`
      WITH duplicates AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) as rn
        FROM chiang_rai_learning_sites
      )
      UPDATE chiang_rai_learning_sites c
      SET slug = c.slug || '-' || d.rn
      FROM duplicates d
      WHERE c.id = d.id AND d.rn > 1;
    `);

    console.log('Adding gallery_images column to academic_services...');
    await pool.query(`
      ALTER TABLE academic_services 
      ADD COLUMN IF NOT EXISTS gallery_images text[];
    `);

    console.log('Schema changes applied successfully!');
  } catch (err) {
    console.error('Error fixing slugs:', err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
