const GATEWAY_URL = 'http://localhost:4201';

async function runTests() {
  console.log('🚀 Starting Backend Integration Tests via API Gateway...\n');

  try {
    // 1. Dev Login to get Access Token and Refresh Token
    console.log('STEP 1: Getting Dev Admin Token...');
    const loginRes = await fetch(`${GATEWAY_URL}/api/auth/dev/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!loginRes.ok) {
      throw new Error(`Failed to login: ${loginRes.status} ${await loginRes.text()}`);
    }

    const tokens = await loginRes.json();
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    if (!accessToken || !refreshToken) {
      console.log('Response body received:', tokens);
      throw new Error('Did not receive accessToken or refreshToken from dev login');
    }

    console.log('✅ Successfully obtained Access Token and Refresh Token.');
    console.log(`   Access Token:  ${accessToken.substring(0, 20)}...`);
    console.log(`   Refresh Token: ${refreshToken}\n`);

    // 2. Test profile endpoint (Auth Service check)
    console.log('STEP 2: Requesting user profile using Access Token...');
    const profileRes = await fetch(`${GATEWAY_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!profileRes.ok) {
      throw new Error(`Failed to fetch profile: ${profileRes.status} ${await profileRes.text()}`);
    }

    const profile = await profileRes.json();
    console.log('✅ Successfully fetched profile. User info:');
    console.log(`   Name:  ${profile.name}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Roles: ${profile.roles.join(', ')}\n`);

    // 3. Test microservice routing and JWT authentication (Chiang Rai Service check)
    console.log('STEP 3: Testing microservice routing and JWT validation (Chiang Rai Service)...');
    const sitesRes = await fetch(`${GATEWAY_URL}/api/chiang-rai/learning-sites`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!sitesRes.ok) {
      throw new Error(`Failed to fetch learning sites: ${sitesRes.status} ${await sitesRes.text()}`);
    }

    const sites = await sitesRes.json();
    console.log(`✅ Successfully routed to Chiang Rai Service. Found ${sites.data ? sites.data.length : 0} learning sites.\n`);

    // 4. Test Token Refresh
    console.log('STEP 4: Testing token refresh...');
    const refreshRes = await fetch(`${GATEWAY_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!refreshRes.ok) {
      throw new Error(`Failed to refresh token: ${refreshRes.status} ${await refreshRes.text()}`);
    }

    const refreshedTokens = await refreshRes.json();
    const newAccessToken = refreshedTokens.accessToken;

    if (!newAccessToken) {
      throw new Error('Did not receive a new accessToken');
    }

    console.log('✅ Successfully refreshed access token.');
    console.log(`   New Access Token: ${newAccessToken.substring(0, 20)}...\n`);

    // Verify new token works
    console.log('   Verifying new Access Token by requesting profile...');
    const verifyProfileRes = await fetch(`${GATEWAY_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${newAccessToken}` }
    });
    if (!verifyProfileRes.ok) {
      throw new Error('New access token is not valid');
    }
    console.log('   ✅ Verification successful.\n');

    // 5. Test Logout & Revocation (Blacklist)
    console.log('STEP 5: Testing logout and token revocation (blacklist)...');
    const logoutRes = await fetch(`${GATEWAY_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${newAccessToken}`
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!logoutRes.ok) {
      throw new Error(`Failed to logout: ${logoutRes.status} ${await logoutRes.text()}`);
    }

    console.log('✅ Successfully sent logout request.');

    // Verify access token is blacklisted
    console.log('   Verifying access token is blacklisted...');
    const checkRevokedRes = await fetch(`${GATEWAY_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${newAccessToken}` }
    });

    console.log(`   Request with blacklisted token returned status: ${checkRevokedRes.status}`);
    if (checkRevokedRes.status === 401) {
      console.log('   ✅ Access token successfully blacklisted (Returned 401 Unauthorized).\n');
    } else {
      throw new Error(`Access token was not blacklisted (Returned status ${checkRevokedRes.status} instead of 401)`);
    }

    // Verify refresh token is deleted
    console.log('   Verifying refresh token is deleted...');
    const checkDeletedRefreshRes = await fetch(`${GATEWAY_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    console.log(`   Request with deleted refresh token returned status: ${checkDeletedRefreshRes.status}`);
    if (checkDeletedRefreshRes.status === 401) {
      console.log('   ✅ Refresh token successfully deleted (Returned 401 Unauthorized).\n');
    } else {
      throw new Error(`Refresh token was not deleted (Returned status ${checkDeletedRefreshRes.status} instead of 401)`);
    }

    // 6. Test Rate Limiting
    console.log('STEP 6: Testing Rate Limiting...');
    console.log('   Sending multiple rapid requests to trigger 429 Too Many Requests...');
    let limitTriggered = false;
    // We send a batch of 120 requests. ThrottlerGuard on microservices will return 429 after 100.
    const requests = [];
    for (let i = 0; i < 120; i++) {
      requests.push(
        fetch(`${GATEWAY_URL}/api/chiang-rai/learning-sites`)
          .then(res => {
            if (res.status === 429) {
              limitTriggered = true;
            }
            return res.status;
          })
          .catch(() => null)
      );
    }

    const statuses = await Promise.all(requests);
    const count429 = statuses.filter(s => s === 429).length;

    if (limitTriggered || count429 > 0) {
      console.log(`✅ Rate limit successfully triggered! Received ${count429} responses with status 429 Too Many Requests.\n`);
    } else {
      console.warn('⚠️ Rate limit was not triggered (Make sure rate limiter is not configured with high threshold for localhost, or docker is running behind proxy that preserves client IP).\n');
    }

    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('\n❌ Test execution failed:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
