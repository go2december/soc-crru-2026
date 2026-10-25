const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: 'postgresql://soc_admin:Soc0903297444@localhost:5432/soc_db',
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    await client.query(`
      ALTER TABLE programs 
      ADD COLUMN IF NOT EXISTS admission_status VARCHAR(255) DEFAULT 'เปิดรับสมัครรอบปัจจุบัน (กู้ยืม กยศ. ได้ 100%)';
    `);
    console.log('Added admission_status column.');

    await client.query(`
      UPDATE programs 
      SET admission_status = 'เปิดรับสมัครรอบปัจจุบัน (กู้ยืม กยศ. ได้ 100%)' 
      WHERE admission_status IS NULL;
    `);
    console.log('Updated existing records.');

    const res = await client.query('SELECT code, name_th, admission_status FROM programs');
    console.log('Programs now in DB:');
    res.rows.forEach(r => console.log(`- ${r.code}: ${r.admission_status}`));

    await client.end();
    console.log('Migration finished successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
