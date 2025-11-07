### 📘 **File:** `notes/fundamentals/props-and-state.md`

# 🧩 Props & State in React

> Props and state are the two core ways to manage data in React components.
> **Props** are external inputs, while **state** is internal, mutable data.

---

## 🚀 1. Props — Component Inputs

Props allow a parent component to pass data to a child.

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

* Props are **read-only** — child components should **not modify them**.
* You can set **default props**:

```jsx
Greeting.defaultProps = {
  age: 18,
};
```

* With **TypeScript**:

```ts
type GreetingProps = {
  name: string;
  age?: number;
};

function Greeting({ name, age = 18 }: GreetingProps) {
  return (
    <p>
      Hello {name}, you are {age} years old.
    </p>
  );
}
```

---

## ⚙️ 2. State — Internal Component Data

State is used for **data that changes over time**.

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

* `useState(initialValue)` returns `[state, setState]`
* Updating state triggers a **re-render** of the component

---

## 🔄 3. Lifting State Up

When multiple components need the **same state**, lift it to their **nearest common parent**.

```jsx
import { useState } from "react";

function Parent() {
  const [text, setText] = useState("");

  return (
    <>
      <Input value={text} onChange={setText} />
      <Display value={text} />
    </>
  );
}

function Input({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Display({ value }) {
  return <p>{value}</p>;
}
```

✅ Ensures a **single source of truth** for shared data.

---

## 🧩 4. Controlled vs Uncontrolled Components

**Controlled Component:** React state drives the input.

```jsx
import { useState } from "react";

function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

**Uncontrolled Component:** The DOM manages its own state.

```jsx
import { useRef } from "react";

function UncontrolledInput() {
  const ref = useRef();
  const handleSubmit = () => console.log(ref.current.value);

  return (
    <>
      <input ref={ref} />
      <button onClick={handleSubmit}>Log Value</button>
    </>
  );
}
```

---

## ⚡ 5. Functional Updates

When new state depends on the previous state:

```jsx
setCount((prevCount) => prevCount + 1);
```

✅ Prevents **stale state** when updates are asynchronous.

---

## 🌐 6. Passing Functions via Props

You can pass **callbacks** from parent to child:

```jsx
function Parent() {
  const handleClick = () => console.log("Clicked!");
  return <Button onClick={handleClick} />;
}

function Button({ onClick }) {
  return <button onClick={onClick}>Click Me</button>;
}
```

---

## 🔧 7. Patterns for State Management

* **Local state** → `useState` inside a single component
* **Shared state** → Lift state up to a common parent
* **Global state** → Context API, Zustand, or Redux
* **Server state** → React Query / TanStack Query

---

## 🧭 8. Best Practices

* Keep **state minimal** — derive computed values instead of storing them
* Avoid **deeply nested state** objects; split into smaller parts
* Lift state **only when necessary**
* Use **descriptive prop names**
* Provide **default props** for optional values
* Prefer **function components** with hooks over class components

---

## 🔗 9. Resources

* [React Docs – State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
* [React Docs – Lifting State Up](https://reactjs.org/docs/lifting-state-up.html)
* [React Docs – Forms](https://reactjs.org/docs/forms.html)
* [React Docs – Controlled Components](https://reactjs.org/docs/forms.html#controlled-components)

---

✅ **Summary**

> Props and state form the **backbone of React’s data flow**.
> **Props** pass data **down** the component tree, **state** manages internal data,
> and **lifting state** enables shared control across components.
