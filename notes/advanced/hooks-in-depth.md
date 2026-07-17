# 🎣 `hooks-in-depth.md`

_Mastering React Hooks — beyond the basics._

> 📌 **TL;DR**:
>
> - Hooks are **functions**, not magic — understand closures, timing, and stale values.
> - `useEffect` ≠ `componentDidMount` — it’s a _synchronization_ tool.
> - Avoid premature memoization (`useCallback`, `useMemo`).
> - In RSC world: **Hooks only work in Client Components** (`'use client'`).
> - Custom hooks should be **composable**, **testable**, and **side-effect isolated**.

---

## 🔁 The Hook Execution Model

### Rules of Hooks (Non-Negotiable)

1. **Only call at the top level** — not in loops, conditions, or nested functions.
2. **Only call from React functions** — custom hooks or function components.

✅ Enforced by ESLint: [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)

---

## 📋 Core Built-in Hooks

### `useState`

```tsx
const [state, setState] = useState(initialValue);
```

- Lazy initialization: `useState(() => computeExpensiveValue())`
- Functional updates: `setState(prev => prev + 1)` (avoids stale closures)
- **State is per-render** — not a “cell” — each render sees its own `state` snapshot.

> ⚠️ Gotcha:
>
> ```tsx
> // ❌ Stale state in async callback
> setTimeout(() => console.log(state), 1000);
>
> // ✅ Fix: useRef or functional update
> const stateRef = useRef(state);
> stateRef.current = state;
> setTimeout(() => console.log(stateRef.current), 1000);
> ```

---

### `useEffect`

```tsx
useEffect(() => {
  // side effect (data, subscriptions, DOM)
  return () => {
    /* cleanup */
  };
}, [deps]);
```

#### 🧠 Mental Model: “Synchronize with external systems”

Not “run after render” — but _“when X changes, sync Y”_.

| deps                  | When runs    | Use Case                                         |
| --------------------- | ------------ | ------------------------------------------------ |
| `[]`                  | Mount only   | `addEventListener`, `fetch` (if no dynamic deps) |
| `[a]`                 | `a` changes  | Sync `document.title`, `localStorage`            |
| `undefined` (no deps) | Every render | Rare — e.g., logging render count                |

#### ✅ Best Practices:

- **Split effects by concern** (don’t cram data + title + analytics in one `useEffect`)
- **Clean up subscriptions** (`addEventListener`/`removeEventListener`, `setTimeout`/`clearTimeout`)
- Avoid `useEffect` for:
  - Data fetching (→ use Server Components or TanStack Query)
  - State derivation (→ compute directly)
  - Business logic (→ move to event handler)

