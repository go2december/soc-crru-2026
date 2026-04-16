---
description: Run local deployment, environment verification, and release-readiness checks for the SOC-CRRU stack
---
1. Verify required environment files exist for both `frontend/` and `backend/` before starting services.
2. Start or rebuild the stack with `docker compose up -d` or `docker compose up --build -d` when needed.
3. Confirm the expected local URLs respond correctly: frontend `http://localhost:4000`, backend `http://localhost:4001`, pgAdmin `http://localhost:5050`.
4. Verify admin login routes load correctly for both `/admin/login` and `/chiang-rai-studies/admin/login`.
5. Validate image serving from `/uploads/...` and confirm relative-path media still resolves correctly.
6. Run relevant lint or verification commands for the frontend and backend before considering the environment ready.
7. If release readiness changed, update `docs/WORKFLOW-project-status.md` and any affected plan/workflow docs.
8. Finish by summarizing environment status, blockers, and next deployment-related actions.
