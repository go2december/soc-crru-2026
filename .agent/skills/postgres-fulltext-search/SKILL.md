---
name: postgres-fulltext-search
description: High-performance text searching on PostgreSQL with Drizzle ORM, utilizing pg_trgm trigram similarity, GIN indexes, tsvector full-text search, and Thai search optimization without external search engines.
---

# PostgreSQL Full-Text & Trigram Search (Drizzle ORM)

This skill provides patterns and implementation guidelines for high-performance, in-database text search in PostgreSQL using Drizzle ORM, optimized for Thai and bilingual content (Academic Research, News, and Chiang Rai Cultural Artifacts).

---

## 💡 1. Philosophy: Native over Extra Infrastructure

Following the **Ponytail Principle (Lazy Senior Dev)**:
- **Do not introduce Elasticsearch, Meilisearch, or Typesense** unless dataset exceeds 500,000 records.
- PostgreSQL native `pg_trgm` (trigram) and `tsvector` handle tens of thousands of records in under 5ms while keeping infrastructure simple, Docker Compose lightweight, and zero syncing overhead.

---

## ⚙️ 2. PostgreSQL Extension & GIN Indexing

### 2.1 Enable Extension in Database Migration
Ensure `pg_trgm` and `unaccent` extensions are active:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
```

### 2.2 Drizzle Schema GIN Index Pattern
In `backend/libs/database/src/schema.ts` (or domain schema file):

```typescript
import { pgTable, serial, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const researchProjects = pgTable(
  'research_projects',
  {
    id: serial('id').primaryKey(),
    titleTh: text('title_th').notNull(),
    titleEn: text('title_en'),
    abstractTh: text('abstract_th'),
    authorNames: text('author_names').notNull(),
    keywords: text('keywords'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // GIN Trigram index for fast ILIKE and similarity searches
    index('research_title_th_trgm_idx').using('gin', sql`${table.titleTh} gin_trgm_ops`),
    index('research_title_en_trgm_idx').using('gin', sql`${table.titleEn} gin_trgm_ops`),
    index('research_keywords_trgm_idx').using('gin', sql`${table.keywords} gin_trgm_ops`),
    index('research_authors_trgm_idx').using('gin', sql`${table.authorNames} gin_trgm_ops`),
  ]
);
```

---

## 🔍 3. Drizzle Search Query Patterns

### 3.1 Substring Search with GIN Acceleration (Fastest & Universal)
Because GIN trigram indexes accelerate `%term%` pattern matching, simple `ilike` operations run instantaneously:

```typescript
import { ilike, or } from 'drizzle-orm';

export async function searchResearch(db: DatabaseService, query: string, limit = 20) {
  const searchTerm = `%${query.trim()}%`;

  return db.db
    .select()
    .from(researchProjects)
    .where(
      or(
        ilike(researchProjects.titleTh, searchTerm),
        ilike(researchProjects.titleEn, searchTerm),
        ilike(researchProjects.authorNames, searchTerm),
        ilike(researchProjects.keywords, searchTerm)
      )
    )
    .limit(limit);
}
```

### 3.2 Ranked Fuzzy / Similarity Search (Spelling Tolerance)
When users misspell keywords, use PostgreSQL's `similarity()` function:

```typescript
import { sql, desc } from 'drizzle-orm';

export async function searchResearchRanked(db: DatabaseService, query: string, limit = 20) {
  const cleanTerm = query.trim();

  // Similarity score calculated against titles and keywords
  const rankSql = sql<number>`(
    similarity(${researchProjects.titleTh}, ${cleanTerm}) * 3 +
    coalesce(similarity(${researchProjects.titleEn}, ${cleanTerm}), 0) * 2 +
    similarity(${researchProjects.authorNames}, ${cleanTerm}) * 1.5 +
    coalesce(similarity(${researchProjects.keywords}, ${cleanTerm}), 0) * 2
  )`;

  return db.db
    .select({
      id: researchProjects.id,
      titleTh: researchProjects.titleTh,
      titleEn: researchProjects.titleEn,
      authorNames: researchProjects.authorNames,
      score: rankSql,
    })
    .from(researchProjects)
    .where(sql`${rankSql} > 0.3`) // Filter out low relevancy results
    .orderBy(desc(rankSql))
    .limit(limit);
}
```

---

## 🇹🇭 4. Thai Language Search Considerations

1. **Word Segmentation**: Standard PostgreSQL `to_tsvector('simple', text)` splits on whitespace. Since Thai language does not use spaces between words, `tsvector` alone misses compound words.
2. **The Trigram Advantage (`pg_trgm`)**: Trigram slices Thai text into 3-character windows regardless of spaces, making it remarkably effective for Thai search (e.g. searching "เชียงราย", "ล้านนา", "ชาติพันธุ์" will reliably hit exact substrings).
3. **Multi-token Query Splitting**: If a user inputs space-separated words (e.g. "งานวิจัย ข้าว เชียงราย"), split by whitespace and `and()` or `or()` the trigram conditions:
   ```typescript
   const tokens = query.split(/\s+/).filter(Boolean);
   const conditions = tokens.map((token) =>
     or(
       ilike(researchProjects.titleTh, `%${token}%`),
       ilike(researchProjects.keywords, `%${token}%`)
     )
   );
   ```

---

## ⚡ 5. Performance Verification

To verify that the query is using the GIN index instead of a sequential scan:
```sql
EXPLAIN ANALYZE
SELECT id, title_th
FROM research_projects
WHERE title_th ILIKE '%ล้านนา%';
```
Expected output: **`Bitmap Index Scan on research_title_th_trgm_idx`** with execution time `< 5ms`.
