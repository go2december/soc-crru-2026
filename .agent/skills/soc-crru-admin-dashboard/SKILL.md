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

## 🎨 2. Design Consistency & Sharp Theme

All forms, buttons, inputs, and modal wrappers must adhere to the **`rounded-sm`** (Sharp & Professional) rule:
* **Input Fields**: `<input className="input input-bordered rounded-sm w-full" />`
* **Action Buttons**: `<button className="btn btn-primary rounded-sm">บันทึกข้อมูล</button>`
* **Card wrappers**: `<div className="card bg-base-100 border border-base-200 rounded-sm">...</div>`

---

## 📝 3. Forms & Schema Validation

To ensure database integrity and friendly error feedback:
* Use **Zod** schema validations on the frontend to check fields prior to submission.
* Fields like Title, Category, Content, and Dates must match backend schema types (e.g. valid UUIDs, non-empty varchars).
* Render explicit error messages below failing inputs:
  ```tsx
  {errors.nameTh && <p className="text-error text-xs mt-1">{errors.nameTh.message}</p>}
  ```

---

## ⚠️ 4. Confirmations, Actions, and Modals

### Delete / Destructive Actions
* **NEVER** delete records silently without a confirmation prompt or modal dialogue.
* Use a structured confirmation modal matching the general theme.
* Highlight destructive buttons in red (`btn-error` / `bg-red-600`) to denote irreversible actions.

Example confirmation modal pattern:
```tsx
{showConfirm && (
  <div className="modal modal-open">
    <div className="modal-box rounded-sm">
      <h3 className="font-bold text-lg">ยืนยันการลบข้อมูล?</h3>
      <p className="py-4">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
      <div className="modal-action">
        <button className="btn rounded-sm" onClick={() => setShowConfirm(false)}>ยกเลิก</button>
        <button className="btn btn-error rounded-sm text-white" onClick={handleDelete}>ยืนยันการลบ</button>
      </div>
    </div>
  </div>
)}
```

---

## ⏳ 5. States & Feedback

* **Loading State**: Always show a loading spinner or skeleton component during API fetch or submission actions. Disable form submit buttons to prevent double-post bugs.
* **Toast Feedback**: Show a clean toast notification (`success` / `error`) when a create, update, or delete action finishes.
