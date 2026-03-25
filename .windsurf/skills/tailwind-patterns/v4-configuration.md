# v4 Configuration

## Tailwind v4 Rules

- Tailwind v4 in this project is configured primarily through CSS, especially `frontend/app/globals.css`.
- Reuse `@theme`, CSS variables, and existing design tokens before adding new ones.
- Keep semantic naming patterns aligned with current project tokens.

## Avoid

- Reintroducing legacy config habits unnecessarily
- Adding arbitrary values everywhere when a token already exists
- Breaking DaisyUI or shadcn variable assumptions in shared styles
