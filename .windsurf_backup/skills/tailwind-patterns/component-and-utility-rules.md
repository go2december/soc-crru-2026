# Component and Utility Rules

## Utility Hygiene

- If the same long class combination appears repeatedly, extract or standardize it.
- Prefer reusable components or consistent utility conventions over copy-pasted styling blobs.
- Keep utility classes readable and grouped by purpose when possible.

## Anti-Patterns

- Mixing conflicting visual systems in the same component
- Overusing `@apply` when component extraction is clearer
- Sprinkling arbitrary values without design-system justification
