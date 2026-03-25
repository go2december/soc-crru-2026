# Routing and Scope

## Public Route Scope

Use this skill for:

- `/`
- `/about/*`
- `/programs/*`
- `/academics/*`
- `/admissions`
- `/research/*`
- `/eservice/*`
- `/chiang-rai-studies/*` except `/chiang-rai-studies/admin/*`

## Rules

- Public pages must use DaisyUI classes and themes.
- Do not import components from `frontend/components/ui/` into public routes.
- Reuse shared public components from `frontend/components/` before creating new ones.
- Preserve App Router patterns and prefer server-friendly data fetching.
