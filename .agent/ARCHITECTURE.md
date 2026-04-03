# SOC-CRRU Web - Architecture

> คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย (Faculty of Social Sciences, CRRU)

---

## 📋 Project Tech Stack

| Layer      | Technology                   | Port  |
| ---------- | ---------------------------- | ----- |
| Frontend   | Next.js 15 + Tailwind CSS v4 | 4000  |
| Backend    | NestJS + Drizzle ORM         | 4001  |
| Database   | PostgreSQL 16                | 5432  |
| Auth       | Google OAuth (@crru.ac.th)   | -     |
| UI Library | shadcn/ui                    | -     |
| OS         | Windows (PowerShell)         | -     |

### Key Directories

```plaintext
soc-crru-web/
├── frontend/           # Next.js 15 (App Router)
│   ├── app/            # Pages & Routes
│   │   ├── admin/      # Admin Dashboard (CRUD)
│   │   ├── admissions/ # Admission pages
│   │   └── programs/   # Program pages
│   ├── components/     # Shared components (shadcn/ui)
│   └── lib/            # Utilities
├── backend/            # NestJS API
│   └── src/
│       ├── auth/       # Google OAuth + JWT + Roles
│       ├── admissions/ # Admissions CRUD
│       ├── programs/   # Programs CRUD
│       ├── staff/      # Staff profiles
│       ├── news/       # News CRUD
│       ├── departments/# Departments
│       ├── upload/     # File upload service
│       ├── drizzle/    # ORM schema & service
│       └── chiang-rai/ # Chiang Rai Studies (shared: users + staff only)
└── .agent/             # AI Agent Kit
```

### Important Notes

- **ศูนย์เชียงรายศึกษา** แชร์กับเว็บคณะเฉพาะ **Users** และ **ข้อมูลบุคลากร** เท่านั้น
- Backend global prefix: `/api`
- Auth: JWT token stored in `localStorage` as `admin_token`
- Roles: `ADMIN`, `EDITOR`, `STAFF`, `GUEST`
- Dev login: `GET /api/auth/dev/login` or `POST /api/auth/dev/token`

### 📦 Standard Pagination Architecture
When implementing listing features, both models and APIs MUST follow this pattern:
1. **Backend API Response:** Return `{ data: [...items], meta: { total, page, limit, totalPages } }`.
2. **Backend Controller:** Accept `@Query('page')` and `@Query('limit')`. Use `drizzle.db.select()` with `.limit()` and `.offset()`, and a separate `sql<number>count(*)` query for totals.
3. **Frontend Dashboard (Admin):** 
   - Fetch ALL raw data (`?limit=500` or higher) so Client-Side Search (e.g., `searchTerm` filtering) works across the entire dataset.
   - Implement **Client-Side Pagination**: slice the array (`filteredItems.slice(...)`) into `paginatedItems` and pass `totalPages` to `<AdminPagination />`.
4. **Frontend Public (User):** Use `<MinimalPagination />` for clean minimalist UI and fetch the `.data` property.

---

