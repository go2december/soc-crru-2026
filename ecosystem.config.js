const fs = require('fs');
const path = require('path');

// Helper to load .env file dynamically
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;
      const index = line.indexOf('=');
      if (index > 0) {
        const key = line.slice(0, index).trim();
        let value = line.slice(index + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    }
  }
  return env;
}

const rootEnv = loadEnv();

const dbUrl = rootEnv.DATABASE_URL || 'postgresql://soc_admin:Soc0903297444@localhost:5432/soc_db';
const jwtSecret = rootEnv.JWT_SECRET || 'super-secret-key-change-this-in-production';
const googleClientId = rootEnv.GOOGLE_CLIENT_ID || '';
const googleClientSecret = rootEnv.GOOGLE_CLIENT_SECRET || '';

module.exports = {
  apps: [
    // 1. API Gateway
    {
      name: 'soc-api-gateway',
      script: 'dist/apps/api-gateway/main.js',
      cwd: './backend',
      env: {
        PORT: 4201, // Gateway binds directly to 4201 on host Windows
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
        FRONTEND_URL: 'http://localhost:4200',
        AUTH_SERVICE_HOST: 'localhost',
        NEWS_SERVICE_HOST: 'localhost',
        CHIANG_RAI_SERVICE_HOST: 'localhost',
        PROGRAMS_SERVICE_HOST: 'localhost',
        STAFF_SERVICE_HOST: 'localhost',
        RESEARCH_SERVICE_HOST: 'localhost',
      }
    },
    // 2. Auth Service
    {
      name: 'soc-auth-service',
      script: 'dist/apps/auth-service/main.js',
      cwd: './backend',
      env: {
        PORT: 3001,
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
        FRONTEND_URL: 'http://localhost:4200',
        GOOGLE_CLIENT_ID: googleClientId,
        GOOGLE_CLIENT_SECRET: googleClientSecret,
        GOOGLE_CALLBACK_URL: 'http://localhost:4201/api/auth/google/callback',
      }
    },
    // 3. News Service
    {
      name: 'soc-news-service',
      script: 'dist/apps/news-service/main.js',
      cwd: './backend',
      env: {
        PORT: 3002,
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
      }
    },
    // 4. Chiang Rai Service
    {
      name: 'soc-chiang-rai-service',
      script: 'dist/apps/chiang-rai-service/main.js',
      cwd: './backend',
      env: {
        PORT: 3003,
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
      }
    },
    // 5. Programs Service
    {
      name: 'soc-programs-service',
      script: 'dist/apps/programs-service/main.js',
      cwd: './backend',
      env: {
        PORT: 3004,
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
      }
    },
    // 6. Staff Service
    {
      name: 'soc-staff-service',
      script: 'dist/apps/staff-service/main.js',
      cwd: './backend',
      env: {
        PORT: 3005,
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
      }
    },
    // 7. Research Service
    {
      name: 'soc-research-service',
      script: 'dist/apps/research-service/main.js',
      cwd: './backend',
      env: {
        PORT: 3006,
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
      }
    },
    // 8. Next.js Frontend
    {
      name: 'soc-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4200',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'http://localhost:4201',
        INTERNAL_API_URL: 'http://localhost:4201',
      }
    }
  ]
};
