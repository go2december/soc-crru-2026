import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'chiang_rai_learning_sites'");
    console.log('Columns:', res.rows);
    await pool.end();
}

main();
