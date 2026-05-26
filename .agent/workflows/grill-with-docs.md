---
description: Stress-test plans and features against codebase docs through iterative Socratic grilling.
---

# /grill-with-docs - Codebase-Aligned Socratic Interview

$ARGUMENTS

---

## Purpose

Use this workflow to align any new feature request, database schema change, or architectural plan with the project's existing codebase and documentation. It prevents over-engineering and bugs by stress-testing ideas against project constraints before writing code.

---

## Behavior & Steps

When `/grill-with-docs` is invoked:

1. **Read Existing Documentation (Context Loading)**
   - Locate and scan `docs/00_Dashboard.md` to find active files.
   - Scan relevant baseline plans: `docs/99_Archive/PLAN-soc-crru-baseline.md` and domain plans like `docs/99_Archive/PLAN-chiang-rai-studies.md`.
   - Read schema files (`backend/src/drizzle/schema.ts`) and existing API structures if database/API changes are planned.

2. **Conduct the Iterative Interview (The Grilling Phase)**
   - **Challenge Fuzzy Language:** If the user specifies vague requirements, challenge them to use concrete database columns, page routes, or design tokens.
   - **Ask 3 Strategic Socratic Questions:** Present exactly 3 deep, non-obvious questions about:
     - **Database Constraints:** Relationships, nullability, cascading deletes.
     - **API Design & DTOs:** Input validation (Zod/Pydantic), endpoint scopes, and roles.
     - **UI/UX Aesthetics:** Tailwind CSS v4 usage, CSS-first configurations, component styling.
     - **Edge Cases & Failure States:** Network timeouts, missing images, auth loop handling.
   - **DO NOT WRITE CODE** during this phase. Wait for user responses.

3. **Crystallize Decisions into Docs**
   - After the user answers the questions, summarize the resolved choices.
   - Write the finalized specification directly into a new active task file in `docs/01_Active_Tasks/{task-slug}.md`.
   - Update `docs/00_Dashboard.md` to link the new task in the Active Space list.

---

## Output Format (Grilling Phase)

```markdown
🤖 **Applying knowledge of @[backend-specialist] / @[project-planner]...**

## 🥩 Grilling Plan: [Feature Name]

I have analyzed the current codebase and project docs. To align the new plan, please help resolve these **3 strategic questions**:

1. **[Question 1 - Database/API/Security edge case]**
   - *Context:* (Why this matters based on our codebase)

2. **[Question 2 - Frontend/Theme/Aesthetics alignment]**
   - *Context:* (Why this matters for UX/Performance)

3. **[Question 3 - Migration/Data integrity/Cleanup detail]**
   - *Context:* (Why this matters for system stability)
```

---

## Key Principles

- **No premature coding** - Defer implementation until the design is locked.
- **Strict codebase alignment** - Use the actual folder structures, existing database tables, and variables.
- **Maintain single source of truth** - Always write the resolved specification back to `docs/` before coding.
