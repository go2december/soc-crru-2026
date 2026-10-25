# React 19 Modern Patterns & Best Practices

> [!IMPORTANT]
> The SOC-CRRU frontend runs on **React 19 (`^19.2.8`)**. Use React 19 native primitives instead of legacy React 18 patterns.

---

## 1. `ref` as a Standard Prop (No `forwardRef`)

In React 19, function components accept `ref` directly as a normal prop. `forwardRef` is no longer needed.

```tsx
// ❌ Legacy React 18 (Deprecated style)
const CustomInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

// ✅ Modern React 19
interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
}

export function CustomInput({ ref, label, ...props }: InputProps) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
}
```

---

## 2. Form Actions with `useActionState` (Replaces `useFormState`)

`useActionState` is the standard React 19 hook for Server Actions and form submissions. It provides the action function, latest return state, and the `isPending` status in a single tuple.

```tsx
'use client';

import { useActionState } from 'react';
import { updateStaffAction } from '@/app/actions/staff';
import { Button } from '@/components/ui/button';

export function StaffEditForm({ staffId }: { staffId: string }) {
  const [state, formAction, isPending] = useActionState(updateStaffAction, {
    success: false,
    message: '',
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={staffId} />
      <input name="nameTh" defaultValue="" required className="border p-2" />
      
      {state.message && (
        <p className={state.success ? 'text-green-600' : 'text-destructive'}>
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
      </Button>
    </form>
  );
}
```

---

## 3. Instant UI Updates with `useOptimistic`

`useOptimistic` enables instant UI feedback before the server responds, automatically rolling back if the action fails.

```tsx
'use client';

import { useOptimistic } from 'react';

export function LikeButton({ likes, onLike }: { likes: number; onLike: () => Promise<void> }) {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (current, update: number) => current + update
  );

  async function handleClick() {
    setOptimisticLikes(1);
    await onLike();
  }

  return (
    <button onClick={handleClick}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

---

## 4. Context as a Provider (`<Context>` instead of `<Context.Provider>`)

React 19 allows rendering `<Context>` directly instead of `<Context.Provider>`.

```tsx
import { createContext } from 'react';

export const ThemeContext = createContext<'light' | 'dark'>('light');

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    // ✅ Direct Context syntax in React 19
    <ThemeContext value="light">
      {children}
    </ThemeContext>
  );
}
```
