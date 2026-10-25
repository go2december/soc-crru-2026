---
name: soc-crru-public-frontend
description: Frontend design standards, styling, routing, and Next.js App Router rules for the SOC-CRRU public website.
---

# SOC-CRRU Public Frontend Standards

This guide covers the design system, page structures, and components for the public web application of the Faculty of Social Sciences, CRRU.

---

## 🎨 1. Theme and Color System (Editorial Lanna Modernist)

We utilize the **Editorial Lanna Modernist** design system configured in `frontend/app/globals.css`:
* **Typography**: Google Font **Prompt** (Weights 100-900).
* **Primary Color (Chiang Rai Saffron Flame)**: `#C2410C` (WCAG AA 4.8:1 on white).
  - Classes: `bg-primary text-primary-foreground hover:bg-primary/90`, `text-primary`
* **Secondary / Heritage Color (CRRU Lotus Plum)**: `#581C87` (Represents CRRU academic identity & heritage).
  - Classes: `bg-secondary text-secondary-foreground`, `text-secondary`
* **Background & Surface (Mist Canvas)**: `#F8FAFC` (`bg-background text-foreground`).
* **Cards & Containers**: `bg-card text-card-foreground border border-border`.
* **Prohibited Conventions**: **NEVER** use DaisyUI classes (`btn`, `btn-primary`, `bg-base-100`, `border-base-300`). Always use Tailwind v4 utilities and Shadcn UI components.

---

## 📐 2. The "Sharp & Professional" Design Rule

To deliver a premium, state-of-the-art academic layout:
* **NO Standard Large Roundings**: Avoid generic `rounded-xl`, `rounded-2xl`, or `rounded-full` on cards, badges, and structural containers.
* **Default Border Radius**: Use **`rounded-sm`** (or square borders `rounded-none`) to keep elements sharp, editorial, and aligned with academic typography.
* **Exception**: `rounded-full` may only be used for circular avatar profile images and icon status pills.

Example of standard card & button styling:
```tsx
import { Button } from "@/components/ui/button";

// Good: Shadcn UI with Sharp Lanna Editorial styling
<div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
  <h2 className="text-xl font-bold text-foreground">ข้อมูลข่าวสาร</h2>
  <p className="text-sm text-muted-foreground mt-2">รายละเอียดและประกาศล่าสุดจากคณะสังคมศาสตร์</p>
  <Button className="rounded-sm mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
    อ่านเพิ่มเติม
  </Button>
</div>
```

---

## 📂 3. Code Directory Conventions

* **Pages & Routing**: Managed under the Next.js App Router in `frontend/app/`.
  * e.g., `/chiang-rai-studies` -> `frontend/app/chiang-rai-studies/page.tsx`
* **Components**: 
  * UI Primitives: `frontend/components/ui/` (Shadcn UI based on Radix UI & CVA)
  * Feature & Domain components: `frontend/components/<feature>/`
* **Styling**: Central configuration in `frontend/app/globals.css` with Tailwind CSS v4 `@import "tailwindcss";`.

---

## 📱 4. Mobile & Responsive Layouts

Always test and support responsive behaviors:
* Use flex/grid combinations to adapt layout gracefully on mobile screen sizes:
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {/* Grid items */}
  </div>
  ```
* Typography: Use responsive font size utilities (e.g., `text-2xl md:text-3xl font-extrabold`).
* Tables & Data Grids: Wrap table elements with `overflow-x-auto` to ensure seamless mobile scrolling.
