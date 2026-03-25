# Design and Theming

## DaisyUI Rules

- Use DaisyUI for public-facing layouts and components.
- Use the configured `socTheme` and existing design tokens from `frontend/app/globals.css`.
- Faculty public pages keep the Scholar palette.
- Chiang Rai public pages keep the Chiang Rai brand palette and public presentation style.

## Anti-Patterns

- Do not mix shadcn/ui primitives with DaisyUI markup in the same public component.
- Do not move public UI into `frontend/components/ui/`.
- Do not introduce a third UI library.
