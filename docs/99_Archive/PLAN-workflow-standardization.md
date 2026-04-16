# Workflow Standardization Plan: SOC-CRRU Web Application
**Updated:** April 3, 2026

---

## วัตถุประสงค์ (Purpose)

This document defines how workflow, plan, status, and task-routing artifacts must be organized for the SOC-CRRU Web Application so that written documentation in `docs/` stays aligned with Windsurf-native executable workflows in `.agent/workflows/` and local project skills in `.agent/skills/`.

The goal is to eliminate ambiguity about:
- where the canonical written plan lives,
- where step-by-step execution workflows live,
- where Windsurf task routing and local skill guidance live,
- how current project status is tracked,
- and how these artifacts must be updated after implementation.

---

## บทบาทของเอกสาร (Artifact Roles)

### A. Baseline Plan Documents (`docs/PLAN-*.md`)
Use plan documents for scope, architecture, phases, milestones, and pending work.

- `docs/PLAN-soc-crru-baseline.md`
  - Project-level baseline
  - High-level status for Faculty, Chiang Rai Studies, backend, infrastructure
  - Cross-cutting constraints and priorities

- `docs/PLAN-chiang-rai-studies.md`
  - Domain-specific implementation plan for Chiang Rai Studies
  - Phase-based tracking for feature completion, polish, QA, and deployment

- `docs/PLAN-workflow-standardization.md`
  - Rules for maintaining consistency between plans and Windsurf-native workflows
  - Documentation governance for future contributors and agents

### B. Workflow Documents (`docs/WORKFLOW-*.md`)
Use workflow documents for human-readable operating procedures and implementation reference.

- `docs/WORKFLOW-project-status.md`
  - Current consolidated project status snapshot
  - Cross-module progress, next priorities, and environment notes

- `docs/WORKFLOW-chiang-rai-admin.md`
  - Human-readable admin workflow for Chiang Rai Studies
  - Authentication, CRUD, image management, and operational notes

- `docs/WORKFLOW-faculty-admin.md`
  - Human-readable admin workflow for the Faculty admin area
  - Authentication, CRUD, and operational notes for core faculty management

### C. Executable Workflows (`.agent/workflows/*.md`)
Use executable workflows for task execution inside the Windsurf IDE/agent environment.

These files must contain:
- YAML frontmatter with `description`
- direct, ordered steps
- only actionable instructions
- no broad project history or duplicated architectural narration unless required for execution

### D. Local Skills (`.agent/skills/*`)
Use local skills for project-specific Windsurf implementation guidance, task routing, and surface-specific constraints.

These files should:
- map task types to the correct primary skill
- document companion skills for cross-surface work
- preserve route-scope constraints such as DaisyUI for public routes and shadcn/ui for admin routes
- stay aligned with `.agentrules` and team-facing references in `README.md`

---

## แหล่งอ้างอิงหลัก (Source of Truth)

The project uses the following source-of-truth hierarchy:

1. `docs/WORKFLOW-project-status.md`
   - authoritative project status snapshot
   - use this first to understand what is done, in progress, and pending

2. `docs/PLAN-soc-crru-baseline.md`
   - authoritative project-wide baseline and scope

3. `docs/PLAN-chiang-rai-studies.md`
   - authoritative domain plan for Chiang Rai Studies

4. `docs/WORKFLOW-chiang-rai-admin.md`
   - authoritative human-readable operational workflow for Chiang Rai admin work

5. `docs/WORKFLOW-faculty-admin.md`
   - authoritative human-readable operational workflow for Faculty admin work

6. `.agent/workflows/*.md`
   - authoritative execution procedures for agent-driven task work
   - must reflect the current docs, but should remain concise and task-oriented

If there is a conflict between a status snapshot and an older workflow note, update the older workflow note.

---

## ชุดเวิร์กโฟลว์ที่ต้องมี (Required Workflow Set)

The repository should maintain the following executable workflows:

