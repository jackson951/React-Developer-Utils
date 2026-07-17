# 🌀 `suspense.md`

_Suspense in React: Beyond the Loading Spinner_

> 📌 **TL;DR**:
>
> - `Suspense` is **not a loading state manager** — it’s a _contract_ for components to signal “I’m not ready yet.”
> - Only works with **asynchronous work** that throws a _promise_ (data fetching, code splitting, images).
> - In RSC world: Enables **streaming HTML**, **selective hydration**, and **progressive UI**.
> - ⚠️ Does **not catch JavaScript errors** — pair with `ErrorBoundary`.

---

## 🔍 What Is Suspense?

`<Suspense>` lets you declaratively specify a loading state (fallback) while waiting for **asynchronous work** to complete in its subtree.

```tsx
<Suspense fallback={<Spinner />}>
  <ProfileDetails /> {/* May suspend */}
</Suspense>
```

### ✅ What Suspense Catches

| Source                          | How It Suspends                                             |
| ------------------------------- | ----------------------------------------------------------- |
| **React.lazy** (code splitting) | `import()` returns promise                                  |
| **Async Server Components**     | `await fetch(...)` or `use(promise)`                        |
| **Third-party integrations**    | Libraries like Relay, TanStack Query v5 (`.suspense(true)`) |

### ❌ What Suspense Does **NOT** Catch

- JavaScript runtime errors → use `ErrorBoundary`
- `useEffect` side effects
- `setTimeout`, `Promise.then` in event handlers
- Client-side data fetching _without_ `throw promise` pattern

