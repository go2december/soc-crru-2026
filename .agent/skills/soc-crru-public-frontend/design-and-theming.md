# Design and Theming

## DaisyUI Rules

- Use DaisyUI for public-facing layouts and components.
- Use the configured `socTheme` and existing design tokens from `frontend/app/globals.css`.
- Faculty public pages keep the Scholar palette.
- Chiang Rai public pages keep the Chiang Rai brand palette and public presentation style.

## Lightbox Gallery Standard

When implementing an image gallery with a lightbox anywhere in the public-facing application, strictly follow this standard (based on `NewsGalleryClient` pattern):
- **Component Architecture:** Extract the gallery into a separate Client Component (e.g., `GalleryClient.tsx`) to keep the main page as a Server Component for SEO and performance.
- **Backdrop:** Use a dark glassmorphic overlay (`bg-black/95 backdrop-blur-md`).
- **Navigation Controls:** Include absolute-positioned Next/Prev buttons (`ChevronLeft`/`ChevronRight`) and a top-right corner Close button (`X`).
- **Keyboard & Scroll:** Bind keyboard events (Arrow keys for navigation, ESC for closing). Ensure background scrolling is locked (`overflow = 'hidden'`) when active.
- **Thumbnails:** Include a horizontally scrollable row of interactive thumbnails at the bottom for quick navigation.
- **Download:** Provide a native download button that fetches and triggers a blob download.
- **Transitions:** Use smooth opacity and scale transform transitions (`duration-500`).

## Anti-Patterns

- Do not mix shadcn/ui primitives with DaisyUI markup in the same public component.
- Do not move public UI into `frontend/components/ui/`.
- Do not introduce a third UI library for lightboxes (do not install `react-image-lightbox` or similar); use the custom Tailwind/Lucide layout standard.
