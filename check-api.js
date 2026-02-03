const http = require('http');

console.log('Checking API connectivity to localhost:4001...');

const req = http.get('http://localhost:4001/api/staff', (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Response (first 100 chars):', data.substring(0, 100));
    });
});

req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
