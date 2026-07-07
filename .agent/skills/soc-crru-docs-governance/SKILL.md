---
name: soc-crru-docs-governance
description: Procedures for synchronizing project documentation, updating MOC dashboards, and archiving resolved task plans.
---

# SOC-CRRU Project Documentation Governance

This guide controls how the documentation and knowledge base in Obsidian PKM (`docs/` folder) are synchronized when features are implemented or bugs are solved.

---

## 📂 1. Knowledge Base Layout

Our documentation space is structured to prevent AI token overload while maintaining a single source of truth:
* **`docs/00_Dashboard.md`**: The main Map of Content (MOC). This is the starting index.
* **`docs/01_Active_Tasks/`**: Temporary project plans and active feature goals.
  * e.g., `Current_Status.md` -> high-level status of all tasks.
* **`docs/02_Architecture/`**: Database schemas, structure charts, and architectural decisions.
* **`docs/99_Archive/`**: Storage for completed project plans and solved bug logs.

---

## 🔄 2. Post-Change Synchronization Workflow

Whenever a feature implementation or bug resolution is finished, you **MUST** synchronize documentation:

1. **Update Current Status**: 
   * Open [Current_Status.md](file:///e:/web2026/soc-crru-web/docs/01_Active_Tasks/Current_Status.md).
   * Mark completed tasks as `[x]`. Move them to the "งานที่เพิ่งเสร็จ" (Recently completed) table.
   * Update the `updated` date metadata at the top of the file.

2. **Archive Completed Task Plans**:
   * Move completed `.md` plan files from `docs/01_Active_Tasks/` to `docs/99_Archive/`.
   * Update references to this archived file in [00_Dashboard.md](file:///e:/web2026/soc-crru-web/docs/00_Dashboard.md).
   * Keeping only active plans in `01_Active_Tasks/` prevents AI confusion.

---

## 🔗 3. Standard Link Patterns (Obsidian PKM)

* Use double square brackets for linking files (e.g. `[[01_Active_Tasks/Current_Status.md]]`).
* If communicating file locations to the user, format them as clickable Markdown file links (e.g. `[Current_Status.md](file:///absolute/path/to/file)`).
