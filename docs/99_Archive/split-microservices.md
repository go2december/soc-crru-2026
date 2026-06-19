# Plan: Split Monolith into NestJS Monorepo (split-microservices) - 7 Services Version

## Overview
This plan transitions the monolithic NestJS backend into a NestJS Monorepo containing an API Gateway, an Authentication service, and separate microservices for major domains, grouping research and academic-services together, and departments and admissions under the programs service.

## Success Criteria
- [ ] nest-cli.json updated for Monorepo support
- [ ] Shared database library (`libs/database`) created with Drizzle schemas
- [ ] Shared components library (`libs/shared`) created with auth guards and common utils
- [ ] All 7 microservice applications created under `apps/` with matching port mappings:
  - `api-gateway` (Port 3000)
  - `auth-service` (Port 3001)
  - `news-service` (Port 3002)
  - `chiang-rai-service` (Port 3003)
  - `programs-service` (Port 3004) - Includes programs, departments, and admissions
  - `staff-service` (Port 3005)
  - `research-service` (Port 3006) - Includes research and academic-services
- [ ] Docker Compose updated to orchestrate all services
- [ ] Verification tests passing (Build + Lint)

## Task Breakdown
- [ ] Task 1: Initialize NestJS monorepo configuration and package scripts
- [ ] Task 2: Create shared libraries (`libs/database`, `libs/shared`)
- [ ] Task 3: Implement API Gateway (`apps/api-gateway`)
- [ ] Task 4: Implement Auth Service (`apps/auth-service`)
- [ ] Task 5: Implement News Service (`apps/news-service`)
- [ ] Task 6: Implement Chiang Rai Service (`apps/chiang-rai-service`)
- [ ] Task 7: Implement Programs Service (`apps/programs-service` - with departments and admissions merged)
- [ ] Task 8: Implement Staff Service (`apps/staff-service`)
- [ ] Task 9: Implement Research Service (`apps/research-service` - with academic services merged)
- [ ] Task 10: Configure environment variables and Docker Compose
- [ ] Task 11: Build, run, and verify the microservices stack
