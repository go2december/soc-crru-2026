# Route Scope and Auth

## Admin Route Scope

Use this skill for:

- `/admin/*`
- `/chiang-rai-studies/admin/*`

## Auth Rules

- Faculty admin flow: `/admin/login` -> `/api/auth/google` or `/api/auth/dev/login` -> `/admin/callback` -> `/admin/(dashboard)/dashboard`
- Chiang Rai admin flow: `/chiang-rai-studies/admin/login` -> `/api/auth/google` or `/api/auth/dev/login` -> `/chiang-rai-studies/admin/callback` -> `/chiang-rai-studies/admin`
- Do not change route paths or callback paths unless explicitly required.
