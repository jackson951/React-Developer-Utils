# ⚡ `performance.md`

_React Performance: From Theory to Production_

> 📌 **TL;DR**:
>
> - **Profile before optimizing** — 80% of “perf work” is unnecessary.
> - **Bundle size**, **re-renders**, and **hydration** are the big 3 bottlenecks.
> - Leverage modern features: React Compiler (auto-memo), RSC streaming, and `useOptimistic`.
> - Never sacrifice DX or maintainability for micro-optimizations.

---

## 🧪 The Performance Mindset

### 🔍 Measure First

> “Premature optimization is the root of all evil.” — Donald Knuth

| Tool                                        | Use Case                                     |
| ------------------------------------------- | -------------------------------------------- |
| **Lighthouse**                              | Core Web Vitals (LCP, INP, CLS) — _lab data_ |
| **Web Vitals JS**                           | Real-user metrics (RUM) — _field data_       |
| **React DevTools Profiler**                 | Component re-renders, commit times           |
| **Chrome Performance Tab**                  | Long tasks, layout thrashing, JS execution   |
| **Bundle Analyzer** (`source-map-explorer`) | JS/CSS bloat                                 |

✅ **Baseline**: Run Lighthouse _before_ any optimization. Target:

- Performance ≥ 90
- LCP ≤ 1.2s
- INP ≤ 200ms
- TBT ≤ 200ms

---

## 🧱 Core Bottlenecks & Fixes

### 1. **Bundle Size Bloat**

#### ❌ Symptoms:

- Slow FCP/LCP
- High TTI
- Failed Lighthouse “Reduce unused JavaScript”

#### ✅ Solutions:

| Technique                 | How                                  | Example                                                |
| ------------------------- | ------------------------------------ | ------------------------------------------------------ |
| **Code Splitting**        | `lazy` + `Suspense`                  | `const Chart = lazy(() => import('./Chart'))`          |
| **Route-level splitting** | Next.js App Router (auto)            | `app/dashboard/page.tsx` → separate chunk              |
| **Dynamic Imports**       | Load heavy libs on demand            | `onClick: () => import('xlsx').then(...)`              |
| **Tree-shaking**          | Use ES modules, avoid `* as _`       | `import { format } from 'date-fns'`                    |
| **Image Optimization**    | `next/image`, AVIF, `loading="lazy"` | `<Image src="/hero.avif" width={1200} height={600} />` |

> 📊 **Target**:
>
> - Main JS ≤ 250 KB (gzipped)
> - Hero image ≤ 100 KB (AVIF/WebP)
> - Fonts: self-host + `font-display: swap`

---

### 2. **Unnecessary Re-renders**

#### ❌ Symptoms:

- Components flashing in React DevTools profiler
- High “Commit” time in profiler
- `useEffect` firing unexpectedly

#### ✅ Solutions:

| Pattern              | When to Use                                            | Gotcha                                             |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `React.memo`         | Expensive child components                             | Only if props change _less_ than parent re-renders |
| `useCallback`        | Passing functions to `memo`’d children                 | Avoid for primitive deps (`[]`) or setters         |
| `useMemo`            | Expensive computations (e.g., `items.filter().sort()`) | Profile first — often unnecessary                  |
| **State colocation** | Keep state as close as possible to where it’s used     | Reduces prop drilling & re-renders                 |
| **Split contexts**   | Prevent all consumers re-rendering on _any_ change     | See [`context.md`](./context.md)                   |

> ⚠️ **Anti-Pattern**:
>
> ```tsx
> // ❌ Over-memoization — kills DX, minimal gain
> const handleClick = useCallback(() => {}, []);
> const name = useMemo(() => `${first} ${last}`, [first, last]);
> const config = useMemo(() => ({ theme, lang }), [theme, lang]);
> ```

