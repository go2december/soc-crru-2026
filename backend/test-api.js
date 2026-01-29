const http = require('http');

// 1. Login as Dev Admin to get Token
http.get('http://localhost:3000/api/auth/dev/login', (res) => {
    // Redirect to callback... we need to parse token from location header or response
    // But dev login redirects... wait.
    // The controller code: res.redirect(...)

    // Actually, I can call the service directly if I run this inside nest context, but that's hard.
    // Let's try to simulate the direct login flow if possible, or just hack into DB.

    // Okay, dev/login redirects to frontend with token in query param.
    // Location: http://localhost:4000/admin/callback?token=...

    const location = res.headers.location;
    console.log('Redirect Location:', location);

    if (!location) {
        console.error('No redirect location found');
        return;
    }

    const token = new URL(location).searchParams.get('token');
    console.log('Got Token:', token);

    if (!token) return;

    // 2. Now try to PATCH role
    // Need a valid user ID first. Let's list users.

    const listReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/users',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    }, (listRes) => {
        let data = '';
        listRes.on('data', chunk => data += chunk);
        listRes.on('end', () => {
            console.log('List Users Status:', listRes.statusCode);
            if (listRes.statusCode !== 200) {
                console.log('List Users Error:', data);
                return;
            }

            const users = JSON.parse(data);
            const targetUser = users[0]; // Pick first user
            console.log('TargetUser:', targetUser.email);

            // 3. Update Role
            const updateData = JSON.stringify({ roles: ['ADMIN', 'EDITOR', 'STAFF'] });
            const updateReq = http.request({
                hostname: 'localhost',
                port: 3000,
                path: `/api/auth/users/${targetUser.id}/role`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Length': updateData.length
                }
            }, (updateRes) => {
                let updateResData = '';
                updateRes.on('data', chunk => updateResData += chunk);
                updateRes.on('end', () => {
                    console.log('UpdateStatus:', updateRes.statusCode);
                    console.log('UpdateResp:', updateResData);
                });
            });

            updateReq.write(updateData);
            updateReq.end();
        });
    });

    listReq.end();

});
