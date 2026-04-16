---
name: tailwind-patterns
description: Tailwind CSS v4 guidance for SOC-CRRU. Use for CSS-first configuration, theme tokens, responsive patterns, modern layout decisions, and utility-class architecture.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tailwind Patterns

> Use this skill when the task is mainly about Tailwind CSS v4 architecture, tokens, responsive layout, and modern utility usage.

## 🎯 Selective Reading Rule

**Read ONLY the relevant guidance file for the styling problem at hand.**

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `v4-configuration.md` | CSS-first theme configuration and token rules | When editing global theme/config |
| `responsive-and-layout.md` | Responsive, grid, flex, and container-query decisions | When changing layouts |
| `component-and-utility-rules.md` | Utility hygiene, extraction, anti-patterns | When refactoring component styles |

## ✅ Checklist

- [ ] Respect Tailwind v4 CSS-first patterns
- [ ] Reuse existing theme tokens before inventing new ones
- [ ] Use responsive patterns intentionally
- [ ] Avoid utility sprawl and repeated long class combinations
- [ ] Keep project UI framework separation rules intact
