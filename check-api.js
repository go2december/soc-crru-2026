const http = require('http');

console.log('Checking API connectivity to localhost:4001...\n');

const req = http.get('http://localhost:4001/api/chiang-rai/learning-sites', (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Response (first 500 chars):', data.substring(0, 500));
        }
    });
});

req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
