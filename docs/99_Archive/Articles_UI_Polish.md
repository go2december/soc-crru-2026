# Articles UI Polish Plan

## Task Description
Improve the UI of article detail pages (News and CRS Articles) to match the "Sharp & Professional" theme established for the Research module.

## Target Pages
1.  **Faculty News Detail**: `frontend/app/news/[slug]/page.tsx`
2.  **CRS Article Detail**: `frontend/app/chiang-rai-studies/articles/[slug]/page.tsx`

## Design Decisions (Sharp & Professional)
- **Geometry**: Replace large border radii (`rounded-3xl`, `rounded-2xl`, `rounded-xl`) with sharp edges (`rounded-sm` or `rounded-none`).
- **Borders**: Ensure crisp, subtle borders instead of soft shadows where possible.
- **Typography**: Maintain the strong, professional typography but ensure spacing is precise.
- **Color (CRS)**: Review the purple usage. Replace "AI Generic Purple" with more professional tones or stick to the Faculty brand (`scholar-deep`) if it doesn't break the CRS identity. *Actually, I will keep the CRS accent colors but sharpen the geometry.*

## Implementation Steps
### Phase 1: Faculty News
- [x] Update `frontend/app/news/[slug]/page.tsx`:
    - Change `rounded-3xl` in Article Actions / Sidebar to `rounded-sm`.
    - Change `rounded-2xl` in attachment cards to `rounded-sm`.
    - Sharpen the hero section gradients.

### Phase 2: Chiang Rai Studies Articles
- [x] Update `frontend/app/chiang-rai-studies/articles/[slug]/page.tsx`:
    - Change `rounded-3xl` in the main container to `rounded-sm`.
    - Change `rounded-2xl` in the abstract block to `rounded-sm`.
    - Change `rounded-xl` in gallery/videos to `rounded-sm`.
    - Sharpen all card borders.

## Verification
- [x] Check responsive behavior (Sharp edges often look better on small screens too).
- [x] Ensure `lucide-react` icons are used consistently.
