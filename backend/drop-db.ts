import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('Recreating table chiang_rai_learning_sites...');
    await pool.query("DROP TABLE IF EXISTS chiang_rai_learning_sites CASCADE;");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "chiang_rai_learning_sites" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" varchar(500) NOT NULL,
        "slug" varchar(255) NOT NULL,
        "description" text,
        "content" text NOT NULL,
        "thumbnail_url" varchar(500),
        "media_type" varchar(50) DEFAULT 'IMAGE',
        "media_urls" text[],
        "tags" text[],
        "author" varchar(255),
        "is_published" boolean DEFAULT true,
        "published_at" timestamp DEFAULT now(),
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "chiang_rai_learning_sites_slug_unique" ON "chiang_rai_learning_sites" ("slug");
      CREATE INDEX IF NOT EXISTS "cr_learning_sites_title_idx" ON "chiang_rai_learning_sites" ("title");
      CREATE INDEX IF NOT EXISTS "cr_learning_sites_published_at_idx" ON "chiang_rai_learning_sites" ("published_at");
    `);

    console.log('✅ Recreated table.');
    await pool.end();
}

main();
