# Frontend Error Archive — 2026-04-03

## Current status

- Closed
- The archived set of 6 TypeScript errors has been resolved
- Latest verification: `npx tsc --noEmit -p tsconfig.json` passed

## Scope

Archive of the current frontend-wide TypeScript and ESLint status after the research public listing/detail, sitemap, and SEO work.

## Commands used

```bash
npx tsc --noEmit -p tsconfig.json
npx eslint .
```

## ESLint status

`npx eslint .`

Result:

- Passed
- No repo-wide ESLint errors were reported at the time of this archive

## TypeScript status

`npx tsc --noEmit -p tsconfig.json`

Result:

- Passed
- 0 errors

## Closed error set summary

The following archived issues were fixed and are retained here as a historical record of the resolved batch.

### 1) `app/admissions/page.tsx`

- `TS2552` at line 302
- `Cannot find name 'ExternalLink'. Did you mean 'External'?`

### 2) `app/chiang-rai-studies/admin/articles/create/page.tsx`

- `TS2304` at line 58
- `Cannot find name 'uploadImage'`

- `TS2304` at line 127
- `Cannot find name 'handleTitleChange'`

- `TS2304` at line 193
- `Cannot find name 'getMediaType'`

### 3) `app/news/[slug]/page.tsx`

- `TS18047` at line 117
- `'newsItem.attachments' is possibly 'null'`

- `TS18047` at line 152
- `'newsItem.attachments' is possibly 'null'`

## Resolution summary

- `app/admissions/page.tsx`
  - Added the missing `ExternalLink` import from `lucide-react`

- `app/chiang-rai-studies/admin/articles/create/page.tsx`
  - Restored missing helper implementations:
    - `generateSlug`
    - `uploadImage`
    - `handleTitleChange`
    - `getMediaType`

- `app/news/[slug]/page.tsx`
  - Normalized `attachments` to an empty array fallback before rendering
  - Replaced direct nullable access with null-safe array usage

## Notes

- These errors pre-existed outside the research public route work completed earlier in the session.
- This archived TypeScript batch has now been closed.
- Research-related files updated in the session were linted separately and passed.
