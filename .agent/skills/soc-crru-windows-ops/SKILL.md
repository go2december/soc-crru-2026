---
name: soc-crru-windows-ops
description: Windows Server production deployment, process management (PM2 / NSSM), automated PostgreSQL backup scripts, IIS Reverse Proxy / Caddy, and log rotation for SOC-CRRU.
---

# SOC-CRRU Windows Server Operations & Deployment

This skill governs the production deployment, maintenance, and operations of the SOC-CRRU platform running on Windows Server environments.

---

## 🏛️ 1. Production Architecture Overview

The SOC-CRRU platform operates as a hybrid full-stack suite on Windows Server:
- **Frontend**: Next.js App Router (Node.js runtime, port `3001` or `4200`)
- **Backend**: NestJS API Gateway (Node.js runtime, port `3000` or `4500`)
- **Database**: PostgreSQL 18 (Local Windows Service or Docker Container)
- **Reverse Proxy**: IIS (with URL Rewrite + ARR) or Caddy / Nginx for Windows on port `80`/`443` (SSL)

> [!important]
> On Windows Server, all paths must be managed carefully with forward-slash or properly escaped backslash references. Ensure environment variables in `.env` are absolute or relative to project root.

---

## 🔄 2. Process Management (PM2 & Windows Services)

### 2.1 PM2 Process Ecosystem (`ecosystem.config.js`)
Use PM2 with `pm2-windows-service` to ensure zero-downtime reboots:

```javascript
module.exports = {
  apps: [
    {
      name: 'soc-backend',
      script: 'dist/apps/api-gateway/main.js',
      cwd: 'E:/web2026/soc-crru-web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'soc-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      cwd: 'E:/web2026/soc-crru-web/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
```

### 2.2 Service Management Commands
```powershell
# Start all services
pm2 start ecosystem.config.js

# Save process list for system reboot
pm2 save

# Monitor resource consumption
pm2 status
pm2 monit
```

---

## 🛡️ 3. Reverse Proxy & SSL (IIS / Caddy)

### Option A: IIS with ARR & URL Rewrite
1. Install **Application Request Routing (ARR)** and **URL Rewrite** modules in IIS.
2. Enable ARR Proxy: `Application Request Routing > Server Proxy Settings > Enable proxy`.
3. In `web.config`:
   - Route `/api/*` and `/uploads/*` to `http://localhost:3000/{R:0}`
   - Route all other requests `/*` to `http://localhost:3001/{R:0}`
   - Preserve client host headers: `HTTP_X_FORWARDED_FOR`, `HTTP_X_FORWARDED_PROTO`.

### Option B: Caddy for Windows (Lightweight Alternative)
```caddy
soc.crru.ac.th {
    encode gzip zstd
    
    # Backend API & Uploads
    handle /api/* {
        reverse_proxy localhost:3000
    }
    handle /uploads/* {
        reverse_proxy localhost:3000
    }
    
    # Frontend Next.js
    handle {
        reverse_proxy localhost:3001
    }
}
```

---

## 💾 4. Automated PostgreSQL Backup (PowerShell Task)

Run `scripts/backup_postgres.ps1` via **Windows Task Scheduler** daily at 02:00 AM.

### Retention Policy:
- Keep daily backups for 7 days
- Keep weekly backups for 4 weeks
- Automatic ZIP compression to conserve disk space

```powershell
# Manual Backup Trigger
powershell -ExecutionPolicy Bypass -File .agent/skills/soc-crru-windows-ops/scripts/backup_postgres.ps1
```

---

## 🧹 5. Maintenance & Log Rotation

1. **PM2 Logs**: Install `pm2-logrotate` to prevent disk saturation:
   ```powershell
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 50M
   pm2 set pm2-logrotate:retain 10
   ```
2. **Next.js Cache Cleaning**:
   ```powershell
   # Clean build cache if disk space runs low
   Remove-Item -Recurse -Force frontend/.next/cache
   ```
3. **Database Health Check**:
   ```powershell
   docker exec -t postgres pg_isready -U postgres
   ```
