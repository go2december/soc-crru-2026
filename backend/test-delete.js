const http = require('http');

const request = (options, body = null) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
};

(async () => {
    try {
        console.log('--- Debug Delete User ---');

        // 1. Get Token (Assume Dev Admin)
        const loginRes = await new Promise((resolve) => {
            http.get('http://localhost:3000/api/auth/dev/login', resolve);
        });
        const location = loginRes.headers.location;
        if (!location) throw new Error('Cannot login: No redirect');
        const token = new URL(location).searchParams.get('token');
        console.log('Got Token:', token ? 'YES' : 'NO');

        // 2. List Users
        const listRes = await request({
            hostname: 'localhost', port: 3000, path: '/api/auth/users', method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = JSON.parse(listRes.data);

        // 3. Find Candidate (Create new Dummy User to be safe)
        // Hard to create via API if google auth only.
        // Let's pick latest user that is NOT admin.
        const me = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const victim = users.find(u => u.email !== me.email && u.email !== 'admin@soc.crru.ac.th');

        if (!victim) {
            console.log('No victim found. Cannot test delete.');
            return;
        }

        console.log(`Target: ${victim.email} (${victim.id})`);

        // 4. DELETE
        const delRes = await request({
            hostname: 'localhost', port: 3000,
            path: `/api/auth/users/${victim.id}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Status:', delRes.statusCode);
        console.log('Response:', delRes.data); // Print Error Message Here

    } catch (e) {
        console.error('Script Error:', e.message);
    }
})();
