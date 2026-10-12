import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function runSecurityAuditMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Security & Audit Logs migration...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "user_email" varchar(255),
        "user_name" varchar(255),
        "action" varchar(100) NOT NULL,
        "target_resource" varchar(100) NOT NULL,
        "target_id" varchar(255),
        "details" jsonb,
        "ip_address" varchar(100),
        "user_agent" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs"("user_id");
      CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs"("action");
      CREATE INDEX IF NOT EXISTS "audit_logs_target_resource_idx" ON "audit_logs"("target_resource");
      CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs"("created_at");
    `);

    console.log('✅ "audit_logs" table and indexes created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSecurityAuditMigration().catch((e) => {
  console.error(e);
  process.exit(1);
});
