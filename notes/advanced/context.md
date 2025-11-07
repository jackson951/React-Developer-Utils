# 🧠 `context.md`

_Understanding `useContext` — power, pitfalls, and 2025 best practices._

> ✅ **Last Updated**: November 7, 2025  
> 📌 **TL;DR**:
>
> - Context is for **low-frequency, global state** (theme, auth, locale).
> - **Avoid Context for high-frequency state** (e.g., form inputs, UI toggles).
> - Prefer **colocation** > Context > Zustand/Jotai > Redux.
> - In RSC world: **Server Context ≠ Client Context** — tread carefully.

---

## 🔍 What Is Context?

Context provides a way to pass data through the component tree **without prop drilling**.

```tsx
// 1. Create
const ThemeContext = createContext<"light" | "dark">("light");

// 2. Provide
function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 3. Consume
function Toolbar() {
  const theme = useContext(ThemeContext); // ✅ no prop drilling
  return <div className={theme}>...</div>;
}
```

✅ **Use Case**: Theming, user auth, locale, app-wide config.

---

## 🚫 When _Not_ to Use Context (Critical!)

### ❌ Anti-Pattern: High-Frequency State

Context causes **re-renders of _all_ consumers** when value changes — even if they only use part of it.

```tsx
// ❌ BAD: Cart state in Context → every cart update re-renders *entire app*
const CartContext = createContext({ items: [], addItem: () => {} });

// ✅ BETTER: Zustand (only components using `items` re-render)
const useCart = create<{
  items: Item[];
  addItem: (item: Item) => void;
}>()(/* ... */);
```

### ❌ Anti-Pattern: Derived or Computed State

Don’t put `filteredItems`, `isLoading`, or `error` in Context — compute it locally.

### ❌ Anti-Pattern: Replacing Props

If only 1–2 levels deep, **just pass props**. Context adds indirection.

---

## 🧩 Advanced Patterns

### 1. **Compound Provider Pattern**

Avoid provider hell (`<A><B><C>...</C></B></A>`) with a single wrapper:

```tsx
// providers/AllProviders.tsx
export function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// _app.tsx (Next.js)
export default function App({ Component, pageProps }) {
  return (
    <AllProviders>
      <Component {...pageProps} />
    </AllProviders>
  );
}
```

### 2. **Split Contexts (Read/Write Separation)**

Prevent unnecessary re-renders by separating state and setters:

```tsx
// ✅ GOOD: Split context for theme
const ThemeStateContext = createContext<"light" | "dark">("light");
const ThemeDispatchContext = createContext<(theme: "light" | "dark") => void>(
  () => {}
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={setTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

// Consumer reads state *or* dispatch — not both
export function useTheme() {
  return useContext(ThemeStateContext);
}

export function useSetTheme() {
  return useContext(ThemeDispatchContext);
}
```

> ✅ Only components calling `useSetTheme()` re-render when `setTheme` changes (it’s stable).

---

## ⚠️ Context + Server Components (RSC) — Landmines!

### ❗ Context **does not cross** Server → Client boundary.

- ✅ Server Components can _create_ and _consume_ Context (server-only).
- ✅ Client Components can _create_ and _consume_ Context (client-only).
- ❌ **Server Component cannot pass value to Client Component via Context**.

```tsx
// ❌ THIS DOES NOT WORK
// app/layout.tsx (Server Component)
export default function Layout({ children }) {
  return (
    <UserContext.Provider value={{ name: "Alice" }}>
      {" "}
      {/* Server value */}
      {children}
    </UserContext.Provider>
  );
}

// app/page.tsx → includes <UserProfile /> (Client Component)
// UserProfile.tsx
("use client");
export default function UserProfile() {
  const user = useContext(UserContext); // → undefined!
}
```

### ✅ Solutions:

| Approach                             | When                                               |
| ------------------------------------ | -------------------------------------------------- |
| **Pass via props**                   | Small, serializable data (`user.id`, `theme`)      |
| **Zustand `persist`**                | Hydrate client state from server cookie/`<script>` |
| **Server Actions + `useOptimistic`** | Mutate state on server, optimistic UI on client    |
| **`next/navigation` cache**          | Cache user data via `headers().get('x-user')`      |

> 📚 Read: [Next.js: Sharing Data Between Server and Client](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-data-to-client-components)

---

## 🆚 Context vs. Alternatives (2025)

| Tool                            | Best For                                    | Caveats                                         |
| ------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| **`useContext` + `useReducer`** | Small apps, simple global state             | Re-renders all consumers on _any_ change        |
| **Zustand**                     | Medium/large apps, UI state (cart, filters) | No Provider needed; granular subscriptions      |
| **Jotai**                       | Fine-grained state, atom-based reactivity   | Lightweight, React-idiomatic                    |
| **TanStack Query**              | **Server-cached data only** (users, posts)  | Never put API data in Context!                  |
| **React Server Components**     | Data fetching + rendering on server         | Bypass client state entirely for static content |

> ✅ **Golden Rule**:  
> _“If your state comes from an API, use TanStack Query.  
> If it’s UI state used across routes, use Zustand.  
> If it’s truly global (theme/auth), use Context — sparingly.”_

---

## 🛠️ Performance Tips

1. **Memoize the value**:
   ```tsx
   <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
   ```
2. **Split contexts** (as shown above).
3. **Avoid objects in value**: Prefer primitives or memoized objects.
4. **Profile**: Use React DevTools → _Highlight updates when components render_.

---

## 📚 Recommended Reading

- [React Docs: Context](https://react.dev/reference/react/useContext)
- [You Might Not Need Context (React Docs)](https://react.dev/learn/passing-data-deeply-with-context#when-to-use-context)
- [How to Optimize React Context (Dan Abramov)](https://react.dev/learn/passing-data-deeply-with-context#how-to-optimize-context-re-renders)
- [Next.js: Context and Server Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#server-and-client-composition)

---

> 💡 **Final Thought**:  
> _“Context is a tool, not a solution. Use it to remove friction — not to hide complexity.”_  
> — Adapted from Kent C. Dodds
