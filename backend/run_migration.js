
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: 'postgresql://soc_admin:soc_secure_pass@localhost:5432/soc_db',
});

async function runCallback() {
    try {
        const sqlPath = path.join(__dirname, 'drizzle', 'migrations', '0001_chiang_rai_module.sql');
        console.log(`Reading SQL from: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Executing SQL...');
        await pool.query(sql);
        console.log('✅ Migration success! Tables and Enums created.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await pool.end();
    }
}

runCallback();
