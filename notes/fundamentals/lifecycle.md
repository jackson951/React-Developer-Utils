### 📘 **File:** `notes/fundamentals/lifecycle.md`
# 🔄 React Component Lifecycle

> React components go through **lifecycle stages**: Mounting, Updating, and Unmounting.  
> Function components use **Hooks** while class components use **lifecycle methods**.

---

## 🚀 1. Lifecycle Phases

| Phase      | Class Methods / Hooks                               | Description                                        |
| ---------- | --------------------------------------------------- | -------------------------------------------------- |
| Mounting   | constructor → render → componentDidMount            | Component is created and inserted into DOM         |
| Updating   | shouldComponentUpdate → render → componentDidUpdate | Component is re-rendered due to props/state change |
| Unmounting | componentWillUnmount                                | Component is removed from the DOM                  |

---

## 🧩 2. Mounting Phase

**Class Component Example:**

```jsx
import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
    console.log("Constructor: Initialize state");
  }

  componentDidMount() {
    console.log("Mounted");
    this.interval = setInterval(() => {
      this.setState((prev) => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    console.log("Unmounting...");
    clearInterval(this.interval);
  }

  render() {
    return <p>Seconds: {this.state.seconds}</p>;
  }
}
```
````

**Function Component (Hooks) Example:**

```jsx
import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []); // empty dependency → run once on mount

  return <p>Seconds: {seconds}</p>;
}
```

---

## ⚡ 3. Updating Phase

Triggered when **props or state change**.

**Class Component:**

```jsx
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    console.log("Count updated:", this.state.count);
  }
}
```

**Function Component:**

```jsx
useEffect(() => {
  console.log("Count updated:", count);
}, [count]); // dependency array
```

---

## 🧱 4. Unmounting Phase

Triggered when the component is **removed from the DOM**.

- Use for cleanup: timers, subscriptions, event listeners.

```jsx
useEffect(() => {
  const id = setInterval(doSomething, 1000);
  return () => clearInterval(id); // cleanup on unmount
}, []);
```

---

## 🧠 5. Common Lifecycle Patterns

| Use Case                | Class Method / Hook                              |
| ----------------------- | ------------------------------------------------ |
| Fetch data on mount     | componentDidMount / useEffect([], ...)           |
| Update DOM after render | componentDidUpdate / useEffect([deps])           |
| Cleanup subscriptions   | componentWillUnmount / useEffect return          |
| Conditionally re-render | shouldComponentUpdate / React.memo + useCallback |

---

## 🔧 6. useEffect Dependency Array

- `[]` → run **once on mount**
- `[dep]` → run when `dep` changes
- No array → run **after every render** (rarely recommended)

---

## 🌐 7. Multiple Effects

```jsx
useEffect(() => {
  console.log("Effect 1");
}, []);

useEffect(() => {
  console.log("Effect 2, depends on count");
}, [count]);
```

✅ You can split effects by responsibility for cleaner code.

---

## 💡 8. Best Practices

- Prefer **function components with hooks**
- Cleanup timers and subscriptions to prevent memory leaks
- Use **dependency arrays** carefully in `useEffect`
- Use `React.memo` and `useCallback` to optimize updates
- Avoid side effects in render — always use `useEffect`

---

## 🔗 9. Resources

- [React Docs – State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [React Docs – Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)
- [React Patterns – Lifecycle with Hooks](https://reactpatterns.com/#useeffect)

---

✅ **Summary**

> React lifecycle controls **how and when components mount, update, and unmount**.
> Hooks like `useEffect` replace class lifecycle methods, making functional components the modern standard.
