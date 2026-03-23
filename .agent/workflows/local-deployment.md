---
description: Local deployment and release preparation workflow for the SOC-CRRU application
---
1. Review `docs/WORKFLOW-AND-PLAN-UPDATED.md` and confirm the current release scope, known risks, and pending high-priority items.
2. Verify local environment assumptions including Docker Compose services, port mappings, environment variables, and uploaded file paths.
3. Confirm the frontend is expected on port `4000`, backend API on `4001`, PostgreSQL on `5432`, and pgAdmin on `5050`.
4. Review any recent changes that affect build, runtime configuration, SSR data fetching, or uploaded asset handling.
5. Validate key public routes for both Faculty and Chiang Rai Studies and check critical admin login and CRUD flows.
6. Validate image URL behavior, API prefixes, and Docker-network server-side API access assumptions.
7. Run the release readiness review alongside `.windsurf/workflows/release-checklist.md` when preparing for a broader verification pass.
8. Update docs if deployment assumptions, URLs, ports, or environment-variable guidance changed.
9. Record blockers, warnings, and deferred issues before considering the local deployment state ready.
10. Finish with a go/no-go summary for local release readiness.
