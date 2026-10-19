---
name: receiving-code-review
description: Use when receiving code review feedback from users, peer agents, or automated audits before implementing suggestions. Enforces technical verification, YAGNI/Ponytail checks, and reasoned pushback instead of blind agreement.
---

# Receiving Code Review

> **Adapted from `obra/superpowers` for the `soc-crru-web` Antigravity Kit & Ponytail environment.**

## Overview

Code review requires **technical evaluation**, not emotional performance or blind compliance.

**Core principle:** Verify before implementing. Ask before assuming. Technical correctness and Ponytail simplicity over performative agreement.

---

## The 6-Step Response Pattern

```plaintext
WHEN receiving code review feedback:

1. READ: Complete feedback without reacting immediately
2. UNDERSTAND: Restate the technical requirement (or ask if ambiguous)
3. VERIFY: Check against actual codebase reality (grep callers, types, DB schema)
4. EVALUATE: Is it technically sound AND aligned with Ponytail/Clean Code for THIS repo?
5. RESPOND: Technical acknowledgment OR reasoned pushback with evidence
6. IMPLEMENT: One logical item at a time, verifying each with `verification-before-completion`
```

---

## Forbidden vs. Preferred Responses

### ❌ NEVER (Performative / Blind Compliance)
- *"You're absolutely right!"* / *"Great point!"* / *"Excellent feedback!"*
- *"Let me implement all of that right now"* (before checking existing callers or codebase constraints)
- Implementing half-understood feedback while guessing the rest

### ✅ INSTEAD (Engineering Rigor)
- Restate the exact technical change needed
- Ask clarifying questions on ambiguous items before touching code
- Push back respectfully with codebase evidence (`file:line`) if a suggestion breaks existing architecture or violates project rules
- Let actions and verified diffs speak louder than praise

---

## Handling Unclear Feedback

```plaintext
IF any item in a multi-point review is unclear:
  STOP — do not implement partial items that depend on the unclear part
  ASK for clarification on the specific unclear items first
```

**Example:**
> User/Reviewer: *"Fix items 1–4 in the Academic Service."*
> You understand 1, 2, and 4, but item 3 conflicts with the Drizzle schema.
> - ❌ **WRONG:** Implement 1, 2, 4 and guess 3.
> - ✅ **RIGHT:** *"I've verified items 1, 2, and 4 against `academic.service.ts`. Before applying changes, item 3 conflicts with the `programs` table constraint in `schema.ts`—should we..."*

---

## Ponytail & YAGNI Filter on Review Suggestions

When an external review, linter, or subagent suggests adding "enterprise/proper" abstractions:

1. **Grep actual usage** across `apps/backend` and `apps/frontend`.
2. **Apply the Ponytail Ladder:**
   - Does this abstraction solve an actual problem in `soc-crru-web`, or is it speculative bloat?
   - Does a native feature, standard library, or existing helper already cover it?
3. **If unused or over-engineered:** Propose the minimal alternative or ask whether the extra complexity is truly needed.
