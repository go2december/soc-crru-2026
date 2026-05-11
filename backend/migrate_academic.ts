import { Pool } from 'pg';
import 'dotenv/config';

async function runMigration() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not defined');
        process.exit(1);
    }

    const pool = new Pool({ connectionString: databaseUrl });

    try {
        console.log('🚀 Executing SQL migration...');
        const sql = `
            CREATE TABLE IF NOT EXISTS "academic_services" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "title" varchar(255) NOT NULL,
                "description" text,
                "service_type" varchar(50) NOT NULL,
                "area" varchar(255),
                "status" varchar(50),
                "cover_image_url" text,
                "is_published" boolean DEFAULT false,
                "published_at" timestamp,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL
            );
        `;
        await pool.query(sql);
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