- `.agent/workflows/chiang-rai-admin.md`
  - CRUD/admin work for Chiang Rai Studies

- `.agent/workflows/content-population.md`
  - adding or revising real content across public pages and admin-managed sections

- `.agent/workflows/release-checklist.md`
  - QA, build verification, SEO review, responsive review, and deployment preparation

- `.agent/workflows/project-status-review.md`
  - procedure for reviewing and synchronizing docs, plans, and workflows after major work

- `.agent/workflows/faculty-admin.md`
  - CRUD/admin work for the Faculty admin area

- `.agent/workflows/local-deployment.md`
  - local deployment, environment verification, and release preparation

---

## กติกาการอัปเดต (Update Rules)

After any medium or large implementation task, update artifacts as follows:

### If a feature is completed
- update the relevant checklist in `docs/WORKFLOW-project-status.md`
- update the relevant phase in the matching `docs/PLAN-*.md`
- update any matching `docs/WORKFLOW-*.md` operational notes if behavior changed
- update the matching `.agent/workflows/*.md` only if execution steps changed

### If a new operational process is introduced
- document the human-readable process in `docs/WORKFLOW-*.md`
- add or update an executable workflow in `.agent/workflows/`

### If priorities change
- reflect the new ordering in `docs/WORKFLOW-project-status.md`
- ensure domain plans still match the new sequence

---

## รูปแบบสถานะมาตรฐาน (Status Taxonomy)

Use only these status labels in plans:

- ✅ COMPLETE
- 🔄 IN PROGRESS
- 📋 PENDING

For checklist items, use:

- [x] completed
- [ ] not completed

Avoid mixing alternative labels like “done-ish”, “almost”, or “later”.

---

## รอบการทบทวนที่แนะนำ (Recommended Review Cadence)

- After each feature batch: update the relevant domain plan
- After each milestone: update `docs/WORKFLOW-project-status.md`
- Before release or deployment: run `.agent/workflows/release-checklist.md`
- During project review: run `.agent/workflows/project-status-review.md`

---

## โครงสร้างมาตรฐานปัจจุบัน (Current Standardized Structure)

```text
docs/
├── PLAN-soc-crru-baseline.md
├── PLAN-chiang-rai-studies.md
├── PLAN-workflow-standardization.md
├── WORKFLOW-project-status.md
├── WORKFLOW-chiang-rai-admin.md
└── WORKFLOW-faculty-admin.md

.agent/workflows/
├── chiang-rai-admin.md
├── content-population.md
├── faculty-admin.md
├── local-deployment.md
├── release-checklist.md
└── project-status-review.md

.agent/skills/
├── soc-crru-public-frontend/
├── soc-crru-admin-dashboard/
├── soc-crru-backend-nest-drizzle/
├── soc-crru-chiang-rai-crud/
├── soc-crru-media-upload-cleanup/
├── soc-crru-seo-metadata/
├── soc-crru-docs-governance/
├── nextjs-react-expert/
├── tailwind-patterns/
├── api-patterns/
├── lint-and-validate/
├── systematic-debugging/
└── ui-ux-pro-max/
```

---

## งานที่ดำเนินการแล้ว ณ March 24, 2026 (Immediate Actions Completed)

- Established `docs/` as the canonical written planning area
- Established `.agent/workflows/` as the executable workflow area
- Established `.agent/skills/` as the local project skill area
- Filled the previously empty workflow standardization plan
- Defined the minimum required workflow set for ongoing project maintenance
- Added a team-facing local skill map reference path across `.agentrules`, `README.md`, and `docs/WORKFLOW-project-status.md`

---

## การปรับปรุงเชิงกำกับดูแลถัดไป (Next Governance Improvements)

- Standardize the changelog format in `docs/WORKFLOW-project-status.md`
- Align root `README.md` environment URLs and version references with current runtime
- Add release ownership/checkpoint sign-off section if multiple contributors maintain the repo
