---
name: soc-crru-admin-dashboard
description: Rules, component structures, form validations, and user interaction standards for the SOC-CRRU admin dashboards.
---

# SOC-CRRU Admin Dashboard Guidelines

This guide specifies standard UI components, form validation patterns, data loading/mutation states, and user interaction rules for the Admin Dashboards.

---

## 🔐 1. Admin Authentication & Access Control

The application implements separate entry points for administrative tasks:
* **Faculty Admin**: `/admin/login` -> redirects to `/admin/dashboard` upon success.
* **Chiang Rai Studies Admin**: `/chiang-rai-studies/admin/login` -> redirects to `/chiang-rai-studies/admin` upon success.

Always verify that private dashboard routes are wrapped with appropriate **Session/Auth Guards** or middleware to prevent unauthorized access.

---

## 🎨 2. Design Consistency & Shadcn UI Integration

All forms, buttons, inputs, and modal wrappers must adhere to the **`rounded-sm`** (Sharp & Professional) rule and use **Shadcn UI** primitives:
* **Input Fields**:
  ```tsx
  import { Input } from "@/components/ui/input";
  <Input className="rounded-sm w-full" placeholder="ระบุข้อมูล..." />
  ```
* **Action Buttons**:
  ```tsx
  import { Button } from "@/components/ui/button";
  <Button className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/90">
    บันทึกข้อมูล
  </Button>
  ```
* **Card Wrappers**:
  ```tsx
  <div className="bg-card text-card-foreground border border-border p-6 rounded-sm shadow-sm">
    {/* Content */}
  </div>
  ```
* **Prohibited**: Do NOT use DaisyUI class names (`btn`, `btn-primary`, `input-bordered`, `card bg-base-100`).

---

## 📝 3. Forms & Schema Validation

To ensure database integrity and friendly error feedback:
* Use **Zod** schema validations on the frontend with `react-hook-form` to check fields prior to submission.
* Fields like Title, Category, Content, and Dates must match backend schema types (e.g. valid UUIDs, non-empty strings).
* Render explicit error messages below failing inputs:
  ```tsx
  {errors.nameTh && (
    <p className="text-destructive text-xs mt-1 font-medium">{errors.nameTh.message}</p>
  )}
  ```

---

## ⚠️ 4. Confirmations, Actions, and Modals

### Delete / Destructive Actions
* **NEVER** delete records silently without a confirmation prompt or modal dialogue.
* Use Shadcn / Radix Dialog or an accessible modal with `rounded-sm`.
* Highlight destructive buttons using `variant="destructive"` (`bg-destructive text-destructive-foreground`).

Example confirmation dialog pattern:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
  <DialogContent className="rounded-sm sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>ยืนยันการลบข้อมูล?</DialogTitle>
      <DialogDescription>
        การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลจะถูกลบออกจากระบบอย่างถาวร
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-2 sm:gap-0">
      <Button variant="outline" className="rounded-sm" onClick={() => setShowConfirm(false)}>
        ยกเลิก
      </Button>
      <Button variant="destructive" className="rounded-sm" onClick={handleDelete}>
        ยืนยันการลบ
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## ⏳ 5. States & Feedback

* **Loading State**: Always show a loading spinner (e.g. `Loader2` from `lucide-react`) or skeleton component during API fetch or submission actions. Disable form submit buttons (`disabled={isSubmitting}`) to prevent double-post bugs.
* **Toast Feedback**: Use **Sonner** (`toast.success(...)` / `toast.error(...)`) for clean toast notifications when a create, update, or delete action finishes.