> 📚 From [React Docs](https://react.dev/reference/react/Suspense):  
> _“Suspense is not a data fetching library. It’s a mechanism for components to communicate ‘I’m not ready yet.’”_

---

## 🧩 Core Patterns

### 1. **Code Splitting (Client Components)**

```tsx
// ✅ Lazy-load heavy components
const Chart = lazy(() => import("./Chart"));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton height={300} />}>
      <Chart />
    </Suspense>
  );
}
```

> ✅ Best for: Charts, maps, admin panels, non-critical UI.

---

### 2. **Streaming Server Components (Next.js App Router)**

```tsx
// app/page.tsx (Server Component)
export default function Page() {
  return (
    <div>
      <NavBar /> {/* Sent immediately */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts /> {/* Suspends until data loads */}
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar /> {/* Streams in parallel */}
      </Suspense>
    </div>
  );
}
```

✅ **How it works**:

1. Server sends `<NavBar>` + `<PostsSkeleton>` + `<SidebarSkeleton>`
2. As `<Posts>` data resolves → streams in HTML
3. As `<Sidebar>` resolves → streams in
4. Client hydrates _selectively_ (not all at once)

📊 **Result**:

- Faster **Time to First Byte (TTFB)**
- Lower **LCP** (content appears progressively)
- Better UX on slow networks

---

### 3. **Nested Suspense Boundaries**

Structure fallbacks by priority:

```tsx
<Suspense fallback={<FullPageSpinner />}>
  <MainLayout>
    <Suspense fallback={<HeaderSkeleton />}>
      <Header />
    </Suspense>
    <Suspense fallback={<ContentSkeleton />}>
      <MainContent />
    </Suspense>
  </MainLayout>
</Suspense>
```

✅ **Strategy**:

- Outer: Full-page fallback (rare — only for critical failures)
- Inner: Granular, contextual skeletons (recommended)

---

### 4. **Transitions + Suspense (Smooth UX)**

Prevent UI from feeling “janky” during navigation/search:

```tsx
"use client";

export default function Search() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      // This may trigger a Suspense boundary
      setSearchResults(value);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner size="sm" />}
      <Suspense fallback={<ResultsSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
```

✅ **Why better**:

- Input stays responsive (no blocked main thread)
- User sees `isPending` indicator _before_ fallback shows
- Avoids “flash of spinner” on fast networks

---

## ⚠️ Advanced Gotchas & Fixes

### ❗ Stale Promises (Race Conditions)

If multiple async operations compete (e.g., typing fast in search), later results can overwrite earlier ones.

✅ **Fix**: AbortController + `use` (React 18+)

```tsx
// In Server Component or `use` wrapper
async function search(query: string, signal: AbortSignal) {
  const res = await fetch(`/api/search?q=${query}`, { signal });
  return res.json();
}

// Client Component
useEffect(() => {
  const controller = new AbortController();
  search(query, controller.signal).then(setResults);
  return () => controller.abort();
}, [query]);
```

✅ **Better**: Use **TanStack Query v5** with `suspense: true` + `staleTime`.

---

### ❗ Hydration Mismatches

Server renders `<Suspense fallback={...}>`, but client tries to hydrate `<RealComponent>` → mismatch warning.

✅ **Fix**:

- Ensure Server and Client agree on _what_ suspends
- Never conditionally suspend (e.g., `if (client) fetch()`)
- Use `use` only in Server Components or `useEffect` in Client

> 📚 Read: [React Docs: Troubleshooting Suspense](https://react.dev/reference/react/Suspense#fixing-missing-suspense-boundaries)

---

### ❗ Fallbacks Too Aggressive

Default 500ms delay before showing fallback can feel sluggish.

✅ **Override globally** (Next.js):

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Suspense fallback={<Spinner />} delayMs={200}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
```

Or per-boundary:

```tsx
<Suspense fallback={<Spinner />} unstable_avoidThisFallback={true}>
  <SlowComponent />
</Suspense>
```

> ⚠️ `unstable_avoidThisFallback` may be renamed in future React versions — use sparingly.

---

## 🌐 Suspense + Server Actions (React 19+)

Server Actions can _also_ suspend — and `useOptimistic` pairs beautifully:

```tsx
"use client";

export default function Comments({ initialComments }) {
  const [optimistic, addOptimistic] = useOptimistic(
    initialComments,
    (state, comment) => [...state, { ...comment, id: "temp-" + Date.now() }]
  );

  const addComment = useActionState(async (prev, formData) => {
    const text = formData.get("text");
    addOptimistic({ text, author: "You" }); // ✅ Instant optimistic update
    const saved = await saveComment(text); // ⏳ Suspends until server responds
    return [...prev, saved];
  }, initialComments);

  return (
    <div>
      {optimistic.map((c) => (
        <Comment key={c.id} comment={c} />
      ))}
      <form action={addComment}>
        <input name="text" />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
```

✅ **Flow**:

1. User clicks “Post”
2. `addOptimistic` → immediate UI update
3. Form submits → `saveComment` runs on server
4. If server suspends (e.g., DB slow), fallback shows
5. On success, `useActionState` updates with real data

---

## 🆚 Suspense vs Alternatives

| Pattern                       | When to Use                               | Limitations                     |
| ----------------------------- | ----------------------------------------- | ------------------------------- |
| `<Suspense>`                  | Data/code splitting in RSC or Relay/TQ v5 | Only works with `throw promise` |
| `useState` + `useEffect`      | Simple client-side fetching               | No SSR, waterfall requests      |
| TanStack Query (non-suspense) | Most apps (simpler, more control)         | Manual loading states           |
| `useTransition`               | Non-urgent UI updates (search, filters)   | Doesn’t replace data loading    |

> ✅ **Modern Recommendation**:
>
> - For **Next.js App Router**: Embrace Suspense + RSC streaming
> - For **Vite/SPA**: Use TanStack Query + `useTransition` — avoid manual Suspense

---

## 📚 Recommended Reading

- [React Docs: Suspense](https://react.dev/reference/react/Suspense)
- [React 18 Suspense Guide (Dan Abramov)](https://github.com/reactwg/react-18/discussions/132)
- [Next.js: Streaming with Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [TanStack Query v5 + Suspense](https://tanstack.com/query/v5/docs/react/guides/suspense)

---

> 💡 **Final Thought**:  
> _“Suspense isn’t about hiding latency — it’s about embracing asynchrony as a first-class part of your UI architecture.”_  
> — Design for **graceful progression**, not just loading states.
```
