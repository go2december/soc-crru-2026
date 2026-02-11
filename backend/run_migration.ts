
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function runMigration() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not defined');
        process.exit(1);
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const db = drizzle(pool);

    try {
        console.log('📦 Reading migration file...');
        const sqlPath = path.join(__dirname, 'drizzle', 'migrations', '0001_chiang_rai_module.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing SQL migration...');
        await pool.query(sql);

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
