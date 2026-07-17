# 🧱 React Components — Complete Guide

> Components are the heart of every React application: reusable, composable, and self‑contained UI pieces.  
> Understanding them deeply is the key to writing clean, scalable React code.

---

## 🚀 1. What Is a Component?

A React component is a **function** (or historically a class) that returns JSX – a syntax extension that looks like HTML.

### ✅ Function Components (Modern Standard)

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### ❌ Class Components (Legacy – avoid for new code)

```tsx
import React from 'react';

class Button extends React.Component<{ label: string; onClick: () => void }> {
  render() {
    return <button onClick={this.props.onClick}>{this.props.label}</button>;
  }
}
```

> ⚡ **Always use function components with hooks.** They are simpler, more testable, and fully support modern features like Server Components.

---

## ⚙️ 2. Props

Props are the **input parameters** of a component – they allow data to flow from parent to child.

```tsx
interface GreetingProps {
  name: string;
  age?: number;          // optional
}

function Greeting({ name, age = 18 }: GreetingProps) {
  return (
    <p>
      Hello {name}, you are {age} years old.
    </p>
  );
}
```

- **TypeScript interfaces** make props self‑documenting and safe.
- Use **default destructuring values** instead of `defaultProps`.

### `children` prop

Every component automatically receives a special `children` prop – anything between the opening and closing tags.

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// Usage
<Card title="Profile">
  <p>User details go here</p>
</Card>
```

---

## 🧠 3. State

Components can manage their own internal data with the `useState` hook.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
    </div>
  );
}
```

- Always use the **functional update form** when the new state depends on the previous one.
- Each state change triggers a re‑render of the component (and its children, unless memoized).

---

## 🔄 4. Lifecycle with `useEffect`

Function components use `useEffect` to synchronise with external systems (APIs, DOM, timers).

```tsx
import { useEffect } from 'react';

function Timer() {
  useEffect(() => {
    const id = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(id); // cleanup on unmount / before re‑run
  }, []); // empty deps → run once after mount

  return <p>Check the console</p>;
}
```

| Lifecycle equivalent | `useEffect` pattern                |
| -------------------- | ---------------------------------- |
| Mount                | `useEffect(fn, [])`                |
| Update (specific)    | `useEffect(fn, [someProp])`        |
| Unmount              | Return cleanup function inside fn |

> Avoid using `useEffect` for derived state or data fetching – prefer event handlers or libraries like TanStack Query.

---

## 🧩 5. Conditional Rendering

Display different content based on state or props.

```tsx
function Status({ isOnline }: { isOnline: boolean }) {
  return <p>{isOnline ? 'Online' : 'Offline'}</p>;
}
```

Other patterns:

- **Logical AND (`&&`)** – renders the right side only if condition is truthy:
  ```tsx
  {isOnline && <p>User is active</p>}
  ```
- **Early returns** – useful for loading/empty states:
  ```tsx
  if (!data) return <p>Loading…</p>;
  return <UserProfile user={data} />;
  ```

---

## 🔗 6. Lists & Keys

Render arrays by mapping over them. **Always provide a stable, unique `key`** to each item.

```tsx
const users = ['Alice', 'Bob', 'Charlie'];

function UserList() {
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user}</li>   // use user.id when available
      ))}
    </ul>
  );
}
```

- Key helps React identify which items changed, were added, or were removed.
- Avoid using `index` as the key if the list order can change or items can be added/removed.

---

## 🧱 7. Composition (Always over Inheritance)

React has a powerful composition model – components can wrap other components via `children` or explicit props.

```tsx
function Layout({ header, sidebar, children }: {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
```

You can also create **“slots”** by passing components as props, giving total flexibility without needing inheritance.

---

## 🌐 8. Event Handling

Events are camelCased and receive a **SyntheticEvent** (wraps the native DOM event).

```tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log('Clicked', event.currentTarget);
}

<button onClick={handleClick}>Click me</button>
```

- Avoid anonymous functions in JSX if they break memoisation; use `useCallback` when necessary.

---

## 🧪 9. Controlled vs Uncontrolled Inputs

**Controlled** (React manages value):

```tsx
function Input() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

**Uncontrolled** (DOM manages value, accessed via ref):

```tsx
import { useRef } from 'react';

function Input() {
  const ref = useRef<HTMLInputElement>(null);
  const handleSubmit = () => console.log(ref.current?.value);
  return (
    <>
      <input ref={ref} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

- Prefer controlled inputs for forms with validation/sync; use uncontrolled only for file inputs or legacy integrations.

---

## ⚡ 10. Fragments

Return multiple elements without adding extra DOM nodes using `<>…</>` (Fragment).

```tsx
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);
```

---

## 🧩 11. Performance: `memo`, `useMemo`, `useCallback`

- `memo` – prevents re‑rendering a pure component when its props haven’t changed.
- `useMemo` – memoises a computed value.
- `useCallback` – memoises a function reference (useful when passing callbacks to memoised children).

```tsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }: { items: string[] }) {
  // ...
});

function Parent({ items }: { items: string[] }) {
  const filtered = useMemo(() => items.filter(i => i.length > 3), [items]);
  const handleSelect = useCallback((id: string) => { /* ... */ }, []);

  return <ExpensiveList items={filtered} onSelect={handleSelect} />;
}
```

> Never over‑memoise – profile first, then optimise only when needed. The React Compiler (future) will handle much of this automatically.

---

## 🌐 13. Server Components vs Client Components (Modern Era)

In frameworks like Next.js App Router, components are **Server Components by default**.  
They run on the server, can `async/await` data directly, and are never sent to the client.

Client Components (`'use client'`) are needed for interactivity (hooks, event listeners, browser APIs).

```tsx
// Server Component (no `use client`)
export default async function Page() {
  const data = await fetch('https://api.example.com');  // runs on server
  return <ClientComponent initialData={data} />;
}

// Client Component
'use client';
export default function ClientComponent({ initialData }) {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 🧭 14. Best Practices (Checklist)

- ✅ **Function components + hooks only** – no classes.
- ✅ **TypeScript** for all components – define prop interfaces.
- ✅ **One component per file** – named export preferred.
- ✅ **Keep components small** – if it does too much, split it.
- ✅ **Composition over inheritance** – use `children` or explicit slots.
- ✅ **Co‑locate tests** – `Button.test.tsx` next to `Button.tsx`.
- ✅ **Avoid prop drilling** – use Context (sparingly) or state management (Zustand, etc.) when needed.
- ✅ **Server Components as much as possible** – reduce client‑side JS.
- ✅ **Memoise only after profiling** – not by default.
- ✅ **Consistent naming**: `PascalCase` for components, `camelCase` for functions.

---

## 📦 15. Barrel Exports

Organise component directories with an `index.ts` that re‑exports the public API.

```ts
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
```

Now consumers can import cleanly:

```tsx
import { Button, Card } from '@/components/ui';
```

---

## 🔗 16. Resources

- [React Docs – Your First Component](https://react.dev/learn/your-first-component)
- [React Docs – Passing Props](https://react.dev/learn/passing-props-to-a-component)
- [React Docs – State: A Component’s Memory](https://react.dev/learn/state-a-components-memory)
- [React Docs – Thinking in React](https://react.dev/learn/thinking-in-react)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

---

## ✅ Summary

> Components are the foundation of React.  
> Master **props, state, composition, and modern patterns** to build maintainable, scalable UIs.  
> Use **function components with hooks**, **TypeScript**, and **Server Components** where possible – that’s the modern React way.
```
