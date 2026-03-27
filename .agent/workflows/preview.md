---
description: Preview server start, stop, and status check. Local development server management.
---

# /preview - Preview Management

$ARGUMENTS

---

## Task

Manage preview servers for SOC-CRRU Web project.

### Architecture

| Service  | Port | Command              | Directory |
| -------- | ---- | -------------------- | --------- |
| Frontend | 4000 | `npm run dev`        | frontend/ |
| Backend  | 4001 | `npm run start:dev`  | backend/  |

---

## Sub-commands

```
/preview           - Show current status
/preview start     - Start both servers
/preview frontend  - Start frontend only
/preview backend   - Start backend only
/preview stop      - Stop all servers
```

---

## Start Both Servers

// turbo-all

1. Start backend (background)
```powershell
cd backend; npm run start:dev
```

2. Start frontend (background)
```powershell
cd frontend; npm run dev
```

3. Verify health
```
🚀 Preview ready!
   Frontend: http://localhost:4000
   Backend:  http://localhost:4001/api
   Admin:    http://localhost:4000/admin
   Dev Login: http://localhost:4001/api/auth/dev/login
```

---

## Port Conflict Resolution

```powershell
# Find process on port
netstat -ano | findstr :4000
netstat -ano | findstr :4001

# Kill process by PID
taskkill /PID <PID> /F
```