> 📚 Read: [You Might Not Need an Effect (React Docs)](https://react.dev/learn/you-might-not-need-an-effect)

---

### `useContext`

```tsx
const value = useContext(MyContext);
```

- Only re-renders when `value` reference changes (→ memoize provider value!)
- See [`context.md`](./context.md) for anti-patterns and RSC limitations.

---

### `useReducer`

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- Prefer over `useState` for:
  - Complex state logic (multi-step, dependent fields)
  - State that’s updated from many places
  - Predictable debugging (action types)
- Pattern for state machines (e.g., `idle → loading → success/error`)

---

### `useCallback` & `useMemo` — Use Sparingly

| Hook                    | Purpose                        | When to Use                                     |
| ----------------------- | ------------------------------ | ----------------------------------------------- |
| `useCallback(fn, deps)` | Memoize **function reference** | Passing to memoized child (`React.memo`)        |
| `useMemo(fn, deps)`     | Memoize **value**              | Expensive computation (e.g., sorting 10k items) |

#### ❌ Overuse Anti-Pattern:

```tsx
// ❌ Unnecessary — primitive values don’t need memo
const handleClick = useCallback(() => {}, []);
const name = useMemo(() => `${first} ${last}`, [first, last]);
```

#### ✅ Worthwhile:

```tsx
// ✅ Prevents re-renders in <ExpensiveList items={filtered} />
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
const handleSelect = useCallback((id) => setSelected(id), []); // stable setter
```

> 📊 **Rule**: Profile first (React DevTools → Highlight Updates). 90% of apps don’t need manual memoization.

---

### `useRef`

```tsx
const ref = useRef(initialValue);
```

- **Two uses**:
  1. Access DOM nodes (`<input ref={inputRef} />`)
  2. Store mutable values _without_ triggering re-renders (like `this` in classes)
- `ref.current` is **mutable** and **persists across renders**.

> ⚠️ Gotcha: Mutating `ref.current` doesn’t re-render — use only for:
>
> - Timers, intervals
> - Previous state (`usePrevious`)
> - Imperative handles (`useImperativeHandle`)

---

## 🚀 Advanced Hooks (React 18/19)

### `useTransition`

```tsx
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setSearchQuery(input);
});
```

- Mark non-urgent updates (e.g., search filtering) to avoid blocking UI
- Shows pending state: `isPending ? <Spinner /> : <Results />`

---

### `useDeferredValue`

```tsx
const deferredQuery = useDeferredValue(query);
// Use `deferredQuery` for expensive renders (e.g., list filtering)
```

- Defers re-rendering a part of the UI
- Better UX than `useTransition` for input-driven updates

---

### `useSyncExternalStore` (v18+)

For integrating with **external stores** (Redux, Zustand v4+, etc.):

```tsx
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

- Fixes tearing issues in concurrent mode
- Required for SSR compatibility with external state

---

### `useInsertionEffect` (v18+)

```tsx
useInsertionEffect(() => {
  // inject CSS-in-JS styles (e.g., Emotion, styled-components)
}, []);
```

- Runs **before** DOM mutations — for libraries only
- ❗ Never use in app code

---

## 🌐 Hooks in React Server Components (RSC)

### ⚠️ Critical:

> **Hooks do NOT work in Server Components.**  
> Only `use` (for async) is allowed — and only in Server Components.

### ✅ Allowed in Server Components:

- `use` (React 18+):
  ```tsx
  // app/page.tsx (Server Component)
  import { use } from 'react';
  async function getData() { await fetch(...); }
  const data = use(getData()); // ✅
  ```

### ❌ Forbidden in Server Components:

- `useState`, `useEffect`, `useContext`, etc.
- Any hook requiring browser APIs (`window`, `document`)

### ✅ Solution:

- Move interactive logic to **Client Components** (`'use client'`)
- Pass data from Server → Client via **props** or **Server Actions**

---

## 🛠️ Custom Hooks: Patterns & Pitfalls

### ✅ Good Custom Hook

```tsx
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set localStorage ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}
```

#### ✅ Characteristics:

- Name starts with `use`
- Composable (can call other hooks)
- No JSX — pure logic
- Handles errors gracefully
- Testable (no side effects in main logic)

---

### 🚫 Anti-Patterns

| Pattern                             | Why Bad                                            |
| ----------------------------------- | -------------------------------------------------- |
| **Hook returns JSX**                | Breaks separation of concerns — hooks ≠ components |
| **Hook takes JSX as arg**           | Over-engineered — prefer compound components       |
| **Hook with heavy side effects**    | Hard to test/debug — isolate I/O                   |
| **Hook with global state mutation** | Breaks predictability — prefer Zustand/Jotai       |

---

## 🔄 Migration: Class Lifecycles → Hooks

| Class Method            | Hook Equivalent                   | Notes                                     |
| ----------------------- | --------------------------------- | ----------------------------------------- |
| `constructor`           | `useState` lazy init              | `useState(() => new ExpensiveObject())`   |
| `componentDidMount`     | `useEffect(fn, [])`               | But ask: _“Should this be an effect?”_    |
| `componentDidUpdate`    | `useEffect(fn, [dep])`            | Runs after _every_ render with dep change |
| `componentWillUnmount`  | `useEffect(() => fn, [])` cleanup | Return cleanup function                   |
| `shouldComponentUpdate` | `React.memo`                      | Wrap component, not in hook               |

> ⚠️ `useEffect` runs **after paint** — not synchronously like `componentDidMount`.

---

## 🧪 Testing Hooks

Use [`@testing-library/react-hooks`](https://react-hooks-testing-library.com):

```tsx
import { renderHook, act } from "@testing-library/react-hooks";
import { useCounter } from "./useCounter";

test("increments counter", () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

✅ Test:

- Initial state
- State transitions (`act` for updates)
- Side effects (mock `fetch`, timers)
- Cleanup (e.g., interval cleared)

---

## 📚 Recommended Reading

- [React Docs: Hooks Reference](https://react.dev/reference/react)
- [Rules of Hooks (React Docs)](https://react.dev/reference/rules/rules-of-hooks)
- [A Complete Guide to useEffect (Dan Abramov)](https://overreacted.io/a-complete-guide-to-useeffect/)
- [React 18 New Hooks (React Blog)](https://react.dev/blog/2022/03/29/react-v18)
- [Testing Library: Hooks Guide](https://react-hooks-testing-library.com)

---

> 💡 **Final Thought**:  
> _“Hooks aren’t about replacing classes — they’re about thinking in closures, effects, and data flow. Master that, and React becomes intuitive.”_  
> — Adapted from Dan Abramov
```
