
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import 'dotenv/config';

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  
  console.log('--- DRIZZLE MIGRATIONS ---');
  try {
    const resColMig = await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'drizzle' AND table_name = '__drizzle_migrations'");
    console.table(resColMig.rows);
    const resMig = await client.query("SELECT * FROM drizzle.__drizzle_migrations");
    console.table(resMig.rows);
  } catch (e) {
    console.log('drizzle.__drizzle_migrations table not found or error reading it');
  }

  console.log('--- PROGRAMS COLUMNS ---');
  const resCol = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'programs'");
  console.table(resCol.rows);

  await client.end();
}

main().catch(console.error);
