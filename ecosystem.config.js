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
    // 1. Modular Monolith Backend API (All modules unified in-process)
    {
      name: 'soc-backend',
      script: 'dist/apps/api-gateway/main.js',
      cwd: './backend',
      env: {
        PORT: 4201, // Single unified backend port
        DATABASE_URL: dbUrl,
        JWT_SECRET: jwtSecret,
        FRONTEND_URL: 'http://localhost:4200',
        GOOGLE_CLIENT_ID: googleClientId,
        GOOGLE_CLIENT_SECRET: googleClientSecret,
        GOOGLE_CALLBACK_URL: 'http://localhost:4201/api/auth/google/callback',
        NODE_OPTIONS: '--max-old-space-size=256',
      },
    },
    // 2. Next.js Frontend
    {
      name: 'soc-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4200',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'http://localhost:4201',
        INTERNAL_API_URL: 'http://localhost:4201',
        NODE_OPTIONS: '--max-old-space-size=256',
      },
    },
  ],
};
