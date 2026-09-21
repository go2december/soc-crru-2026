import { Client } from 'pg';
import 'dotenv/config';

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  
  const res = await client.query(`
    SELECT table_name
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  `);
  
  console.log('--- Database Table Counts ---');
  for (const row of res.rows) {
    const tableRes = await client.query(`SELECT COUNT(*) FROM "public"."${row.table_name}"`);
    console.log(`${row.table_name}: ${tableRes.rows[0].count}`);
  }
  
  await client.end();
}

main().catch(console.error);
