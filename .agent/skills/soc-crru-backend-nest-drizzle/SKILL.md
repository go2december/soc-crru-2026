---
name: soc-crru-backend-nest-drizzle
description: NestJS Monorepo architecture rules, DatabaseService integration, Drizzle query guidelines, and route controller patterns.
---

# SOC-CRRU Backend Standards (NestJS & Drizzle)

This guide covers NestJS development standards, database service integration, and Drizzle query patterns within the backend workspace of the SOC-CRRU project.

---

## 📂 1. Monorepo Architecture (7 Apps + 3 Shared Libs)

The backend is organized as a **NestJS Modular Monolith / Monorepo**:

### 🚀 Applications (`backend/apps/`)
1. **`api-gateway`** (Port 3000): Central HTTP gateway and reverse proxy entry point.
   - Manages global route prefix (`/api`).
   - Serves static media assets (`/uploads/` mapped to `./uploads`).
   - Hosts global rate limiter (`ThrottlerGuard`, 120 req/min).
   - Injects domain modules directly in-process or routes to services.
2. **`auth-service`**: Authentication, login, JWT token issuance, password hashing.
3. **`chiang-rai-service`**: Chiang Rai Studies data, articles, activities, learning sites, archive.
4. **`news-service`**: Faculty news, announcements, activities, procurement, attachments.
5. **`programs-service`**: Academic curricula (Bachelor, Master, Doctoral), course specifications.
6. **`research-service`**: Research publications, academic services, research funding, startups.
7. **`staff-service`**: Faculty personnel profiles, academic titles, Webometrics researcher links.

### 📚 Shared Libraries (`backend/libs/`)
1. **`libs/database`** (`db/database`):
   - Exposes database connection pool and Drizzle client via `DatabaseService`.
   - Central repository for all Drizzle schemas (`schema.ts`).
2. **`libs/shared`** (`shared/shared`):
   - Authentication & authorization guards: `JwtAuthGuard`, `RolesGuard`.
   - Metadata decorators: `@Roles('admin', 'editor', 'staff')`.
   - Passport `JwtStrategy` and common DTO definitions.
3. **`libs/upload`** (`upload/upload`):
   - `UploadService` and `UploadModule` managing file uploads, Sharp WebP compression, and safe asset cleanup.

> [!important]
> Avoid circular dependencies between apps and libs. Shared logic, guards, decorators, and database schemas MUST live in `libs/`.

---

## ⚡ 2. Dependency Injection & Service Integration

### 2.1 Database Service (`DatabaseService`)
All persistence queries must utilize `DatabaseService` from `db/database`:
```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'db/database';
import { eq, desc } from 'drizzle-orm';
import { news } from 'db/database';

@Injectable()
export class NewsService {
  constructor(private readonly drizzle: DatabaseService) {}

  async getRecentNews(limit = 10) {
    return this.drizzle.db
      .select()
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }
}
```

### 2.2 Upload Service (`UploadService`)
Never write raw `fs.unlinkSync` in controllers. Inject `UploadService` from `upload/upload`:
```typescript
import { Injectable } from '@nestjs/common';
import { UploadService } from 'upload/upload';

@Injectable()
export class StaffService {
  constructor(private readonly uploadService: UploadService) {}

  async removeAvatar(avatarUrl: string) {
    await this.uploadService.deleteStaffImage(avatarUrl);
  }
}
```

### 2.3 Authentication & Authorization (`SharedModule`)
Protect private administrative routes using guards and decorators from `shared/shared`:
```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('admin/news')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminNewsController {
  @Post()
  @Roles('admin', 'editor')
  async createNews() {
    // Only authorized admin or editor can create news
  }
}
```

---

## 📡 3. Controllers, Routing, and DTOs

* **Route Prefix**: The API Gateway automatically applies `/api`. Routes defined in controllers (e.g. `@Controller('news')`) resolve to `/api/news`.
* **Validation**: Input validation is enforced globally via `ValidationPipe` (`whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`).
* Always define DTOs with `class-validator` and `class-transformer`:

```typescript
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  titleTh: string;

  @IsString()
  @IsOptional()
  summaryTh?: string;

  @IsString()
  @IsNotEmpty()
  contentTh: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
```

---

## 🎯 4. Ponytail & Clean Code Alignment

1. **Rung 2 Enforcement:** Before implementing a helper or validation function, check `libs/shared`, `libs/database`, or `libs/upload`. Never duplicate logic across services.
2. **Lean Queries:** Select only necessary columns using `.select({ id: table.id, title: table.title })` for public listings to reduce database throughput and payload size.
3. **Root-Cause Fixes:** When fixing service bugs, check all consumers and callers across the 7 apps before patching. Fix once in the shared service or library.
