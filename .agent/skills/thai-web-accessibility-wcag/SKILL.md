---
name: thai-web-accessibility-wcag
description: Standards and implementation patterns for Thai Web Accessibility (WCAG 2.1/2.2 AA) for university and government portals, including color contrast, Thai screen readers, keyboard navigation, and ARIA roles.
---

# Thai Web Accessibility Standards (WCAG 2.1/2.2 AA)

This skill dictates accessibility requirements and implementation patterns for the SOC-CRRU web platform to ensure compliance with Thailand's e-Government Web Accessibility Standards and international WCAG 2.1/2.2 Level AA requirements.

---

## 🏛️ 1. Core Principles (POUR)

1. **Perceivable (รับรู้ได้)**: Information and UI components must be presentable to users in ways they can perceive.
2. **Operable (ใช้งานได้)**: User interface components and navigation must be operable via keyboard and assistive tools.
3. **Understandable (เข้าใจได้)**: Information and operation of user interface must be understandable (clear Thai/English language structure).
4. **Robust (ทนทานรองรับได้)**: Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies (JAWS, NVDA with Thai speech synthesizers).

---

## 🎨 2. Visual & Contrast Rules

- **Normal Text (< 18pt or < 14pt bold)**: Contrast ratio $\ge$ **4.5:1** against background.
- **Large Text ($\ge$ 18pt or $\ge$ 14pt bold)**: Contrast ratio $\ge$ **3.0:1**.
- **UI Components & Icons**: Contrast ratio $\ge$ **3.0:1** for borders, focus states, and interactive iconography.

```tsx
// ✅ Correct: High contrast in Tailwind CSS
<p className="text-zinc-800 dark:text-zinc-100">
  มหาวิทยาลัยราชภัฏเชียงราย
</p>

// ❌ Forbidden: Low contrast muted text
<p className="text-zinc-400">
  มหาวิทยาลัยราชภัฏเชียงราย
</p>
```

---

## ⌨️ 3. Keyboard Navigation & Focus Management

### 3.1 Skip to Main Content Link
Every layout must provide a skip link as the very first focusable element in `frontend/app/layout.tsx`:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-sm focus:shadow-md"
>
  ข้ามไปยังเนื้อหาหลัก (Skip to content)
</a>
```

### 3.2 Visible Focus Indicators
Never remove outline without an explicit replacement:
```css
/* ✅ Tailwind pattern */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

### 3.3 Dialog & Modal Focus Trapping
Modals must:
- Trap keyboard focus inside while open (`Tab` / `Shift+Tab`)
- Close on `Escape` key press
- Return focus to the trigger button upon closing

---

## 🗣️ 4. Thai Language & Screen Reader Optimization

### 4.1 Document Language
Ensure `html` tag declares the primary language:
```tsx
<html lang="th" className="scroll-smooth">
```
For English pages or bilingual sections, mark containers explicitly:
```tsx
<p lang="en" className="text-sm text-zinc-600">
  Chiang Rai Rajabhat University
</p>
```

### 4.2 Semantic Headings & Thai Labeling
- Strictly follow single `<h1>` per page, followed by logical `<h2>`, `<h3>` hierarchy. Never skip levels for styling.
- Interactive elements without visible text must have meaningful Thai `aria-label`:
```tsx
// ✅ Accessible Icon Button
<button
  type="button"
  aria-label="ค้นหางานวิจัยและบทความ"
  className="p-2 rounded-sm"
>
  <Search className="w-5 h-5" aria-hidden="true" />
</button>
```

---

## 🖼️ 5. Media, Artifacts & Attachment Rules

1. **Images & Cultural Artifacts**:
   - `alt` text must be descriptive in Thai (e.g. `alt="พระพุทธรูปปางมารวิชัย ศิลปะล้านนา วัดพระสิงห์ เชียงราย"`).
   - Purely decorative images must have `alt=""` and `aria-hidden="true"`.
2. **Downloadable Files (PDF / CSV / Docs)**:
   - Must indicate file type and size to the user:
   ```tsx
   <a href="/uploads/report.pdf" download aria-label="ดาวน์โหลดรายงานผลการดำเนินงานประจำปี (ไฟล์ PDF ขนาด 2.4 MB)">
     รายงานผลการดำเนินงาน (PDF, 2.4 MB)
   </a>
   ```

---

## ✅ 6. Automated Verification Checklist

Before deploying any frontend change:
1. **Lighthouse Accessibility Score**: Must be $\ge$ 95/100.
2. **No Form Label Missing**: All `<input>`, `<select>`, `<textarea>` have matching `<label htmlFor="...">`.
3. **Keyboard Only Test**: Disconnect mouse or test with `Tab`, `Shift+Tab`, `Enter`, and `Spacebar`. All features must be fully navigable.