> ✅ **React Compiler**:
> Opt-in to [React Compiler](https://react.dev/blog/2024/12/05/react-compiler-private-beta) → **automatic memoization** → delete 90% of `useCallback`/`useMemo`.

---

### 3. **Hydration & SSR Delays**

#### ❌ Symptoms:

- White screen after HTML loads
- INP spikes on first interaction
- “Hydration mismatch” warnings

#### ✅ Solutions:

| Technique                   | How                                              | Framework Support                       |
| --------------------------- | ------------------------------------------------ | --------------------------------------- |
| **Streaming SSR (RSC)**     | Render HTML in chunks as data streams in         | Next.js App Router ✅                   |
| **Selective Hydration**     | Prioritize interactive elements (buttons, forms) | React 18+ ✅                            |
| **`<Suspense>` boundaries** | Break up hydration into independent units        | `app/page.tsx` with nested `<Suspense>` |
| **Progressive Hydration**   | Hydrate off-main-thread (experimental)           | React Experimental ✅                   |

**Example (Next.js + RSC)**:

```tsx
// app/page.tsx
export default function Page() {
  return (
    <div>
      <NavBar /> {/* Hydrates first */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts /> {/* Hydrates when data arrives */}
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar /> {/* Hydrates in parallel */}
      </Suspense>
    </div>
  );
}
```

> 📊 **Target**:
>
> - TTFB ≤ 200ms
> - Time to Interactive (TTI) ≤ 2s
> - Zero hydration errors

---

## 🚀 React 19+ Performance Superpowers

### ✅ `useOptimistic`

Reduce perceived latency for mutations:

```tsx
const [optimisticPosts, addOptimistic] = useOptimistic(
  posts,
  (state, newPost) => [...state, { ...newPost, id: "temp-" + Date.now() }]
);

const createPost = useActionState(async (prev, formData) => {
  const post = { title: formData.get("title") };
  addOptimistic(post); // ✅ Instant UI update
  const saved = await savePost(post); // server action
  return [...prev, saved];
}, posts);
```

### ✅ `use` (for async in Server Components)

```tsx
// app/page.tsx
import { use } from "react";
async function getPosts() {
  return await db.posts.findMany();
}

export default function Page() {
  const posts = use(getPosts()); // ✅ Streams HTML as data loads
  return <PostsList posts={posts} />;
}
```

### ✅ React Compiler (Optimizing Compiler)

- **Auto-memoizes** components, hooks, and event handlers
- Eliminates stale closures
- Reduces bundle size via inlining
- ✅ Opt-in via `@react/compiler` + `vite-plugin-react-compiler`

> 📝 _Status_: Private beta moving toward GA — start experimenting now.

---

## 🛠️ Tooling & Automation

### Performance CI Checks

Add to GitHub Actions:

```yaml
# .github/workflows/perf.yml
- name: Lighthouse
  run: |
    npm install -g @lhci/cli@0.12
    lhci autorun --upload.target=temporary-public-storage

- name: Bundle Audit
  run: npx source-map-explorer 'dist/**/*.js' --html > report.html
```

### Monitoring in Production

| Metric          | Tool                | Alert Threshold   |
| --------------- | ------------------- | ----------------- |
| **LCP**         | Web Vitals JS + GA4 | > 2.5s            |
| **INP**         | CrUX + Sentry       | > 500ms           |
| **JS Errors**   | Sentry              | > 0.5% error rate |
| **Bundle Size** | BundleWatch         | > +5% vs main     |

---

## 🧪 Common Anti-Patterns

| Anti-Pattern                              | Why Bad                           | Fix                                           |
| ----------------------------------------- | --------------------------------- | --------------------------------------------- |
| `useEffect` for data fetching             | Causes waterfall requests, no SSR | → **Server Components** or **TanStack Query** |
| Large `useContext` providers              | Re-renders entire app on change   | → **Split contexts** or **Zustand**           |
| `key={Math.random()}`                     | Forces full re-mounts             | → Use stable IDs (`item.id`)                  |
| Heavy computations in render              | Blocks main thread                | → `useMemo` _or_ Web Worker                   |
| `[]` dependency on `useEffect` with props | Stale closures                    | → Include all deps, or use ref pattern        |

---

## 📚 Recommended Reading & Tools

- 📘 [React Docs: Performance](https://react.dev/learn/optimizing-performance)
- 🛠️ [React DevTools Profiler Guide](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)
- 📊 [Web Vitals](https://web.dev/vitals/)
- 🧪 [React Compiler Playground](https://react.github.io/compiler/)
- 📺 [React Performance Deep Dive](https://www.youtube.com/watch?v=7SJ6n7NqVJ4)

---

> 💡 **Final Thought**:  
> _“Performance isn’t a feature — it’s respect for your users’ time, battery, and data plans.”_  
> — Prioritize **perceived performance** (instant feedback) over raw metrics.
```
