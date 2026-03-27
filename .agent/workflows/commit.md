---
description: Git commit and push changes to GitHub repository.
---

# /commit - Git Commit & Push

$ARGUMENTS

---

## Task

Commit and push current changes to GitHub.

---

## Steps

// turbo-all

1. Check git status
```powershell
git status
```

2. Stage all changes
```powershell
git add -A
```

3. Show staged changes summary
```powershell
git diff --cached --stat
```

4. Commit with message (use argument or generate from changes)
```powershell
git commit -m "$MESSAGE"
```

5. Push to remote
```powershell
git push origin main
```

---

## Output Format

```markdown
## ✅ Git Push Complete

- **Branch:** main
- **Commit:** $HASH
- **Message:** $MESSAGE
- **Files changed:** $COUNT
```

---

## Examples

```
/commit                          → Auto-generate message from changes
/commit "feat: add admissions"   → Use provided message
```
