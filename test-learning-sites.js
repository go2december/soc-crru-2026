const http = require('http');

const API_URL = 'http://localhost:4001';

console.log('Testing Learning Sites Thumbnail URLs...\n');

http.get(`${API_URL}/api/chiang-rai/learning-sites`, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const sites = json.data || [];
        
        console.log(`Found ${sites.length} learning sites\n`);
        
        sites.forEach((site, index) => {
            console.log(`${index + 1}. ${site.title}`);
            console.log(`   Original thumbnailUrl: ${site.thumbnailUrl}`);
            
            // Simulate the fix
            const fixedUrl = site.thumbnailUrl && !site.thumbnailUrl.startsWith('http')
                ? `${API_URL}${site.thumbnailUrl}`
                : site.thumbnailUrl;
            
            console.log(`   Fixed thumbnailUrl:    ${fixedUrl}`);
            console.log('');
        });
        
        console.log('\n=== Test Complete ===');
        console.log('To see the images in browser, try these URLs:');
        sites.forEach((site, i) => {
            const fixedUrl = site.thumbnailUrl && !site.thumbnailUrl.startsWith('http')
                ? `${API_URL}${site.thumbnailUrl}`
                : site.thumbnailUrl;
            console.log(`${i + 1}. ${fixedUrl}`);
        });
    });
}).on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
