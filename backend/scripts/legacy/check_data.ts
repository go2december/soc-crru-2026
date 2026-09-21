import { Client } from 'pg';
import 'dotenv/config';

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  
  const res = await client.query(`
    SELECT table_name, 
           (SELECT count(*) FROM pg_namespace) as _count -- dummy
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  
  let totalRows = 0;
  for (const row of res.rows) {
    const tableRes = await client.query(`SELECT COUNT(*) FROM "public"."${row.table_name}"`);
    totalRows += parseInt(tableRes.rows[0].count, 10);
  }
  
  console.log(`Total rows across all tables: ${totalRows}`);
  await client.end();
}

main().catch(console.error);
