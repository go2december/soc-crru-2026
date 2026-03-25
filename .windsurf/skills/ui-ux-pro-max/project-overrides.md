# Project Overrides

## Required Framework Separation

- Public pages must use DaisyUI and project design tokens.
- Admin dashboards must use shadcn/ui components from `frontend/components/ui/`.
- Do not mix DaisyUI classes with shadcn/ui primitives in the same component.

## Route Scope

### Public Routes
- `/`
- `/about/*`
- `/programs/*`
- `/academics/*`
- `/admissions`
- `/research/*`
- `/eservice/*`
- `/chiang-rai-studies/*` except admin sub-routes

### Admin Routes
- `/admin/*`
- `/chiang-rai-studies/admin/*`

## Branding

- Faculty public pages maintain Scholar styling and `socTheme`.
- Chiang Rai public pages maintain Chiang Rai brand colors and public-facing content presentation.
- Admin pages use the existing professional slate style with brand accents.
