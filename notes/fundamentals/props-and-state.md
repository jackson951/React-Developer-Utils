# 🧩 Props & State in React

> Props and state are the two core ways to manage data in React components.  
> **Props** are external inputs (passed from parent to child), while **state** is internal, mutable data that a component owns.  
> Understanding them deeply is essential for building predictable, reusable UIs.

---

## 🚀 1. Props — Component Inputs

Props allow a parent component to pass data to a child. They are **read-only** – a component must never modify its own props.

### Basic example (TypeScript)

```tsx
interface GreetingProps {
  name: string;
  age?: number;               // optional
}

function Greeting({ name, age = 18 }: GreetingProps) {
  return (
    <p>
      Hello {name}, you are {age} years old.
    </p>
  );
}

// Usage
<Greeting name="Jackson" age={24} />;
```

- Use **TypeScript interfaces** to type props – self‑documenting and safe.
- Provide **default values via destructuring**, not `defaultProps` (legacy).

### `children` prop

Every component receives a special `children` prop (the content between its tags):

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

<Card title="Profile">
  <p>Some content</p>
</Card>
```

### Spreading props

You can forward multiple props using the spread operator:

```tsx
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
```

> Props flow **down** the component tree – from parent to child. In a React Server Components world, props are the **primary way to pass data from Server Components to Client Components**.

---

## ⚙️ 2. State — Internal Component Data

State is used for **data that changes over time** and should trigger a re‑render.

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

- `useState(initialValue)` returns a tuple `[value, setter]`.
- The setter can accept a **function** to update based on the previous value (avoids stale closures).
- Each state change schedules a re‑render of the component (and its children, unless memoised).

---

## 🔄 3. Lifting State Up

When multiple components need access to the **same changing data**, lift that state to their nearest common ancestor.

```tsx
import { useState } from 'react';

function Parent() {
  const [text, setText] = useState('');

  return (
    <>
      <Input value={text} onChange={setText} />
      <Display value={text} />
    </>
  );
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

function Display({ value }: { value: string }) {
  return <p>{value}</p>;
}
```

✅ This establishes a **single source of truth** and keeps data in sync effortlessly.

---

## 🧩 4. Controlled vs Uncontrolled Components

| Type           | Who owns the data?                  | Use case                                      |
| -------------- | ----------------------------------- | --------------------------------------------- |
| **Controlled** | React state (`value` + `onChange`)  | Most forms (validation, reset, dynamic input) |
| **Uncontrolled**| DOM (`defaultValue`, ref)          | File inputs, performance‑critical forms       |

### Controlled (recommended)

```tsx
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

### Uncontrolled (when you need direct DOM access)

```tsx
function UncontrolledInput() {
  const ref = useRef<HTMLInputElement>(null);
  const handleSubmit = () => console.log(ref.current?.value);

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

When the new state depends on the previous state, **always use the functional updater**:

```tsx
setCount(prev => prev + 1);
```

This avoids stale state, especially in async callbacks or when multiple updates are batched.

---

## 🌐 6. Passing Functions via Props

You can pass callback functions to child components, enabling them to communicate upwards.

```tsx
function Parent() {
  const handleClick = (id: string) => console.log('Clicked', id);
  return <Button onClick={handleClick} />;
}

function Button({ onClick }: { onClick: (id: string) => void }) {
  return <button onClick={() => onClick('btn1')}>Click Me</button>;
}
```

> For performance, wrap callbacks in `useCallback` only when they are passed to memoised children or included in dependency arrays.

---

## 🔧 7. Patterns for State Management

| Scope       | What to use                                             |
| ----------- | ------------------------------------------------------- |
| **Local**   | `useState`, `useReducer` (within a single component)    |
| **Shared**  | Lift state up to common parent; prop drilling or Context |
| **Global**  | Zustand, Jotai, or Redux Toolkit (UI state across app)  |
| **Server**  | TanStack Query, SWR, or Server Components (data from API)|

> **Never mix server and UI state in the same store.** Keep them separate for clarity and performance.

---

## 🧭 8. Best Practices

- Keep state **minimal** – derive values rather than storing them redundantly.
- **Lift state only as high as necessary** – no global state for a toggle inside one component.
- Use **descriptive prop names** and TypeScript interfaces.
- Prefer **controlled components** for forms.
- Avoid **deeply nested state** – use `useReducer` or split into multiple `useState` calls.
- **Do not mutate state directly** – always use the setter or produce a new object/array.
- In Server Components, **state is forbidden** – keep state in Client Components only.

---

## 🔗 9. Resources

- [React Docs: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React Docs: State: A Component’s Memory](https://react.dev/learn/state-a-components-memory)
- [React Docs: Lifting State Up](https://react.dev/learn/sharing-state-between-components)
- [React Docs: Controlled vs Uncontrolled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

---

✅ **Summary**

> **Props** and **state** are the backbone of React’s data flow.  
> Props flow **down**, state lives **inside**.  
> Master lifting state, controlled inputs, and functional updates to build reliable, maintainable UIs.
```
