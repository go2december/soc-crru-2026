import { Pool } from 'pg';
import 'dotenv/config';

async function runMigration() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not defined');
        process.exit(1);
    }

    console.log('Connecting to database...');
    const pool = new Pool({ connectionString: databaseUrl });

    try {
        console.log('🚀 Executing SQL migration...');
        
        // 1. Add columns to academic_services
        await pool.query(`
            ALTER TABLE "academic_services" ADD COLUMN IF NOT EXISTS "budget" numeric(12, 2);
            ALTER TABLE "academic_services" ADD COLUMN IF NOT EXISTS "funding_source" varchar(255);
            ALTER TABLE "academic_services" ADD COLUMN IF NOT EXISTS "sdg_ids" integer[];
            ALTER TABLE "academic_services" ADD COLUMN IF NOT EXISTS "document_url" text;
        `);
        console.log('✅ Added columns to academic_services table');

        // 2. Create academic_service_members table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "academic_service_members" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "academic_service_id" uuid NOT NULL REFERENCES "academic_services"("id") ON DELETE CASCADE,
                "staff_id" uuid NOT NULL REFERENCES "staff_profiles"("id") ON DELETE CASCADE,
                "role" varchar(50) DEFAULT 'MEMBER',
                "created_at" timestamp NOT NULL DEFAULT now()
            );
        `);
        console.log('✅ Created academic_service_members table');
        
        console.log('🎉 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
