---
name: soc-crru-backend-nest-drizzle
description: NestJS Monorepo architecture rules, DatabaseService integration, Drizzle query guidelines, and route controller patterns.
---

# SOC-CRRU Backend Standards (NestJS & Drizzle)

This guide covers NestJS development standards, database service integration, and Drizzle query patterns within the backend workspace of the SOC-CRRU project.

---

## 📂 1. Monorepo Architecture

The backend is built as a **NestJS Monorepo**:
* **`apps/`**: Individual services running specific sub-systems:
  * `auth-service`
  * `chiang-rai-service`
  * `news-service`
  * `programs-service`
  * `research-service`
  * `staff-service`
* **`libs/`**: Shared libraries used across different services:
  * `database` -> exposes schemas and the `DatabaseService` connection pool.

Avoid circular dependency issues between libraries or apps. Keep shared code inside proper folders in `libs/`.

---

## ⚡ 2. Dependency Injection (DI) & Drizzle Service

All database connections must utilize the shared database library:
* **Import Database module**: Make sure your module imports `DatabaseModule` from `db/database`.
* **Injection**: Inject the service using `DatabaseService`:
  ```typescript
  import { DatabaseService } from 'db/database';
  
  @Injectable()
  export class AcademicServicesService {
    constructor(private readonly drizzle: DatabaseService) {}
  }
  ```
* **Queries**: Write direct Drizzle queries using `this.drizzle.db`. Refer to the `drizzle-expert` guide for more query syntax.

---

## 📡 3. Controllers and DTOs

* Use NestJS decorators for route definitions (`@Controller()`, `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Body()`, `@Query()`, `@Param()`).
* Ensure input data is validated using NestJS **`ValidationPipe`** along with class-validator decorators in DTOs (Data Transfer Objects).

Example Controller pattern:
```typescript
import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ChiangRaiService } from './chiang-rai.service';

@Controller('chiang-rai/articles')
export class ChiangRaiArticlesController {
  constructor(private readonly service: ChiangRaiService) {}

  @Post()
  async create(@Body() dto: CreateArticleDto) {
    return this.service.createArticle(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const article = await this.service.getArticleById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
```

---

## 🛡️ 4. Global Exception Filters & Response Formats

* Ensure your endpoints return consistent HTTP Status codes.
* Propagate descriptive error messages (e.g. `NotFoundException` or `BadRequestException` when database constraints are violated).
* Always handle `null` database select returns gracefully and map them to a 404 response.
