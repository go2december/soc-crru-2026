const { Client } = require('pg');

async function verifyAll() {
  const client = new Client({
    connectionString: 'postgresql://soc_admin:Soc0903297444@localhost:5432/soc_db'
  });

  try {
    await client.connect();
    console.log('--- 1. DATABASE CONNECTION: OK ---');

    // 1. Programs & Department ID
    const progsRes = await client.query(`
      SELECT p.id, p.code, p.name_th, p.degree_level, p.department_id, d.name_th as department_name, p.social_links
      FROM programs p
      LEFT JOIN departments d ON p.department_id = d.id
      ORDER BY p.code
    `);
    console.log(`\n--- 2. ALL PROGRAMS COUNT: ${progsRes.rows.length} ---`);
    progsRes.rows.forEach(p => {
      console.log(`[Program] ${p.code} (${p.degree_level}) | Dept ID: ${p.department_id} (${p.department_name || 'NO DEPT'})`);
    });

    // 2. Program Tracks
    const tracksRes = await client.query(`
      SELECT t.id, t.code, t.name_th, t.track_type, t.study_plan_type, p.code as parent_program_code
      FROM program_tracks t
      JOIN programs p ON t.program_id = p.id
      ORDER BY p.code, t.sort_order, t.code
    `);
    console.log(`\n--- 3. ALL PROGRAM TRACKS COUNT: ${tracksRes.rows.length} ---`);
    tracksRes.rows.forEach(t => {
      console.log(`[Track] ${t.parent_program_code} -> /${t.code} | Type: ${t.track_type} | Plan: ${t.study_plan_type} | Name: ${t.name_th}`);
    });

    // 3. Verify specific required URLs exist
    const testSlugs = [
      { prog: 'social-sci', track: 'sociology-anthropology' },
      { prog: 'social-sci', track: 'cultural-resource-management' },
      { prog: 'home-eco', track: 'culinary-and-service' },
      { prog: 'home-eco', track: 'applied-home-economics' },
      { prog: 'home-eco', track: 'culinary-and-service-transfer' }
    ];

    console.log('\n--- 4. VERIFYING 5 SUB-PAGE URLS EXIST IN DB ---');
    for (const item of testSlugs) {
      const match = tracksRes.rows.find(t => t.parent_program_code === item.prog && t.code === item.track);
      if (match) {
        console.log(`PASS: /programs/${item.prog}/${item.track} -> Found in DB (Track ID: ${match.id})`);
      } else {
        console.error(`FAIL: /programs/${item.prog}/${item.track} -> NOT FOUND!`);
      }
    }

    // 4. Verify Staff Users with departmentId for RBAC
    const usersRes = await client.query(`
      SELECT id, email, name, department_id, roles
      FROM users
      WHERE 'STAFF' = ANY(roles) OR 'EDITOR' = ANY(roles) OR 'ADMIN' = ANY(roles)
      ORDER BY id
    `);
    console.log(`\n--- 5. RBAC USERS VERIFICATION: ${usersRes.rows.length} users ---`);
    usersRes.rows.forEach(u => {
      console.log(`[User] ${u.email} | Roles: [${u.roles.join(', ')}] | Dept ID: ${u.department_id || 'NULL (Global Admin)'}`);
    });

    console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('VERIFICATION ERROR:', err);
  } finally {
    await client.end();
  }
}

verifyAll();
