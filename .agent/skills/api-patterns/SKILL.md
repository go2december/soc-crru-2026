---
name: api-patterns
description: API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Patterns

> API design principles and decision-making for 2025.
> **Learn to THINK, not copy fixed patterns.**

## 📦 SOC CRRU Standard Pagination Architecture

For this repository, any API that returns a list of items MUST be paginated strictly following this format:

1. **Backend Response (`{ data, meta }`)**:
   ```json
   {
     "data": [...items],
     "meta": {
       "total": 50,
       "page": 1,
       "limit": 10,
       "totalPages": 5
     }
   }
   ```
2. **Backend NestJS Implementation**:
   Inject `@Query('page')` and `@Query('limit')` in the Controller. In the Service, use Drizzle ORM `.limit()` and `.offset()`. Query the total count separately with `sql<number>count(*)`.
3. **Frontend Admin Integration**:
   Fetch `limit=500` (or appropriate high number) if you need **Client-Side search (filtered arrays)**, then apply array slicing locally `filteredData.slice(...)` and use the `<AdminPagination />` UI component.
4. **Frontend Public Integration**:
   Fetch standard limit or full list, access through `res.json().data`, and present using the sleek `<MinimalPagination />` component.

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `api-style.md` | REST vs GraphQL vs tRPC decision tree | Choosing API type |
| `rest.md` | Resource naming, HTTP methods, status codes | Designing REST API |
| `response.md` | Envelope pattern, error format, pagination | Response structure |
| `graphql.md` | Schema design, when to use, security | Considering GraphQL |
| `trpc.md` | TypeScript monorepo, type safety | TS fullstack projects |
| `versioning.md` | URI/Header/Query versioning | API evolution planning |
| `auth.md` | JWT, OAuth, Passkey, API Keys | Auth pattern selection |
| `rate-limiting.md` | Token bucket, sliding window | API protection |
| `documentation.md` | OpenAPI/Swagger best practices | Documentation |
| `security-testing.md` | OWASP API Top 10, auth/authz testing | Security audits |

---

## 🔗 Related Skills

| Need | Skill |
|------|-------|
| API implementation | `@[skills/backend-development]` |
| Data structure | `@[skills/database-design]` |
| Security details | `@[skills/security-hardening]` |

---

## ✅ Decision Checklist

Before designing an API:

- [ ] **Asked user about API consumers?**
- [ ] **Chosen API style for THIS context?** (REST/GraphQL/tRPC)
- [ ] **Defined consistent response format?**
- [ ] **Planned versioning strategy?**
- [ ] **Considered authentication needs?**
- [ ] **Planned rate limiting?**
- [ ] **Documentation approach defined?**

---

## ❌ Anti-Patterns

**DON'T:**
- Default to REST for everything
- Use verbs in REST endpoints (/getUsers)
- Return inconsistent response formats
- Expose internal errors to clients
- Skip rate limiting

**DO:**
- Choose API style based on context
- Ask about client requirements
- Document thoroughly
- Use appropriate status codes

---

## Script

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/api_validator.py` | API endpoint validation | `python scripts/api_validator.py <project_path>` |

