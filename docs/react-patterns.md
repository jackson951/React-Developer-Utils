# 🧩 React Patterns

_Battle-tested patterns for modern React (v18–v19), Server Components, and real-world apps._

> 🎯 **Prerequisites**: Hooks, JSX, basic TypeScript  
> 📦 **All examples in TypeScript**, RSC-ready where applicable  
> 🔥 Inspired by Meta, Shopify, Vercel, and OSS best practices

---

## 📚 Table of Contents

1. [Component Composition Patterns](#1-component-composition-patterns)
   - Compound Components
   - Render Props → Custom Hooks
   - Children as Functions (Function-as-Child)
2. [State & Data Flow](#2-state--data-flow-patterns)
   - State Colocation
   - Lifting State Up (and When _Not_ To)
   - Controlled vs Uncontrolled
   - State Machines (`useReducer` + guards)
3. [Logic Reuse](#3-logic-reuse-patterns)
   - Custom Hooks
   - Higher-Order Components (HOCs) — _Legacy but still useful_
   - Render Props — _Mostly deprecated in favor of hooks_
4. [Performance Patterns](#4-performance-patterns)
   - `React.memo`, `useCallback`, `useMemo` (with caution)
   - Virtualization
   - Code Splitting (`lazy`, `Suspense`)
5. [Server-Client Patterns (RSC Era)](#5-server-client-patterns-rsc-era)
   - Server Components + Client Components
   - Server Actions & `useActionState`
   - `useOptimistic` for UX polish
6. [Advanced Architecture](#6-advanced-architecture-patterns)
   - Provider-Free State (Zustand, Jotai)
   - Feature-Sliced Design
   - Module Boundaries & Barrel Files
7. [Anti-Patterns to Avoid](#7-anti-patterns-to-avoid)
   - Over-memoization
   - `useEffect` for everything
   - Prop drilling (and how to escape it)

---

## 1. Component Composition Patterns

### ✅ Compound Components

**When to use**: For cohesive UI groups where internal components need implicit context (e.g., `<Tabs>`, `<Accordion>`).

**Why**: Avoid prop drilling, enforce usage structure, enable flexible ordering.

```tsx
// Tabs.tsx
import { createContext, useContext, useState } from "react";

type TabsContextType = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

export function Tab({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used inside Tabs");
  const { activeIndex, setActiveIndex } = ctx;
  return (
    <button
      className={activeIndex === index ? "active" : ""}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
}

export function TabPanels({ children }: { children: React.ReactNode }) {
  return <div className="tab-panels">{children}</div>;
}

export function TabPanel({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabPanel must be used inside Tabs");
  return ctx.activeIndex === index ? <div>{children}</div> : null;
}
```

**Usage**:

```tsx
<Tabs>
  <TabList>
    <Tab index={0}>Profile</Tab>
    <Tab index={1}>Settings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel index={0}>
      <ProfileForm />
    </TabPanel>
    <TabPanel index={1}>
      <SettingsForm />
    </TabPanel>
  </TabPanels>
</Tabs>
```

✅ **Pros**: Encapsulation, self-documenting API, no prop drilling  
⚠️ **Cons**: Harder to statically analyze; avoid overuse

---

### 🔄 Render Props → Custom Hooks (Migration Path)

Render Props are mostly obsolete since hooks, but useful for _composing behavior with JSX_ (e.g., animations).

**Old (Render Prop)**:

```tsx
<DataFetcher url="/api/user">
  {({ data, loading, error }) => (
    <div>
      {loading && <Spinner />}
      {error && <Error />}
      {data && <UserCard user={data} />}
    </div>
  )}
</DataFetcher>
```

**✅ Modern (Custom Hook)**:

```tsx
// useData.ts
export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

**Usage**:

```tsx
function UserProfile() {
  const { data, loading, error } = useData<User>("/api/user");
  // same JSX as above
}
```

✅ **Verdict**: Prefer hooks — more composable, testable, and reusable.

---

### 🧩 Children as Functions (Function-as-Child)

**When**: When you need dynamic rendering _inside_ a component with access to internal state (e.g., `<Countdown>`).

```tsx
type CountdownProps = {
  seconds: number;
  children: (state: {
    timeLeft: number;
    isExpired: boolean;
  }) => React.ReactNode;
};

export function Countdown({ seconds, children }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  return <>{children({ timeLeft, isExpired: timeLeft <= 0 })}</>;
}
```

**Usage**:

```tsx
<Countdown seconds={10}>
  {({ timeLeft, isExpired }) =>
    isExpired ? <button>Resend</button> : <span>Resend in {timeLeft}s</span>
  }
</Countdown>
```

⚠️ **Use sparingly**: Only when `children` needs _runtime access_ to component state. Prefer props or hooks where possible.

---

## 2. State & Data Flow Patterns

### 🔗 State Colocation

**Principle**: Keep state as close as possible to where it’s used.

❌ **Bad** (lifted too high):

```tsx
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // used only in Sidebar
  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Main />
    </>
  );
}
```

✅ **Good** (colocated):

```tsx
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>☰</button>
      {isOpen && (
        <aside>
          <button onClick={() => setIsOpen(false)}>✕</button>
          {/* content */}
        </aside>
      )}
    </>
  );
}
```

✅ **Exception**: When multiple components need the _same_ state (e.g., theme, auth), lift to context or global store.

---

### 🔁 Controlled vs Uncontrolled Components

|              | Controlled                                                         | Uncontrolled                                     |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------ |
| **State**    | React owns value (`value={state}` + `onChange`)                    | DOM owns value (`defaultValue`, `ref`)           |
| **Use Case** | Forms needing validation, sync, or reset                           | Simple inputs, file uploads, legacy integrations |
| **Example**  | `<input value={email} onChange={e => setEmail(e.target.value)} />` | `<input defaultValue="jane" ref={inputRef} />`   |

✅ **Best Practice**:

- Use **controlled** for most forms (better predictability)
- Use **uncontrolled** for:
  - `<input type="file">` (value is read-only)
  - Performance-critical forms (e.g., 1000+ inputs)
  - Integrating non-React libraries

> 💡 Bonus: `react-hook-form` uses _uncontrolled by default_ for performance, but supports controlled mode.

---

### 🧠 State Machines with `useReducer`

**When**: Multi-step workflows, complex state transitions (e.g., onboarding, checkout).

```tsx
type State = {
  step: "idle" | "loading" | "success" | "error";
  data?: User;
  error?: string;
};
type Action =
  | { type: "FETCH" }
  | { type: "RESOLVE"; payload: User }
  | { type: "REJECT"; payload: string };

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH":
      return { ...state, step: "loading" };
    case "RESOLVE":
      return { step: "success", data: action.payload };
    case "REJECT":
      return { step: "error", error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

export function UserFetcher() {
  const [state, dispatch] = useReducer(userReducer, { step: "idle" });

  const fetchUser = async () => {
    dispatch({ type: "FETCH" });
    try {
      const user = await api.getUser();
      dispatch({ type: "RESOLVE", payload: user });
    } catch (err) {
      dispatch({ type: "REJECT", payload: err.message });
    }
  };

  // render based on state.step
}
```

✅ **Pros**: Predictable transitions, easy to test, avoids `useState` spaghetti  
📚 **Go further**: Use [`xstate`](https://xstate.js.org) for visual statecharts.

---

## 3. Logic Reuse Patterns

### 🎣 Custom Hooks (✅ Preferred)

**Rules**:

- Name starts with `use`
- Can call other hooks
- Don’t call conditionally
- Return values (not JSX)

**Example: `useLocalStorage`**

```tsx
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
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

**Usage**:

```tsx
const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
```

✅ **When to extract**:

- Logic used in ≥2 components
- Complex side effects (e.g., `useDebounce`, `usePrevious`)
- Business rules (e.g., `useAuth`, `useCart`)

---

### 🧱 Higher-Order Components (HOCs) — _Legacy but Valid_

**When**: Adding cross-cutting concerns to class components _or_ when hooks aren’t feasible (e.g., SSR wrappers).

```tsx
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user } = useAuth(); // assuming useAuth exists
    if (!user) return <Redirect to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

// Usage
const Dashboard = withAuth(DashboardInner);
```

⚠️ **Avoid if possible**: Hooks are simpler and more composable.  
✅ **Still useful for**:

- Adding `displayName` debug info
- SSR data wrappers (e.g., `withData`)
- Legacy class component upgrades

---

## 4. Performance Patterns

### ⚖️ `useCallback` & `useMemo` — Use Judiciously

**Rule of thumb**:

- **Don’t memoize by default**
- **Do memoize** when:
  - Passing functions/objects to _memoized children_
  - Expensive computations (e.g., sorting 10k items)
  - Dependency arrays are stable (avoid `[]` unless truly constant)

❌ **Over-memoization**:

```tsx
// ❌ Unnecessary — primitive props don’t need memo
const handleClick = useCallback(() => {
  console.log("click");
}, []);
```

✅ **Worthwhile**:

```tsx
// ✅ Prevents re-renders in <ExpensiveList />
const filteredItems = useMemo(
  () => items.filter((item) => item.category === selectedCategory),
  [items, selectedCategory]
);

const handleSelect = useCallback(
  (id: string) => setSelected(id),
  [setSelected] // stable setter
);
```

> 📊 **Measure first**: Use React DevTools profiler. 90% of apps don’t need manual memoization.

---

### 🧱 Virtualization

**When**: Long lists (>50 items), tables, feeds.

**Libraries**:

- [`@tanstack/react-virtual`](https://tanstack.com/virtual) (lightweight, hooks-based)
- [`react-window`](https://react-window.vercel.app) (lower-level)

**Example**:

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto" }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

✅ **Impact**: Reduces DOM nodes from 10,000 → ~20 → massive perf gain.

---

### 🧩 Code Splitting

**Component-level lazy loading**:

```tsx
const Chart = lazy(() => import("./Chart"));

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <Chart />
    </Suspense>
  );
}
```

**Route-level (Next.js App Router)**:

```tsx
// app/dashboard/page.tsx → automatically code-split!
```

**Data + UI streaming (RSC)**:

```tsx
// app/page.tsx
export default async function Page() {
  return (
    <div>
      <NavBar />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts /> {/* Loads independently */}
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar /> {/* Streams in parallel */}
      </Suspense>
    </div>
  );
}
```

✅ **Best for**: Heavy charts, admin panels, non-critical UI.

---

## 5. Server-Client Patterns (RSC Era)

### 🌐 Server Components + Client Components

**Rule**:

- **Server Components (default)**: Data fetching, heavy logic, secrets
- **Client Components (`'use client'`)**: Interactivity, hooks, browser APIs

```tsx
// app/profile/page.tsx (Server Component)
import { getUser } from "@/lib/data";
import UserHeader from "./UserHeader"; // Server
import UserActions from "./UserActions"; // Client → has 'use client'

export default async function ProfilePage() {
  const user = await getUser(); // ✅ Safe — runs on server
  return (
    <div>
      <UserHeader user={user} /> {/* No interactivity → Server */}
      <UserActions userId={user.id} /> {/* Needs useState → Client */}
    </div>
  );
}
```

```tsx
// UserActions.tsx
"use client"; // ← Required

export default function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  // ...
}
```

✅ **Benefits**:

- Zero client JS for static content
- Direct database access (no API layer needed)
- Streaming HTML

---

### ⚡ Server Actions & `useActionState`

**Replace `fetch` + `useEffect`** for mutations.

```tsx
// actions.ts
"use server";

export async function followUser(prevState: boolean, formData: FormData) {
  const userId = formData.get("userId") as string;
  try {
    await db.follow(userId);
    return true;
  } catch {
    return false;
  }
}
```

```tsx
// Client Component
"use client";

export default function FollowButton({ userId }: { userId: string }) {
  const [isFollowing, formAction] = useActionState(followUser, false);

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <button type="submit">{isFollowing ? "✓ Following" : "Follow"}</button>
    </form>
  );
}
```

✅ **Why better**:

- No `useEffect`/`fetch` boilerplate
- Automatic pending states
- Built-in progressive enhancement
- Works with JS disabled (full HTML form fallback)

---

### 🎯 `useOptimistic` for UX Polish

**Show instant feedback before server confirms**.

```tsx
"use client";

export default function Comments({
  initialComments,
}: {
  initialComments: Comment[];
}) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: Comment) => [
      ...state,
      { ...newComment, id: "temp-" + Date.now() },
    ]
  );

  const addComment = useActionState(async (prevState, formData: FormData) => {
    const text = formData.get("text") as string;
    addOptimisticComment({ id: "", text, author: "You" });
    const saved = await saveComment(text); // server action
    return [...prevState, saved];
  }, initialComments);

  return (
    <div>
      {optimisticComments.map((c) => (
        <Comment key={c.id} comment={c} />
      ))}
      <form action={addComment}>
        <input name="text" />
        <button>Post</button>
      </form>
    </div>
  );
}
```

✅ **Result**: User sees comment _immediately_, even if network is slow.

---

## 6. Advanced Architecture Patterns

### 🗃️ Provider-Free State Management

**Avoid deep `Context.Provider` trees**. Prefer:

- **Zustand** (global UI state):

  ```ts
  // stores/useCart.ts
  import { create } from "zustand";

  type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
  };

  export const useCart = create<CartState>()((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    removeItem: (id) =>
      set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  }));
  ```

- **Jotai** (atomic, React-idiomatic):
  ```ts
  const countAtom = atom(0);
  const doubleCountAtom = atom((get) => get(countAtom) * 2);
  ```

✅ **When to use**:

- Zustand: Large apps, complex state, middleware (persist, immer)
- Jotai: Simpler apps, fine-grained reactivity
- **Never** for server-cached data — use **TanStack Query**

---

### 🧱 Feature-Sliced Design (FSD)

**Structure by feature, not type**:

```
src/
├── features/
│   ├── cart/
│   │   ├── ui/          → CartButton, CartModal
│   │   ├── model/       → useCart.ts, types.ts
│   │   └── index.ts     → public API
│   └── auth/
├── entities/            → Reusable domain objects (User, Product)
├── shared/              → UI kit, lib, config
└── pages/               → Route compositions
```

✅ **Benefits**:

- Easy to delete features
- Clear ownership
- Scalable across teams

> 🔗 Inspired by [Feature-Sliced Design](https://feature-sliced.design)

---

### 📦 Module Boundaries & Barrel Files

**Enforce clean APIs**:

```ts
// features/cart/index.ts
export { CartButton } from "./ui/CartButton";
export { useCart } from "./model/useCart";
// ❌ Never export internals: export * from './lib/helpers';
```

✅ **Tools**:

- `eslint-plugin-boundaries`
- TypeScript `paths` + `tsconfig.json`

---

## 7. Anti-Patterns to Avoid

### 🚫 Overusing `useEffect`

**Classic anti-patterns**:

- `useEffect` for data fetching → **Use Server Components or TanStack Query**
- `useEffect` for syncing state → **Derive state instead**
- `useEffect` for business logic → **Move to event handlers or custom hooks**

✅ **Better**:

```tsx
// ❌ useEffect for derived state
useEffect(() => {
  setName(firstName + " " + lastName);
}, [firstName, lastName]);

// ✅ Just compute it
const name = `${firstName} ${lastName}`;
```

> 📚 Read: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

### 🚫 Prop Drilling (and How to Escape It)

**Symptoms**: Passing props through 3+ components.

**Solutions**:
| Pattern | When |
|--------|------|
| **Context** | For _truly global_ state (theme, auth) |
| **State colocation** | Keep state closer to usage |
| **Compound components** | For grouped UI (Tabs, Modals) |
| **Zustand/Jotai** | For cross-feature state (cart, filters) |

⚠️ **Avoid**: Creating a context for _every_ state — leads to over-re-renders.

---

### 🚫 Stale Closures in `useEffect`/`setInterval`

**Bug**:

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // Always 0!
  }, 1000);
  return () => clearInterval(id);
}, []); // ← missing `count`
```

✅ **Fixes**:

- Add deps + cleanup
- Use ref to track latest value
- Prefer `useEffectEvent` (React 18+) or `setInterval`-aware hooks like `useInterval`

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // ✅ up-to-date
  }, 1000);
  return () => clearInterval(id);
}, []);
```

---

## 📎 Appendix: Quick Reference Table

| Pattern                 | Best For                       | React 19 Ready?   |
| ----------------------- | ------------------------------ | ----------------- |
| **Compound Components** | Coordinated UI groups          | ✅                |
| **Custom Hooks**        | Logic reuse                    | ✅                |
| **State Colocation**    | Simplicity                     | ✅                |
| **Server Actions**      | Mutations                      | ✅ (v19 core)     |
| **`useOptimistic`**     | UX polish                      | ✅ (v19)          |
| **Zustand**             | Global state                   | ✅                |
| **RSC + Streaming**     | Performance                    | ✅                |
| **Render Props**        | Legacy/JSX composition         | ⚠️ Rarely         |
| **HOCs**                | Class components, SSR wrappers | ⚠️ Avoid new code |

---

## 📚 Recommended Reading

- [React Patterns (reactpatterns.com)](https://reactpatterns.com) — Classic, still relevant
- [React Docs: Thinking in React](https://react.dev/learn/thinking-in-react)
- [Advanced React Component Patterns (Kent C. Dodds)](https://epicreact.dev/modules/advanced-react-patterns)
- [React Server Components Deep Dive (React Docs)](https://react.dev/learn/server-components)
- [useHooks.com](https://usehooks.com) — Practical custom hooks

---

> “Patterns are not prescriptions. They’re distilled experience. Adapt them — don’t idolize them.”  
> — _Adapted from Martin Fowler_
```
