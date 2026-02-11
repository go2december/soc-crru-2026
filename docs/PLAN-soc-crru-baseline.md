# Project Baseline: SOC-CRRU Web Application (Pre-Agent Kit)

## Overview
This document captures the existing state of the Social Science Faculty (Chiang Rai Rajabhat University) project before standardizing with the Agent Kit. It serves as the source of truth for the core architecture and workflows.

## 🏛️ Project Identity
- **Name**: SOC-CRRU Web Application
- **Purpose**: Academic platform for students/staff (Siam Innovator & Lifelong Learning).
- **Status**: In Development.
  - **Frontend**: ~90% (Active)
  - **Backend**: ~60% (In Progress)

## 🛠️ Technology Stack (Current State)
### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **Library**: React 19.2.3 (Server Components)
- **Styling**: Tailwind CSS v4.0 + DaisyUI v5.5.14
- **Language**: TypeScript v5
- **Dependencies**: Lucide React, Preline, Next-Themes, Radix UI

### Backend
- **Framework**: NestJS (Node.js v25)
- **Structure**: Modular (`src/`) + E2E Tests (`test/`)
- **API**: REST API

### Database
- **Engine**: PostgreSQL 18 (Alpine)
- **Management**: pgAdmin 4 (Web Interface)
- **Volume**: `./database/pgdata`

### Infrastructure (DevOps)
- **Tools**: Docker Compose
- **Network**: `soc-network` (bridge)
- **Services**:
  1. `db`: Postgres 18 [Port: 5432]
  2. `pgadmin`: Admin Tool [Port: 5050]
  3. `backend`: NestJS API [Port: 4001 mapped to 3000]
  4. `frontend`: Next.js [Port: 4000 mapped to 3000]

## 🚀 Existing Workflow (Pre-Kit)

### Development Environment Setup
1. **Clone Repo**: `git clone https://github.com/go2december/soc-crru-2026.git`
2. **Start Services**: `docker compose up -d`
3. **Access**:
   - Frontend: `http://localhost:4000`
   - Backend API: `http://localhost:4001`
   - Database Admin: `http://localhost:5050`
     - User: `admin@soc.crru.ac.th`
     - Pass: `admin`

### Configuration Files
- `docker-compose.yml`: Defines services and port mappings.
- `frontend/package.json`: Core dependencies for UI.
- `backend/.env`: Environment variables for API config.

## ⚠️ Known Dependencies & Limits
- **Node Version**: Requires Node 25+ (Bleeding Edge)
- **Frameworks**: Using latest versions (Next 16, Postgres 18) which may have fewer docs/support.
- **Ports**: Custom port mapping (4000/4001) must be respected.

## Next Steps (Agent Integration)
- Use this baseline to configure `.agent/` workflows.
- Create specific scripts for health checks based on these ports.
- Document deployment process for this specific stack.
