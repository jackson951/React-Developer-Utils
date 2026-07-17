# 🖼️ Rendering in React

> Rendering is the process by which React takes your components and state, and produces the UI that appears on the screen.  
> Understanding how, when, and why React renders is fundamental to building fast, predictable applications.

---

## 🚀 1. What Is Rendering?

React components are **functions** that return **React elements** (JSX).  
When the app starts (or state/props change), React calls these functions to produce a virtual description of the UI. It then compares it with the previous description (reconciliation) and updates the real DOM efficiently.

```tsx
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}
```

- **Initial render** – when a component first appears on the screen.
- **Re-render** – triggered by state updates, prop changes, context changes, or parent re-renders.

---

## ⚡ 2. Conditional Rendering

Display different content based on logic.

### Ternary operator

```tsx
function Status({ isOnline }: { isOnline: boolean }) {
  return <p>{isOnline ? 'Online' : 'Offline'}</p>;
}
```

### Logical AND (`&&`)

```tsx
{isOnline && <p>User is online</p>}
```

### Early returns

For more complex logic, return early to avoid deeply nested conditions:

```tsx
function Dashboard({ user }: { user: User | null }) {
  if (!user) return <LoginScreen />;
  if (!user.isVerified) return <VerificationPrompt />;
  return <MainDashboard user={user} />;
}
```

---

## 🧩 3. Rendering Lists

Transform arrays into elements with `.map()`. Always provide a **stable, unique key**.

```tsx
const users = ['Alice', 'Bob', 'Charlie'];

<ul>
  {users.map((user, index) => (
    <li key={user}>{user}</li>  // use user as key if unique, otherwise user.id
  ))}
</ul>
```

For objects:

```tsx
const todos = [
  { id: 1, title: 'Learn React' },
  { id: 2, title: 'Build App' },
];

<ul>
  {todos.map(todo => (
    <li key={todo.id}>{todo.title}</li>
  ))}
</ul>
```

- **Never use index as key** if the list can change order, items can be added/removed, or the list is dynamic. It leads to bugs and performance issues.

---

## 🌐 4. Fragment Rendering

Avoid adding unnecessary DOM nodes by wrapping multiple elements in a Fragment:

```tsx
<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>
```

Fragments can also have a `key` when used in lists:

```tsx
items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
))
```

---

## 🔄 5. Portal Rendering

Render children into a different DOM node, outside the parent component’s hierarchy. Perfect for modals, tooltips, and dropdowns.

```tsx
import { createPortal } from 'react-dom';

function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root')!
  );
}
```

This preserves event bubbling in the React tree while placing DOM elsewhere.

---

## 🧪 6. Rendering Patterns for Performance

React’s default behavior is to re-render a component when its parent renders. You can opt‑out of unnecessary re‑renders with:

- `React.memo` – for pure components that only depend on props.
- `useMemo` – for expensive calculations.
- `useCallback` – for stable function references passed to memoised children.

```tsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }: { items: string[] }) {
  // component only re-renders when `items` changes
  return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
});

function Parent({ data }: { data: number[] }) {
  const sorted = useMemo(() => [...data].sort(), [data]);
  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []);

  return <ExpensiveList items={sorted} onItemClick={handleClick} />;
}
```

> **Important**: Do not memoise everything. Profile first, optimise second. The React Compiler (future) will automate much of this.

---

## 🖥️ 7. Server Components & Rendering

In frameworks like Next.js App Router, **Server Components** are rendered on the server and their output is sent as HTML. They never re-render on the client and cannot use hooks or interactivity.

Client Components (`'use client'`) are rendered on the server for the initial HTML and then **hydrated** on the client for interactivity. They follow the traditional rendering lifecycle.

- **Server Components**: Data fetching, direct DB access, no JS sent to client.
- **Client Components**: Interactivity, state, effects.

Data flows from Server to Client via **props** – not via Context.

---

## 🧱 8. Conditional Class Names

For dynamic styling, use template literals or a utility like `clsx` / `tailwind-merge`.

```tsx
import { cn } from '@/lib/cn'; // custom utility

function Button({ variant }: { variant: 'primary' | 'secondary' }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-600 text-white',
        variant === 'secondary' && 'bg-gray-200 text-black'
      )}
    >
      Click
    </button>
  );
}
```

---

## 🔧 9. Best Practices

- **Keep components pure** – same props → same output.
- **Minimise re-renders** with colocation, memo, and proper component splitting.
- **Use unique keys** for lists.
- **Prefer Fragments** over extra `<div>` wrappers.
- **Portals** for modals/tooltips.
- **Avoid defining components inside components** – they reset state on each render.
- **Leverage Server Components** for static content, Client Components only for interactivity.
- **Profile with React DevTools** before optimising.

---

## 🔗 10. Resources

- [React Docs: Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [React Docs: Rendering Lists](https://react.dev/learn/rendering-lists)
- [React Docs: Portals](https://react.dev/reference/react-dom/createPortal)
- [React Docs: memo](https://react.dev/reference/react/memo)
- [React Docs: Server Components](https://react.dev/learn/server-components)

---

✅ **Summary**

> React rendering is **declarative** and **reactive**.  
> Master conditional rendering, lists, portals, and performance techniques to build efficient, maintainable UIs.  
> In the modern era, understanding the separation between Server and Client rendering is just as important.
