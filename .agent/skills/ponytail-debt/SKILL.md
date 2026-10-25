---
name: ponytail-debt
description: >
  List every `shortcut:` comment (and older `ponytail:` ones) as a debt ledger. One-shot report,
  changes nothing. Use for "ponytail debt", "what did ponytail defer", "list the
  shortcuts", /ponytail-debt.
---

Every deliberate ponytail shortcut is marked with a `shortcut:` comment naming
its ceiling and upgrade path (older code may say `ponytail:`). This collects them into one ledger so a deferral
can't quietly become permanent.

## Scan

Grep the repo for comment markers, skipping `.git` and everything the
`.gitignore` files ignore (dependencies, build output, caches, in any stack):

`git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?(shortcut|ponytail):'`  (add other comment prefixes if your stack uses them)

If the user names their own marker word (`/ponytail-debt TODO`), grep for that word instead.

Each hit is one ledger row. The comment prefix keeps prose that merely mentions
the convention out of the ledger. Skip hits that are not a deferral, like a note
about a keyboard shortcut.

## Output

One row per marker, grouped by file:

`<file>:<line>, <what was simplified>. ceiling: <the limit named>. upgrade: <the trigger to revisit>.`

The convention is `shortcut: <ceiling>, <upgrade path>` (or `ponytail: <ceiling>, <upgrade path>`), so pull the ceiling
and the trigger straight from the comment. Want an owner per row too? add
`git blame -L<line>,<line>`.

Flag the rot risk: any marker comment that names no upgrade path or
trigger gets a `no-trigger` tag, those are the ones that silently rot.

End with `<N> markers, <M> with no trigger.` Nothing found: `No shortcut debt. Clean ledger.`

## 📓 Obsidian Vault Persistence (`obsidian-pkm`)

When asked to persist the debt ledger to disk, DO NOT write a loose `PONYTAIL-DEBT.md` in the project root.
Instead, write to the Obsidian Vault under `docs/01_Active_Tasks/Ponytail_Debt_Ledger.md` formatted as an Obsidian Atomic Note:

1. **Frontmatter:**
   ```yaml
   ---
   title: "Ponytail Debt Ledger"
   tags: [tech-debt, ponytail, active-task]
   aliases: ["Debt Ledger"]
   ---
   ```
2. **Obsidian Callout:**
   Use `> [!warning] Rot Risk` to highlight items with `no-trigger`.
3. **Wikilinks:**
   Include `[[00_Dashboard|Back to MOC]]` and relevant feature notes `[[01_Active_Tasks/...]]`.
4. **Atomicity:**
   Keep the note under 150-200 lines. If the ledger exceeds 200 lines, group by microservice/package into sub-notes.

## Boundaries

Reads and reports only, changes nothing. To persist it, ask and it writes the
ledger to `docs/01_Active_Tasks/Ponytail_Debt_Ledger.md`. One-shot.