## 🏗️ Agent Kit Structure

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 20 Specialist Agents
├── skills/                  # 36 Skills
├── workflows/               # 12 Slash Commands
├── rules/                   # Global Rules (GEMINI.md)
└── scripts/                 # Validation Scripts
```

---

## 🤖 Agents (20)

| Agent                    | Focus                    | Primary Skills                                           |
| ------------------------ | ------------------------ | -------------------------------------------------------- |
| `orchestrator`           | Multi-agent coordination | parallel-agents, behavioral-modes                        |
| `project-planner`        | Discovery, task planning | brainstorming, plan-writing, architecture                |
| `frontend-specialist`    | Web UI/UX                | frontend-design, react-best-practices, tailwind-patterns |
| `backend-specialist`     | API, business logic      | api-patterns, nodejs-best-practices, database-design     |
| `database-architect`     | Schema, SQL, Drizzle     | database-design                                          |
| `mobile-developer`       | iOS, Android, RN         | mobile-design                                            |
| `game-developer`         | Game logic               | game-development                                         |
| `devops-engineer`        | CI/CD, Docker            | deployment-procedures                                    |
| `security-auditor`       | Security compliance      | vulnerability-scanner, red-team-tactics                  |
| `penetration-tester`     | Offensive security       | red-team-tactics                                         |
| `test-engineer`          | Testing strategies       | testing-patterns, tdd-workflow, webapp-testing           |
| `debugger`               | Root cause analysis      | systematic-debugging                                     |
| `performance-optimizer`  | Speed, Web Vitals        | performance-profiling                                    |
| `seo-specialist`         | Ranking, visibility      | seo-fundamentals, geo-fundamentals                       |
| `documentation-writer`   | Manuals, docs            | documentation-templates                                  |
| `product-manager`        | Requirements             | plan-writing, brainstorming                              |
| `product-owner`          | Strategy, backlog        | plan-writing, brainstorming                              |
| `qa-automation-engineer` | E2E testing              | webapp-testing, testing-patterns                         |
| `code-archaeologist`     | Legacy code, refactoring | clean-code, code-review-checklist                        |
| `explorer-agent`         | Codebase analysis        | -                                                        |

---

## 🧩 Skills (36)

### Frontend & UI

| Skill                   | Description                              |
| ----------------------- | ---------------------------------------- |
| `react-best-practices`  | React & Next.js optimization (57 rules)  |
| `web-design-guidelines` | Web UI audit (100+ rules)                |
| `tailwind-patterns`     | Tailwind CSS v4 utilities                |
| `frontend-design`       | UI/UX patterns, design systems           |

### Backend & API

| Skill                   | Description                |
| ----------------------- | -------------------------- |
| `api-patterns`          | REST, GraphQL, tRPC        |
| `nodejs-best-practices` | Node.js async, modules     |
| `python-patterns`       | Python standards, FastAPI  |

### Database

| Skill             | Description                 |
| ----------------- | --------------------------- |
| `database-design` | Schema design, optimization |

### Cloud & Infrastructure

| Skill                   | Description               |
| ----------------------- | ------------------------- |
| `deployment-procedures` | CI/CD, deploy workflows   |
| `server-management`     | Infrastructure management |

### Testing & Quality

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `testing-patterns`      | Jest, Vitest, strategies |
| `webapp-testing`        | E2E, Playwright          |
| `tdd-workflow`          | Test-driven development  |
| `code-review-checklist` | Code review standards    |

### Security

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `vulnerability-scanner` | Security auditing, OWASP |
| `red-team-tactics`      | Offensive security       |

### Architecture & Planning

| Skill           | Description                |
| --------------- | -------------------------- |
| `app-builder`   | Full-stack app scaffolding |
| `architecture`  | System design patterns     |
| `plan-writing`  | Task planning, breakdown   |
| `brainstorming` | Socratic questioning       |

### Other

| Skill                     | Description               |
| ------------------------- | ------------------------- |
| `clean-code`              | Coding standards (Global) |
| `behavioral-modes`        | Agent personas            |
| `parallel-agents`         | Multi-agent patterns      |
| `mcp-builder`             | Model Context Protocol    |
| `documentation-templates` | Doc formats               |
| `i18n-localization`       | Internationalization      |
| `performance-profiling`   | Web Vitals, optimization  |
| `systematic-debugging`    | Troubleshooting           |
| `mobile-design`           | Mobile UI/UX patterns     |
| `game-development`        | Game logic, mechanics     |
| `seo-fundamentals`        | SEO, E-E-A-T              |
| `geo-fundamentals`        | GenAI optimization        |
| `bash-linux`              | Linux commands            |
| `powershell-windows`      | Windows PowerShell        |
| `intelligent-routing`     | Auto agent selection      |
| `rust-pro`                | Rust development          |

---

## 🔄 Workflows (12)

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `/brainstorm`    | Socratic discovery             |
| `/create`        | Create new features            |
| `/commit`        | Git commit & push              |
| `/debug`         | Systematic debugging           |
| `/deploy`        | Deploy application             |
| `/enhance`       | Improve existing code          |
| `/orchestrate`   | Multi-agent coordination       |
| `/plan`          | Task breakdown                 |
| `/preview`       | Preview dev servers            |
| `/status`        | Check project status           |
| `/test`          | Run/generate tests             |
| `/ui-ux-pro-max` | Design with premium aesthetics |

---

## 🎯 Quick Reference

| Need     | Agent                 | Skills                                |
| -------- | --------------------- | ------------------------------------- |
| Web App  | `frontend-specialist` | react-best-practices, frontend-design |
| API      | `backend-specialist`  | api-patterns, nodejs-best-practices   |
| Database | `database-architect`  | database-design                       |
| Security | `security-auditor`    | vulnerability-scanner                 |
| Testing  | `test-engineer`       | testing-patterns, webapp-testing      |
| Debug    | `debugger`            | systematic-debugging                  |
| Plan     | `project-planner`     | brainstorming, plan-writing           |

---

## 📊 Dev Commands

```powershell
# Frontend (port 4000)
cd frontend; npm run dev

# Backend (port 4001)
cd backend; npm run start:dev

# Build check
cd backend; npm run build

# Database migration (manual)
cd backend; node migration.js

# Drizzle generate
cd backend; npx drizzle-kit generate
```
