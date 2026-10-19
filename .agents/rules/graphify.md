---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI). Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, much smaller than `GRAPH_REPORT.md` or raw grep output.
- Leave Markdown documentation (`docs/`) to `obsidian-pkm` MOCs and Atomic notes; use `graphify` strictly for AST source code navigation (`backend/`, `frontend/`).
- Read `graphify-out/GRAPH_REPORT.md` only for broad code architecture review or when `query`/`path`/`explain` do not surface enough context.
- After modifying code files in this session, run `graphify extract . --code-only` (or `graphify update .`) to keep the graph current (100% local AST, 0 LLM tokens).

