### 📘 **File:** `notes/fundamentals/rendering.md`

# 🖼️ Rendering in React

> Rendering is how React converts your **components and state** into UI elements on the screen.  
> Understanding rendering patterns is essential for performance and maintainability.

---

## 🚀 1. Rendering Basics

- React components return **JSX** or **React elements**.
- Every **state or prop change** triggers a **re-render** of the component.

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```
````

- **Re-rendering propagates down the component tree** by default.

---

## ⚡ 2. Conditional Rendering

### 2.1 Ternary Operator

```jsx
function Status({ isOnline }) {
  return <p>{isOnline ? "Online" : "Offline"}</p>;
}
```

### 2.2 Short-circuit Operator

```jsx
{
  isOnline && <p>User is online</p>;
}
```

### 2.3 IIFE (Immediately Invoked Function Expression)

```jsx
{
  (() => {
    if (status === "loading") return <p>Loading...</p>;
    if (status === "error") return <p>Error!</p>;
    return <p>Success</p>;
  })();
}
```

---

## 🧩 3. Rendering Lists

- Use `map` to render arrays:

```jsx
const users = ["Alice", "Bob", "Charlie"];
<ul>
  {users.map((user, index) => (
    <li key={index}>{user}</li>
  ))}
</ul>;
```

✅ Always provide **unique keys** for list items to optimize updates.

- Rendering objects:

```jsx
const todos = [
  { id: 1, title: "Learn React" },
  { id: 2, title: "Build App" },
];

<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.title}</li>
  ))}
</ul>;
```

---

## 🌐 4. Fragment Rendering

Avoid extra DOM elements using **Fragments**:

```jsx
<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>
```

---

## 🔄 5. Portal Rendering

- Portals allow rendering **children into a different DOM node**:

```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById("modal-root")
  );
}
```

✅ Useful for modals, tooltips, and overlays.

---

## 🧪 6. Conditional Component Rendering

```jsx
function Page({ isAuthenticated }) {
  if (!isAuthenticated) return <Login />;
  return <Dashboard />;
}
```

- Prevents rendering unnecessary components.

---

## ⚡ 7. Rendering Performance Tips

- Use **React.memo** for pure functional components:

```jsx
const Button = React.memo(({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));
```

- Use **useMemo** for expensive computations:

```jsx
const computedValue = useMemo(() => heavyComputation(data), [data]);
```

- Use **useCallback** for stable function references in props:

```jsx
const handleClick = useCallback(() => console.log("Clicked"), []);
```

- Avoid inline object and function definitions in render when possible.

---

## 🔧 8. Conditional Class Names

```jsx
<div className={`card ${isActive ? "active" : ""}`}>Content</div>
```

- Libraries like **clsx** or **classnames** help with readability:

```bash
npm install clsx
```

```jsx
import clsx from "clsx";

<div className={clsx("card", { active: isActive, disabled: isDisabled })}>
  Content
</div>;
```

---

## 🧭 9. Best Practices

- Keep components **pure** when possible
- Minimize unnecessary re-renders
- Always provide **unique keys** for lists
- Prefer **Fragments** to extra DOM elements
- Split large components into smaller **rendering-focused components**
- Use **portals** for modals and overlays
- Optimize expensive rendering with `React.memo`, `useMemo`, and `useCallback`

---

## 🔗 10. Resources

- [React Docs – Conditional Rendering](https://reactjs.org/docs/conditional-rendering.html)
- [React Docs – Lists and Keys](https://reactjs.org/docs/lists-and-keys.html)
- [React Docs – Portals](https://reactjs.org/docs/portals.html)
- [React Docs – Optimizing Performance](https://reactjs.org/docs/optimizing-performance.html)

---

✅ **Summary**

> React rendering is **reactive** — components re-render on **state or prop changes**.
> Master **conditional rendering, lists, fragments, portals**, and **performance optimizations** for efficient UI.
