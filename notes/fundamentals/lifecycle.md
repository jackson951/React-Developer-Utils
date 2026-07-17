# 🔄 React Component Lifecycle

> Every React component goes through a lifecycle: it’s **mounted** into the DOM, **updated** when state or props change, and **unmounted** when it’s no longer needed.  
> Function components with Hooks make this explicit, declarative, and easy to reason about.

---

## 🚀 1. Lifecycle Phases Overview

| Phase      | What happens                                                       | Function Component Hook                             |
| ---------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| **Mount**  | Component is created and inserted into the DOM                     | `useEffect(fn, [])`                                 |
| **Update** | Re-rendered because of new props, state, or context                | `useEffect(fn, [deps])`                             |
| **Unmount**| Component is removed from the DOM; clean up side effects           | Return a cleanup function from `useEffect`          |
| **Error**  | A child component throws an error during rendering (class only)    | *(use Error Boundary component)*                    |

> **Historical note**: Class components used lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`). All modern code uses Hooks.

---

## 🧩 2. The Mounting Phase

Run code **once** after the component is first rendered.

```tsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // This runs after the first render (mount)
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Optional: clean up when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array → run only on mount

  return <p>Seconds: {seconds}</p>;
}
```

✅ **Use cases**:  
- Start timers or intervals  
- Add global event listeners  
- Fetch initial data (though TanStack Query or Server Components are often better)

---

## ⚡ 3. The Updating Phase

React re‑renders a component when its state or props change. Use `useEffect` with a dependency array to run code **after specific values change**.

```tsx
import { useEffect, useState } from 'react';

function DocumentTitle({ count }: { count: number }) {
  useEffect(() => {
    document.title = `Count: ${count}`;
    // No cleanup needed here
  }, [count]); // Only run when `count` changes

  return <p>{count}</p>;
}
```

You can also compare previous and current values inside the effect if needed:

```tsx
useEffect(() => {
  console.log(`Count changed from ${prevCount} to ${count}`);
  // But you'd need a ref to track prevCount – see custom hooks
}, [count]);
```

✅ **Use cases**:  
- Sync with external APIs (browser title, localStorage, etc.)  
- Log analytics on change  
- Re‑fetch data when a filter/id changes

---

## 🧱 4. The Unmounting Phase

When a component is removed from the UI, you must **clean up** subscriptions, timers, or event listeners to avoid memory leaks.

The cleanup function returned from `useEffect` handles this.

```tsx
useEffect(() => {
  const handleScroll = () => console.log('scrolling');
  window.addEventListener('scroll', handleScroll);

  // Cleanup runs before unmount *and* before re‑running the effect
  return () => window.removeEventListener('scroll', handleScroll);
}, []); // Only on mount/unmount
```

✅ **Always clean up**:
- `setInterval` / `setTimeout`
- `addEventListener` / `removeEventListener`
- WebSocket / subscription connections
- Any external mutable side effect

---

## 🧠 5. The Dependency Array (`deps`) – The Key to Correct Effects

| Dependency array        | When does the effect run?                                        |
| ----------------------- | ---------------------------------------------------------------- |
| `[]`                    | Only after the **first render** (mount)                          |
| `[dep1, dep2]`          | After the first render **and** when any dependency changes       |
| *(no array at all)*     | After **every render** – rarely useful, often a mistake           |

> ⚠️ You **must** include every reactive value (props, state, context) that is used inside the effect. Linting rule `react-hooks/exhaustive-deps` enforces this.

---

## 🌐 6. Splitting Effects for Readability

Don’t cram unrelated logic into one effect. Split them:

```tsx
useEffect(() => {
  console.log('Effect A: runs on mount');
}, []);

useEffect(() => {
  console.log('Effect B: runs when count changes');
}, [count]);
```

✅ This keeps side‑effects isolated and easy to understand.

---

## 🧪 7. Error Boundary (Class-Only, Still Relevant)

`useEffect` does **not** catch errors thrown in child components. For that, you still need an **Error Boundary** (a class component).  

```tsx
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { /* log to Sentry */ }
  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}
```

> For more advanced patterns, see the dedicated error boundaries guide.

---

## 💡 8. Best Practices

- **Use function components + Hooks only** – classes are legacy.
- **Keep effects minimal** – move logic to event handlers or custom hooks when possible.
- **Always clean up subscriptions** – memory leaks are silent killers.
- **Follow the exhaustive deps rule** – don’t lie about dependencies.
- **Don’t call Hooks conditionally** – they rely on call order.
- **Use the React DevTools Profiler** to spot unnecessary re‑renders.
- **Prefer Server Components or TanStack Query for data fetching** – avoid `useEffect` for typical API calls.

---

## 🔗 9. Resources

- [React Docs: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

---

✅ **Summary**

> The modern React lifecycle is centered around `useEffect` and its dependency array.  
> **Mount, update, and unmount** are no longer hidden magic methods – they are explicit, composable, and testable.  
> Mastering this mental model unlocks predictable, bug‑free React code.
```
