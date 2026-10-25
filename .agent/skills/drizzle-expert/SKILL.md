---
name: drizzle-expert
description: Best practices and coding patterns for using Drizzle ORM with NestJS and PostgreSQL in the SOC-CRRU codebase.
---

# Drizzle ORM Best Practices (NestJS & PostgreSQL)

This guide defines how to write database queries, manage schemas, handle relationships, and run migrations in the SOC-CRRU codebase using **Drizzle ORM (v0.45+)** and **NestJS (v12)**.

---

## 🏗️ 1. Database Connection & Service Injection

The database is connected via `DatabaseService` (located in [database.service.ts](file:///e:/web2026/soc-crru-web/backend/libs/database/src/database.service.ts)), which registers the schema with `drizzle(pool, { schema })`.

To use Drizzle in any NestJS service:
1. Inject `DatabaseService` in the constructor.
2. Access the database instance via `this.drizzle.db`.

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'db/database';
import { eq } from 'drizzle-orm';
import { staffProfiles } from 'db/database';

@Injectable()
export class StaffService {
  constructor(private readonly drizzle: DatabaseService) {}

  async getStaff(id: string) {
    const [staff] = await this.drizzle.db
      .select()
      .from(staffProfiles)
      .where(eq(staffProfiles.id, id))
      .limit(1);
    return staff;
  }
}
```

---

## 🔍 2. Drizzle Query Patterns

### 2.1 Relational Queries API (`db.query`) - Recommended for Nested Reads
Because `DatabaseService` provides the full `{ schema }` to Drizzle, you can leverage typed relational queries with `with`:

```typescript
// Find first with relations
const staff = await this.drizzle.db.query.staffProfiles.findFirst({
  where: (staff, { eq }) => eq(staff.id, id),
  with: {
    department: true,
  },
});

// Find many with filter & relations
const activeStaff = await this.drizzle.db.query.staffProfiles.findMany({
  where: (staff, { eq }) => eq(staff.isActive, true),
  orderBy: (staff, { desc }) => [desc(staff.createdAt)],
  limit: 20,
  with: {
    department: true,
  },
});
```

### 2.2 Standard SQL-Like Queries (`db.select()`)
Always import helper operators from `'drizzle-orm'`:
```typescript
import { eq, ne, gt, gte, lt, lte, and, or, ilike, desc, asc, count, SQL } from 'drizzle-orm';
```

* **Select with Filters & Pagination**:
  ```typescript
  const activeStaff = await this.drizzle.db
    .select()
    .from(staffProfiles)
    .where(
      and(
        eq(staffProfiles.isActive, true),
        ilike(staffProfiles.nameTh, `%ณรงค์%`)
      )
    )
    .orderBy(desc(staffProfiles.createdAt))
    .limit(10)
    .offset(0);
  ```

* **Insert with Returning**:
  ```typescript
  const [newStaff] = await this.drizzle.db
    .insert(staffProfiles)
    .values({
      nameTh: 'สมชาย ดีใจ',
      email: 'somchai@crru.ac.th',
      isActive: true,
    })
    .returning();
  ```

* **Bulk Insert**:
  ```typescript
  await this.drizzle.db.insert(staffProfiles).values([
    { nameTh: 'คนแรก', email: 'one@crru.ac.th' },
    { nameTh: 'คนที่สอง', email: 'two@crru.ac.th' },
  ]);
  ```

* **Update with Returning**:
  ```typescript
  const [updated] = await this.drizzle.db
    .update(staffProfiles)
    .set({ nameTh: 'ชื่อใหม่', updatedAt: new Date() })
    .where(eq(staffProfiles.id, id))
    .returning();
  ```

* **Delete Record**:
  ```typescript
  const [deleted] = await this.drizzle.db
    .delete(staffProfiles)
    .where(eq(staffProfiles.id, id))
    .returning();
  ```

---

## ⚡ 3. Advanced Querying & Aggregations

### Counting Rows
Always define custom columns for aggregation queries to avoid type ambiguities:
```typescript
const [result] = await this.drizzle.db
  .select({ count: count() })
  .from(staffProfiles);
const totalStaff = Number(result.count);
```

### Transactions
For operations affecting multiple tables, wrap them in a transaction:
```typescript
await this.drizzle.db.transaction(async (tx) => {
  const [newProfile] = await tx
    .insert(staffProfiles)
    .values({ nameTh: 'อ.สมชาย' })
    .returning();

  await tx.insert(userActivityLogs).values({
    userId: currentUserId,
    action: 'CREATE_STAFF',
    targetId: newProfile.id,
  });
});
```

---

## 🛠️ 4. Schema Changes & Migrations

The canonical schema configuration is defined in:
* `backend/libs/database/src/schema.ts`
* Configuration file: `backend/drizzle.config.ts`

### Migration Commands (Run inside `backend/` directory)
1. **Generate Migration Files**:
   ```bash
   cd backend
   npx drizzle-kit generate
   ```
2. **Apply Migrations to PostgreSQL**:
   ```bash
   cd backend
   npx drizzle-kit migrate
   ```
3. **Prototyping / Development Direct Sync**:
   ```bash
   cd backend
   npx drizzle-kit push
   ```

*(Note: There is no `npm run db:migrate` alias in `backend/package.json`; invoke `npx drizzle-kit` commands directly).*

### Seed Data
Use seed files in the backend workspace root directory (e.g., `seed.ts`, `seed-chiang-rai-content.ts` executed via `npx tsx <filename>`) to initialize lookup values or sample records.
