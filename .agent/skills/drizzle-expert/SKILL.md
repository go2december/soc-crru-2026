---
name: drizzle-expert
description: Best practices and coding patterns for using Drizzle ORM with NestJS and PostgreSQL in the SOC-CRRU codebase.
---

# Drizzle ORM Best Practices (NestJS & PostgreSQL)

This guide defines how to write database queries, manage schemas, handle relationships, and run migrations in the SOC-CRRU codebase using **Drizzle ORM** and **NestJS**.

---

## 🏗️ 1. Database Connection & Service Injection

The database is connected via `DatabaseService` (located in [database.service.ts](file:///e:/web2026/soc-crru-web/backend/libs/database/src/database.service.ts)).

To use Drizzle in any NestJS service:
1. Inject `DatabaseService` in the constructor.
2. Access the database instance via `this.drizzle.db`.

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'db/database'; // Import path configured in tsconfig
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

Always import helper operators from `'drizzle-orm'`:
```typescript
import { eq, ne, gt, gte, lt, lte, and, or, ilike, desc, asc, count, SQL } from 'drizzle-orm';
```

### Select (Retrieving Data)
* **Select All Columns**:
  ```typescript
  const allStaff = await this.drizzle.db.select().from(staffProfiles);
  ```
* **Select Specific Columns**:
  ```typescript
  const compactStaff = await this.drizzle.db
    .select({
      id: staffProfiles.id,
      nameTh: staffProfiles.nameTh,
    })
    .from(staffProfiles);
  ```
* **Filtering and Pagination**:
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

### Insert (Creating Data)
* **Single Insert with Returning**:
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

### Update (Modifying Data)
* **Update with Returning**:
  ```typescript
  const [updated] = await this.drizzle.db
    .update(staffProfiles)
    .set({ nameTh: 'ชื่อใหม่', updatedAt: new Date() })
    .where(eq(staffProfiles.id, id))
    .returning();
  ```

### Delete (Removing Data)
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
const totalStaff = result.count;
```

### Relational Joins
Drizzle supports SQL-style joins:
```typescript
const staffWithDepartment = await this.drizzle.db
  .select({
    staffId: staffProfiles.id,
    staffName: staffProfiles.nameTh,
    departmentName: departments.nameTh,
  })
  .from(staffProfiles)
  .leftJoin(departments, eq(staffProfiles.departmentId, departments.id))
  .where(eq(staffProfiles.isActive, true));
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

### Adding a Table / Column
1. Modify the schema definition in `schema.ts`.
2. Generate migration script using `drizzle-kit`:
   ```bash
   npx drizzle-kit generate
   ```
3. Run the migrations to update the database:
   ```bash
   npm run db:migrate # or run_migration script
   ```

### Seed Data
Use seed files in the backend workspace root directory (e.g., `seed.ts`, `seed-chiang-rai-content.ts`) to initialize lookup values or sample records.
