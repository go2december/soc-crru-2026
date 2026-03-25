---
name: soc-crru-media-upload-cleanup
description: Media upload, URL resolution, replacement, and cleanup rules for SOC-CRRU. Use for `/uploads` handling, relative paths, preview behavior, SSR/client rendering, and edit/delete cleanup flows.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# SOC-CRRU Media Upload and Cleanup

> Media behavior in this project must preserve relative-path storage, correct URL resolution across environments, and cleanup of replaced or deleted assets.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the media flow being changed.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `storage-and-url-rules.md` | Relative path rules and runtime URL resolution | When editing uploads or rendering |
| `cleanup-flows.md` | Replace/delete cleanup rules for media-sensitive entities | When editing destructive or replacement flows |
| `validation-checks.md` | Post-change verification checklist for media behavior | Before finishing media-related work |

## ✅ Checklist

- [ ] Store media references as relative paths only
- [ ] Verify admin and public URL resolution separately
- [ ] Preserve cleanup behavior on replace/delete flows
- [ ] Check thumbnails, galleries, and embedded content images when relevant
- [ ] Avoid orphaning files on disk
