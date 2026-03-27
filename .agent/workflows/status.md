---
description: Display agent and project status. Progress tracking and status board.
---

# /status - Project Status

$ARGUMENTS

---

## Task

Show current SOC-CRRU Web project status.

---

## Steps

1. **Show Project Info**

```
=== SOC-CRRU Web Status ===

📁 Project: soc-crru-web (คณะสังคมศาสตร์ มรภ.เชียงราย)
📂 Path: e:\web2026\soc-crru-web
🏷️ Type: Full-stack Web Application

🔧 Tech Stack:
   Frontend:  Next.js 15 (App Router) + Tailwind CSS v4
   Backend:   NestJS + Drizzle ORM
   Database:  PostgreSQL 16
   UI:        shadcn/ui
   Auth:      Google OAuth (@crru.ac.th)
   OS:        Windows (PowerShell)
```

2. **Check Git Status**
```powershell
git status --short
git log --oneline -5
```

3. **Check Servers**
```powershell
# Test Backend
Invoke-WebRequest -Uri "http://localhost:4001/api" -UseBasicParsing -TimeoutSec 3

# Test Frontend
Invoke-WebRequest -Uri "http://localhost:4000" -UseBasicParsing -TimeoutSec 3
```

4. **Show Module Status**

```
=== Module Status ===

✅ Auth (Google OAuth + JWT + Roles)
✅ Staff Profiles (CRUD + Image Upload)
✅ Departments (CRUD)
✅ Positions (CRUD)
✅ News (CRUD + Attachments)
✅ Programs (CRUD + Instructors + Gallery)
✅ Admissions (Full-stack CRUD completed)
✅ Chiang Rai Studies Center (shared: users + staff only)
✅ Upload Service (staff, news, programs)

=== Admin Dashboard ===

✅ /admin/dashboard
✅ /admin/staff
✅ /admin/positions
✅ /admin/departments
✅ /admin/news
✅ /admin/programs
✅ /admin/admissions
✅ /admin/users
✅ /admin/profile

=== Public Pages ===

✅ / (Homepage)
✅ /about
✅ /news
✅ /programs
✅ /programs/[slug]
✅ /personnel
✅ /admissions
✅ /contact
```

---

## Quick Health Check

```powershell
# Backend build check
cd backend; npm run build

# Frontend build check
cd frontend; npx next build
```

---

## URLs

| Service   | URL                                        |
| --------- | ------------------------------------------ |
| Frontend  | http://localhost:4000                       |
| Backend   | http://localhost:4001/api                   |
| Admin     | http://localhost:4000/admin                 |
| Dev Login | http://localhost:4001/api/auth/dev/login    |
