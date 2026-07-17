
# 🧠 `context.md`

_Understanding `useContext` — power, pitfalls, and modern best practices._

> 📌 **TL;DR**:
>
> - Context is for **low-frequency, truly global state** (theme, auth, locale).
> - **Avoid Context for high-frequency updates** (form inputs, real-time counters).
> - Prefer **colocation** → Context → Zustand / Jotai → Redux (in that order).
> - In RSC world: **Server Context ≠ Client Context**. Pass data via props or cookies, not Context.

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

✅ **Ideal for**: Theme, authenticated user, locale, feature flags, or any data that changes rarely and is needed in many places.

---

## 🚫 When _Not_ to Use Context (Critical!)

### ❌ Anti-Pattern 1: High-Frequency Updates

Context re-renders **every consumer** when the value changes — even if they only use a small portion.

```tsx
// ❌ BAD: Cart state in Context → every cart update re-renders *entire app*
const CartContext = createContext({ items: [], addItem: () => {} });

// ✅ BETTER: Zustand (only components reading `items` re-render)
const useCart = create<{
  items: Item[];
  addItem: (item: Item) => void;
}>(() => ({ items: [], addItem: /* ... */ }));
```

### ❌ Anti-Pattern 2: Replacing Simple Props

If data travels only 1–2 levels, **just pass props**. Context adds unnecessary indirection and harms readability.

### ❌ Anti-Pattern 3: Putting Derived Data in Context

Never store `filteredItems`, `isLoading`, or `error` inside Context. Derive them locally in the consuming component.

### ❌ Anti-Pattern 4: One Giant Context

Avoid a single “app state” context. Split by concern (theme, auth, cart) to minimize re-renders.

---

## 🧩 Advanced Patterns

### 1. Compound Provider Wrapper

Clean up provider nesting with a single composable component:

```tsx
// providers/AppProviders.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### 2. Split Contexts (Read / Write Separation)

Prevent re-renders by separating state from its setter.

```tsx
const ThemeStateContext = createContext<"light" | "dark">("light");
const ThemeDispatchContext = createContext<(t: "light" | "dark") => void>(
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

// Consumers import only what they need
export function useTheme() {
  return useContext(ThemeStateContext);
}

export function useSetTheme() {
  return useContext(ThemeDispatchContext);
}
```

> ✅ A component that only calls `useSetTheme()` never re-renders when the theme changes.

### 3. Context + `useReducer`

For more complex global state (e.g., multi-step wizards), combine Context with `useReducer`.

```tsx
type Action = { type: "NEXT_STEP" } | { type: "PREV_STEP" };
const WizardDispatchContext = createContext<Dispatch<Action>>(() => {});

export function useWizardDispatch() {
  return useContext(WizardDispatchContext);
}
```

---

## ⚠️ Context + Server Components (RSC) — Key Landmines

### Context **cannot cross** the Server → Client boundary.

- ✅ Server Components can create and consume server-only Context.
- ✅ Client Components can create and consume client-only Context.
- ❌ **A Server Component cannot provide a value to a Client Component via Context.**

```tsx
// ❌ THIS DOES NOT WORK
// app/layout.tsx (Server Component)
export default function RootLayout({ children }) {
  return (
    <UserContext.Provider value={{ name: "Alice" }}>
      {children} {/* includes Client Components */}
    </UserContext.Provider>
  );
}
// Client component will see `undefined`.
```

### ✅ Correct Approaches

| Approach                         | When                                                      |
| -------------------------------- | --------------------------------------------------------- |
| **Pass data via props**          | Small, serializable values (`userId`, `theme`)            |
| **Store in cookies / headers**   | Server writes, Client reads via `cookies()` / `headers()` |
| **Hydrate client state**         | Server embeds data in a `<script>` tag, client picks up   |
| **Server Actions + revalidation**| Mutations happen on server; client re-fetches             |

Example: passing theme from server to client using cookies.

```tsx
// app/layout.tsx (Server)
import { cookies } from "next/headers";

export default function RootLayout({ children }) {
  const theme = cookies().get("theme")?.value || "light";
  return (
    <html className={theme}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🆚 Context vs. Alternatives (Modern Stack)

| Tool                | Best For                                    | Watch Out For                                      |
| ------------------- | ------------------------------------------- | -------------------------------------------------- |
| **React Context**   | Truly global, low-frequency state           | Re-renders all consumers on change                 |
| **Zustand**         | Medium/large apps, UI state (cart, filters) | Not for server-cached data                         |
| **Jotai**           | Fine-grained, atom-based reactivity         | Slightly different mental model                    |
| **TanStack Query**  | **Server-cached data** (posts, user list)   | Never put server data in Context!                  |
| **Server Components**| Static data, direct DB access              | No client interactivity                            |

> ✅ **Golden Rule**:
> *“If it comes from an API → TanStack Query.  
> If it’s UI state shared across routes → Zustand.  
> If it changes rarely and is truly global (theme, auth) → Context.”*

---

## 🛠️ Performance Tips

1. **Memoize the value** (especially if it contains objects):
   ```tsx
   <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
   ```
2. **Split contexts** into state + dispatch (as shown above).
3. **Avoid object literals** inside the value; prefer primitives or memoized references.
4. **Profile with React DevTools** – enable “Highlight updates when components render” to spot over-renders.

---

## 🧪 Testing Components that Consume Context

Wrap the component with the required provider(s) in tests.

```tsx
// test-utils.tsx
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AppProviders>
      {ui}
    </AppProviders>
  );
}

// MyComponent.test.tsx
test("displays user name", () => {
  renderWithProviders(<UserProfile />);
  // assertions...
});
```

For isolated tests, provide a custom mock value:

```tsx
render(
  <UserContext.Provider value={mockUser}>
    <UserProfile />
  </UserContext.Provider>
);
```

---

## 📚 Recommended Reading

- [React Docs: useContext](https://react.dev/reference/react/useContext)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [You Might Not Need Context (React Docs)](https://react.dev/learn/passing-data-deeply-with-context#when-to-use-context)
- [How to Optimize Context Re-renders](https://react.dev/learn/passing-data-deeply-with-context#how-to-optimize-context-re-renders)
- [Next.js: Server & Client Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

> 💡 **Final Thought**:  
> *“Context is a distribution mechanism, not a state management tool. Use it to avoid prop drilling, not to manage complexity. The simpler your state, the less you need Context.”*
```
