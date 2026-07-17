# 🧩 Zustand — Complete Guide for React State Management

> Zustand is a small, fast, and scalable state management library for React.  
> It provides a simple, hook‑based API for global state without the boilerplate of Redux or the re‑render pitfalls of Context.

---

## 🚀 1. Installation

```bash
npm install zustand
```

For additional middleware (devtools, persist, immer):

```bash
npm install zustand @immer/core
```

> All middlewares are already included in the main `zustand` package; `immer` is optional but highly recommended.

---

## ⚙️ 2. Basic Store (TypeScript)

```ts
// store/useCounterStore.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

**Usage in a component:**

```tsx
import { useCounterStore } from '@/store/useCounterStore';

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## 🧠 3. Selecting State (Performance)

Zustand uses **selectors** to avoid unnecessary re‑renders. A component only re‑renders when the selected value changes.

```tsx
// ❌ Destructuring the whole store causes re‑renders on any change
const { count, increment } = useCounterStore();

// ✅ Fine‑grained selectors (recommended)
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);
```

For **derived data**, compute inside a selector or use `useShallow` for arrays/objects.

```tsx
import { useShallow } from 'zustand/react/shallow';

// ✅ Avoids re‑renders when array identity changes but content is same
const ids = useUserStore(useShallow((state) => state.users.map(u => u.id)));
```

---

## 🧩 4. Middleware

Zustand ships with several middlewares that can be composed:

| Middleware | Purpose |
|-----------|---------|
| `devtools` | Redux DevTools integration |
| `persist` | Persist state to `localStorage` / `sessionStorage` |
| `immer` | Write “mutative” updates (powered by Immer) |
| `subscribeWithSelector` | Subscribe to store changes with a selector (for external listeners) |

### Devtools + Persist + Immer Combined

```ts
// store/useThemeStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ThemeState {
  mode: 'light' | 'dark';
  fontSize: number;
  toggle: () => void;
  setFontSize: (size: number) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      immer((set) => ({
        mode: 'light',
        fontSize: 16,
        toggle: () => set((state) => { state.mode = state.mode === 'light' ? 'dark' : 'light'; }),
        setFontSize: (size) => set((state) => { state.fontSize = size; }),
      })),
      { name: 'theme-storage' }
    ),
    { name: 'ThemeStore' }
  )
);
```

✅ The state survives page reloads, and DevTools let you inspect/time‑travel changes.

---

## 🔧 5. Async Actions & Server State

Zustand has no built‑in data fetching, but it can coordinate with **TanStack Query** or run async operations directly.

```ts
// store/useUserStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/user/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const user = await res.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
```

**Component:**

```tsx
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

function UserProfile({ id }: { id: string }) {
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => { fetchUser(id); }, [id]);

  if (loading) return <p>Loading…</p>;
  return <p>{user?.name}</p>;
}
```

> **Better approach**: Use **TanStack Query** for server data and keep Zustand for purely client‑side UI state.

---

## 🧱 6. Slices Pattern (Scalable Architecture)

Split large stores into separate “slices” – each responsible for a domain.

```ts
// store/slices/counterSlice.ts
import { StateCreator } from 'zustand';

export interface CounterSlice {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const createCounterSlice: StateCreator<CounterSlice> = (set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
});
```

```ts
// store/slices/userSlice.ts
export interface UserSlice {
  user: { name: string } | null;
  login: () => void;
  logout: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  login: () => set({ user: { name: 'Alice' } }),
  logout: () => set({ user: null }),
});
```

Combine them:

```ts
// store/index.ts
import { create } from 'zustand';
import { createCounterSlice, CounterSlice } from './slices/counterSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';

type Store = CounterSlice & UserSlice;

export const useStore = create<Store>()((...a) => ({
  ...createCounterSlice(...a),
  ...createUserSlice(...a),
}));
```

✅ Perfect for large apps — each slice is a self‑contained module.

---

## 🧪 7. Testing Stores

Zustand stores are plain JavaScript, so you can test them just like any other function.

```ts
// store/__tests__/useCounterStore.test.ts
import { useCounterStore } from '../useCounterStore';

beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

test('increments counter', () => {
  useCounterStore.getState().increment();
  expect(useCounterStore.getState().count).toBe(1);
});
```

For integration with components, render normally and interact:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('counter increments', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /\+/ }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

## 🧭 8. Zustand vs. Context vs. Redux

| Tool         | When to Use                                                           |
| ------------ | --------------------------------------------------------------------- |
| **Zustand**  | Global UI state (theme, modals, cart), cross‑component sharing, simplicity |
| **Context**  | Truly global, low‑frequency state (auth, locale) — but avoid for high‑frequency updates |
| **Redux**    | Very large teams, established Redux patterns, time‑travel debugging mandatory |

✅ **Rule of thumb**:  
- Start with local state (`useState`/`useReducer`).  
- Lift to **Zustand** if multiple components far apart need the same data.  
- Use **TanStack Query** for server data.  
- Reach for Context only when the data rarely changes.

---

## 💡 9. Best Practices

- **Use selectors** to avoid unnecessary re‑renders.
- **Slice large stores** by feature/domain.
- **Persist** only critical state (theme, user preferences) — never server data.
- **Combine with TanStack Query** for server data; Zustand handles UI state only.
- **Write immutable‑like updates** with Immer middleware for complex nested state.
- **Add `devtools`** middleware early — it makes debugging much easier.
- **Test stores in isolation** with `getState().action()` and `setState({})`.

---

## 🔗 10. Resources

- [Zustand Official Docs](https://docs.pmnd.rs/zustand)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand + TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Slices Pattern](https://docs.pmnd.rs/zustand/guides/slices-pattern)
- [Immer Middleware](https://docs.pmnd.rs/zustand/integrations/immer-middleware)
- [Testing with Zustand](https://docs.pmnd.rs/zustand/guides/testing)

---

## ✅ Summary

> Zustand is the sweet spot between simplicity and power for React state management.  
> It gives you global state without Provider trees, actions without boilerplate, and a tiny footprint.  
> Use it for **UI state**, leave **server state** to TanStack Query, and your React app will stay predictable, fast, and maintainable.
```
