### 📘 **File:** `notes/fundamentals/components.md`

````markdown
# 🧱 React Components — Complete Guide

> Components are the building blocks of any React application. They are reusable, composable, and define the UI structure and behavior.

---

## 🚀 1. What is a Component?

A **React component** is a JavaScript (or TypeScript) function or class that returns JSX.

- **Function Component** (Recommended)

```jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// or arrow function
const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);
```
````

- **Class Component** (Legacy, less used)

```jsx
import React, { Component } from "react";

class Button extends Component {
  render() {
    const { label, onClick } = this.props;
    return <button onClick={onClick}>{label}</button>;
  }
}
```

✅ Prefer function components with hooks for modern React.

---

## ⚙️ 2. Props

Props are **inputs** to a component — they allow customization.

```jsx
function Greeting({ name, age }) {
  return (
    <p>
      Hello {name}, you are {age} years old.
    </p>
  );
}

// Usage
<Greeting name="Jackson" age={24} />;
```

**Default props:**

```jsx
Greeting.defaultProps = {
  age: 18,
};
```

**PropTypes (Optional):**

```bash
npm install prop-types
```

```jsx
import PropTypes from "prop-types";

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
};
```

---

## 🧠 3. State

Components can have **internal state** using `useState`:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

- `useState(initialValue)` returns `[state, setState]`.
- Each state change triggers a **re-render**.

---

## 🔄 4. Lifecycle (Function Components)

React function components use **hooks** instead of class lifecycle methods.

| Lifecycle Stage        | Hook                                    |
| ---------------------- | --------------------------------------- |
| Mount                  | `useEffect(() => {...}, [])`            |
| Update (specific prop) | `useEffect(() => {...}, [prop])`        |
| Cleanup / Unmount      | `return () => {...}` inside `useEffect` |

```jsx
import { useEffect } from "react";

function Timer() {
  useEffect(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  return <p>Check console for ticks</p>;
}
```

---

## 🧩 5. Conditional Rendering

```jsx
function Status({ isOnline }) {
  return <p>{isOnline ? "Online" : "Offline"}</p>;
}
```

- `&&` operator for short-circuit rendering:

```jsx
{
  isOnline && <p>User is online</p>;
}
```

- `||` for default fallback:

```jsx
<p>{name || "Guest"}</p>
```

---

## 🔗 6. Lists & Keys

Render arrays using `map`:

```jsx
const users = ["Alice", "Bob", "Charlie"];

function UserList() {
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user}</li>
      ))}
    </ul>
  );
}
```

> Always use **unique keys** to avoid rendering issues.

---

## 🧱 7. Composition vs Inheritance

React favors **composition** over inheritance:

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// Usage
<Card title="Profile">
  <p>This is some content</p>
</Card>;
```

✅ Components can wrap other components using `children`.

---

## 🌐 8. Event Handling

- Inline arrow function:

```jsx
<button onClick={() => console.log("Clicked")}>Click me</button>
```

- Named function:

```jsx
function handleClick() {
  console.log("Clicked");
}

<button onClick={handleClick}>Click me</button>;
```

> Event handlers receive **synthetic events** with the same interface as native DOM events.

---

## 🧪 9. Controlled vs Uncontrolled Components

**Controlled (React manages state):**

```jsx
function Input() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

**Uncontrolled (DOM manages state):**

```jsx
import { useRef } from "react";

function Input() {
  const ref = useRef();
  const handleSubmit = () => console.log(ref.current.value);
  return <input ref={ref} />;
}
```

---

## ⚡ 10. Fragments

Avoid extra DOM nodes using **Fragments**:

```jsx
return (
  <>
    <h1>Hello</h1>
    <p>World</p>
  </>
);
```

---

## 🧩 11. Memoization

Prevent unnecessary re-renders:

```jsx
import { memo } from "react";

const Button = memo(({ label }) => <button>{label}</button>);
```

- `useMemo` for expensive computations
- `useCallback` for functions

---

## 🧭 12. Best Practices

- Keep components **small & focused**
- Prefer **function components with hooks**
- Avoid deep prop drilling (use context or state libraries)
- Use **PropTypes or TypeScript** for type safety
- Split large UI into reusable components
- Follow **composition over inheritance**
- Name files after component (`Button.jsx`, `Card.jsx`)
- Use `index.js` for **barrel exports**:

```js
export { default as Button } from "./Button";
export { default as Card } from "./Card";
```

---

## 🔗 13. Resources

- [React Docs – Components & Props](https://reactjs.org/docs/components-and-props.html)
- [React Docs – State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [React Docs – Handling Events](https://reactjs.org/docs/handling-events.html)
- [React Docs – Lists and Keys](https://reactjs.org/docs/lists-and-keys.html)
- [React Docs – Composition vs Inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)

---

✅ **Summary**

> Components are the building blocks of React.
> Learn to handle **props, state, events, and lifecycle** efficiently.
> Use **composition, memoization, and controlled components** for scalable, maintainable code.
