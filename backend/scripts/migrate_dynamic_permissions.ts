import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://socadmin:socadmin123@localhost:5432/soc_db?schema=public';

  console.log('Connecting to database for Dynamic Permissions migration...');
  const client = new Client({ connectionString });
  await client.connect();

  try {
    // 1. Create system_modules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_modules (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) NOT NULL UNIQUE,
        name_th VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'General',
        route_path VARCHAR(100),
        is_workflow_required BOOLEAN NOT NULL DEFAULT false,
        is_core BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created table: system_modules');

    // 2. Create role_permissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id SERIAL PRIMARY KEY,
        role user_role NOT NULL,
        module_key VARCHAR(50) NOT NULL REFERENCES system_modules(key) ON DELETE CASCADE,
        can_create BOOLEAN NOT NULL DEFAULT false,
        can_read BOOLEAN NOT NULL DEFAULT true,
        can_update BOOLEAN NOT NULL DEFAULT false,
        can_delete BOOLEAN NOT NULL DEFAULT false,
        can_approve BOOLEAN NOT NULL DEFAULT false,
        scope_type VARCHAR(20) NOT NULL DEFAULT 'GLOBAL',
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created table: role_permissions');

    // 3. Create index
    await client.query(`
      CREATE INDEX IF NOT EXISTS role_permissions_role_module_idx 
      ON role_permissions(role, module_key);
    `);
    console.log('Created index: role_permissions_role_module_idx');

    // 4. Seed core modules
    const modules = [
      {
        key: 'dashboard',
        name_th: 'แดชบอร์ดภาพรวม',
        description: 'หน้าสถิติภาพรวมผู้เข้าชม และกิจกรรมระบบ',
        category: 'System',
        route_path: '/admin/dashboard',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'users',
        name_th: 'จัดการผู้ใช้และสิทธิ์ (RBAC)',
        description: 'ศูนย์ควบคุมผู้ใช้งาน สิทธิ์การเข้าถึง และประวัติความปลอดภัย',
        category: 'System',
        route_path: '/admin/users',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'departments',
        name_th: 'โครงสร้างและสาขาวิชา',
        description: 'จัดการข้อมูลหลักสูตรและสังกัดของสำนักวิชา',
        category: 'Organization',
        route_path: '/admin/departments',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'staff',
        name_th: 'ข้อมูลบุคลากรและอาจารย์',
        description: 'จัดการโปรไฟล์อาจารย์ บุคลากรสายสนับสนุน',
        category: 'Personnel',
        route_path: '/admin/staff',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'programs',
        name_th: 'หลักสูตรการศึกษา',
        description: 'จัดการหลักสูตร ป.ตรี ป.โท ป.เอก',
        category: 'Academic',
        route_path: '/admin/programs',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'short_courses',
        name_th: 'คอร์สระยะสั้น / Credit Bank',
        description: 'จัดการหลักสูตรสะสมหน่วยกิตและอบรมระยะสั้น',
        category: 'Academic',
        route_path: '/admin/short-courses',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'research',
        name_th: 'ฐานข้อมูลงานวิจัยและบริการวิชาการ',
        description: 'บันทึกโครงการวิจัย ทุนวิจัย และบริการวิชาการ',
        category: 'Academic',
        route_path: '/admin/research',
        is_workflow_required: false,
        is_core: true,
      },
      {
        key: 'news',
        name_th: 'ข่าวสารและประชาสัมพันธ์',
        description: 'ข่าวสาร กิจกรรม ประกาศรับสมัครงาน มีระบบตรวจรับรอง Draft',
        category: 'Public Relations',
        route_path: '/admin/news',
        is_workflow_required: true,
        is_core: true,
      },
      {
        key: 'procurement',
        name_th: 'ประกาศจัดซื้อจัดจ้าง',
        description: 'เอกสารประกวดราคา จัดซื้อจัดจ้าง มีระบบส่งตรวจ Draft',
        category: 'Procurement',
        route_path: '/admin/procurement',
        is_workflow_required: true,
        is_core: true,
      },
    ];

    for (const mod of modules) {
      await client.query(
        `
        INSERT INTO system_modules (key, name_th, description, category, route_path, is_workflow_required, is_core)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (key) DO UPDATE 
        SET name_th = EXCLUDED.name_th,
            description = EXCLUDED.description,
            category = EXCLUDED.category,
            route_path = EXCLUDED.route_path,
            is_workflow_required = EXCLUDED.is_workflow_required,
            is_core = EXCLUDED.is_core;
      `,
        [
          mod.key,
          mod.name_th,
          mod.description,
          mod.category,
          mod.route_path,
          mod.is_workflow_required,
          mod.is_core,
        ],
      );

      // Seed default permissions for ADMIN (full access)
      await client.query(`
        INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
        VALUES ('ADMIN', '${mod.key}', true, true, true, true, true, 'GLOBAL')
        ON CONFLICT DO NOTHING;
      `);

      // Seed default permissions for EDITOR
      const isWorkflow = mod.is_workflow_required;
      const isScoped = ['staff', 'programs', 'short_courses', 'research'].includes(mod.key);
      const isOrg = mod.key === 'departments';
      const isDashboard = mod.key === 'dashboard';

      if (isWorkflow) {
        await client.query(`
          INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
          VALUES ('EDITOR', '${mod.key}', true, true, true, false, false, 'GLOBAL')
          ON CONFLICT DO NOTHING;
        `);
      } else if (isScoped) {
        await client.query(`
          INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
          VALUES ('EDITOR', '${mod.key}', true, true, true, false, false, 'DEPARTMENT')
          ON CONFLICT DO NOTHING;
        `);
      } else if (isOrg || isDashboard) {
        await client.query(`
          INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
          VALUES ('EDITOR', '${mod.key}', false, true, false, false, false, 'GLOBAL')
          ON CONFLICT DO NOTHING;
        `);
      }

      // Seed default permissions for STAFF
      if (['staff', 'research'].includes(mod.key)) {
        await client.query(`
          INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
          VALUES ('STAFF', '${mod.key}', true, true, true, false, false, 'OWN')
          ON CONFLICT DO NOTHING;
        `);
      } else if (['programs', 'short_courses', 'departments'].includes(mod.key)) {
        await client.query(`
          INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
          VALUES ('STAFF', '${mod.key}', false, true, false, false, false, 'GLOBAL')
          ON CONFLICT DO NOTHING;
        `);
      }

      // GUEST has read-only or false
      await client.query(`
        INSERT INTO role_permissions (role, module_key, can_create, can_read, can_update, can_delete, can_approve, scope_type)
        VALUES ('GUEST', '${mod.key}', false, false, false, false, false, 'GLOBAL')
        ON CONFLICT DO NOTHING;
      `);
    }

    console.log('Seeded core modules and default permissions successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
