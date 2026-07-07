---
name: soc-crru-public-frontend
description: Frontend design standards, styling, routing, and Next.js App Router rules for the SOC-CRRU public website.
---

# SOC-CRRU Public Frontend Standards

This guide covers the design system, page structures, and components for the public web application of the Faculty of Social Sciences, CRRU.

---

## 🎨 1. Theme and Color System (Scholar Theme)

We utilize the custom **Scholar Theme** featuring a premium Gold & Deep Blue palette:
* **Primary Color (Deep Blue)**: Represents academic excellence and stability.
* **Secondary Color (Gold)**: Represents innovation, Siam wisdom, and CRRU heritage.
* **Accent Colors**: Subtle grays and soft background cards.
* **Forbidden Colors**: **NEVER** use violet or purple hex codes/Tailwind classes (e.g., `text-purple-600`, `bg-violet-500`) to respect the palette guide.

---

## 📐 2. The "Sharp & Professional" Design Rule

To deliver a premium, state-of-the-art academic layout:
* **NO Standard Roundings**: Do NOT use `rounded-xl`, `rounded-lg`, `rounded-md`, or `rounded-full` for structural components like cards, buttons, tables, input fields, and badges.
* **Default Border Radius**: Always use **`rounded-sm`** (or square borders `rounded-none`) to keep elements sharp, clean, and aligned.
* **Exception**: `rounded-full` may only be used for circular avatar profile images.

Example of standard card & button styling:
```tsx
// Good: Sharp borders
<div className="border border-base-300 bg-base-100 p-6 rounded-sm shadow-sm">
  <h2 className="text-xl font-bold">ข้อมูลข่าวสาร</h2>
  <button className="btn btn-primary rounded-sm mt-4">อ่านเพิ่มเติม</button>
</div>
```

---

## 📂 3. Code Directory Conventions

* **Pages & Routing**: Managed under the Next.js App Router in `frontend/app/`.
  * e.g., `/chiang-rai-studies` -> `frontend/app/chiang-rai-studies/page.tsx`
* **Components**: Put shared components under `frontend/components/` (e.g., `frontend/components/ui/` or specialized folders).
* **Styling**: Configuration is centered around Tailwind v4 in `frontend/app/globals.css`.

---

## 📱 4. Mobile & Responsive Layouts

Always test and support responsive behaviors.
* Use flex/grid combinations to adapt layout gracefully on mobile screen sizes:
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     {/* Grid items */}
  </div>
  ```
* Typography: Use responsive font size utilities (e.g., `text-2xl md:text-3xl font-extrabold`).
* Make sure table elements have horizontal scrolling wrapping on mobile viewports.
