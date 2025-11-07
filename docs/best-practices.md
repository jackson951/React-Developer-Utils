# React Best Practices

A comprehensive guide to writing clean, maintainable, and performant React applications.

---

## Table of Contents

1. [Component Design](#component-design)
2. [State Management](#state-management)
3. [Performance Optimization](#performance-optimization)
4. [Code Organization](#code-organization)
5. [Hooks Best Practices](#hooks-best-practices)
6. [Props & TypeScript](#props--typescript)
7. [Event Handling](#event-handling)
8. [Styling](#styling)
9. [Testing](#testing)
10. [Security](#security)

---

## Component Design

### Keep Components Small and Focused

**❌ Bad:**

```jsx
function UserDashboard() {
  // 500 lines of mixed logic for profile, settings, posts, etc.
}
```

**✅ Good:**

```jsx
function UserDashboard() {
  return (
    <>
      <UserProfile />
      <UserSettings />
      <UserPosts />
    </>
  );
}
```

### Use Composition Over Props Drilling

**❌ Bad:**

```jsx
<Parent>
  <Child theme={theme} user={user} settings={settings} />
</Parent>
```

**✅ Good:**

```jsx
// Use Context or children pattern
<ThemeProvider>
  <UserProvider>
    <Child />
  </UserProvider>
</ThemeProvider>
```

### Prefer Function Components

Use functional components with hooks instead of class components for new code.

```jsx
// ✅ Modern approach
function Welcome({ name }) {
  const [count, setCount] = useState(0);
  return <h1>Hello, {name}</h1>;
}
```

---

## State Management

### Lift State Up Only When Necessary

Keep state as close as possible to where it's used.

**❌ Bad:**

```jsx
function App() {
  const [modalOpen, setModalOpen] = useState(false); // Only used in Settings
  return (
    <>
      <Home />
      <Settings modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
}
```

**✅ Good:**

```jsx
function Settings() {
  const [modalOpen, setModalOpen] = useState(false);
  // Use it locally
}
```

### Use Reducer for Complex State Logic

**❌ Bad:**

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

**✅ Good:**

```jsx
const [state, dispatch] = useReducer(reducer, {
  loading: false,
  error: null,
  data: null,
});
```

### Derive State When Possible

**❌ Bad:**

```jsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

**✅ Good:**

```jsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const fullName = `${firstName} ${lastName}`; // Derived!
```

---

## Performance Optimization

### Memoize Expensive Calculations

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### Memoize Callback Functions

```jsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Use React.memo for Pure Components

```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Complex rendering */}</div>;
});
```

### Lazy Load Components

```jsx
const LazyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Virtualize Long Lists

Use libraries like `react-window` or `react-virtualized` for large lists.

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList height={500} itemCount={1000} itemSize={35}>
  {Row}
</FixedSizeList>;
```

---

## Code Organization

### Consistent File Naming

```
// PascalCase for components
Button.jsx
UserProfile.jsx

// camelCase for utilities/hooks
useAuth.js
formatDate.js

// kebab-case for general files
api-client.js
auth-service.js
```

### Organize by Feature, Not File Type

**❌ Bad:**

```
src/
  components/
  hooks/
  utils/
  contexts/
```

**✅ Good:**

```
src/
  features/
    auth/
      components/
      hooks/
      utils/
      AuthContext.jsx
    dashboard/
    profile/
```

### Barrel Exports

```jsx
// components/index.js
export { Button } from "./Button";
export { Modal } from "./Modal";
export { Card } from "./Card";

// Usage
import { Button, Modal, Card } from "./components";
```

---

## Hooks Best Practices

### Follow Rules of Hooks

✅ Always call hooks at the top level
✅ Only call hooks from React functions
❌ Don't call hooks inside loops, conditions, or nested functions

```jsx
// ❌ Bad
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // Conditional hook!
  }
}

// ✅ Good
function Component({ condition }) {
  const [state, setState] = useState(0);

  if (condition) {
    // Use the state here
  }
}
```

### Custom Hooks for Reusable Logic

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [user, setUser] = useLocalStorage("user", null);
```

### Cleanup Side Effects

```jsx
useEffect(() => {
  const subscription = api.subscribe();

  return () => {
    subscription.unsubscribe(); // Cleanup!
  };
}, []);
```

### Optimize useEffect Dependencies

```jsx
// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // userId is used but not in deps

// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## Props & TypeScript

### Destructure Props

**✅ Good:**

```jsx
function Button({ label, onClick, variant = "primary" }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Use PropTypes or TypeScript

```jsx
// With PropTypes
import PropTypes from "prop-types";

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
};

// With TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Spread Props Carefully

```jsx
// ✅ Good: Explicit props
<Button onClick={handleClick} disabled={isDisabled} />

// ⚠️ Use with caution
<Button {...buttonProps} /> // Make sure you know what's in buttonProps
```

---

## Event Handling

### Don't Create Functions in Render

**❌ Bad:**

```jsx
<button onClick={() => handleClick(id)}>Click</button>
```

**✅ Good:**

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

<button onClick={handleClick}>Click</button>;
```

### Use Event Delegation for Lists

**✅ Good:**

```jsx
function List({ items }) {
  const handleItemClick = (e) => {
    const id = e.target.dataset.id;
    handleClick(id);
  };

  return (
    <ul onClick={handleItemClick}>
      {items.map((item) => (
        <li key={item.id} data-id={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

---

## Styling

### Use CSS Modules or Styled Components

```jsx
// CSS Modules
import styles from "./Button.module.css";

function Button() {
  return <button className={styles.button}>Click</button>;
}

// Or Tailwind
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">Click</button>
  );
}
```

### Conditional Classes Helper

```jsx
// utils/classNames.js
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Usage
<div
  className={cn(
    "base-class",
    isActive && "active-class",
    isDisabled && "disabled-class"
  )}
/>;
```

---

## Testing

### Write Tests for Critical Paths

```jsx
import { render, screen, fireEvent } from "@testing-library/react";

test("button handles click", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText("Click me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Test User Behavior, Not Implementation

**❌ Bad:**

```jsx
expect(component.state.count).toBe(1);
```

**✅ Good:**

```jsx
expect(screen.getByText("Count: 1")).toBeInTheDocument();
```

---

## Security

### Sanitize User Input

```jsx
// ❌ Bad: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />;

// ✅ Good: Use a sanitizer
import DOMPurify from "dompurify";

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userInput),
  }}
/>;
```

### Avoid Sensitive Data in State

```jsx
// ❌ Bad
const [creditCard, setCreditCard] = useState("4111-1111-1111-1111");

// ✅ Good: Keep sensitive data server-side
const [lastFourDigits, setLastFourDigits] = useState("1111");
```

### Use Environment Variables for Secrets

```jsx
// .env
REACT_APP_API_KEY = your_key_here;

// Usage
const apiKey = process.env.REACT_APP_API_KEY;
```

---

## Quick Checklist

- [ ] Components are small and single-purpose
- [ ] State is kept close to where it's used
- [ ] Effects have proper cleanup functions
- [ ] Dependencies arrays are correct
- [ ] Expensive calculations are memoized
- [ ] Lists use proper keys (not index)
- [ ] No inline function creation in render
- [ ] Props are validated (PropTypes/TypeScript)
- [ ] Accessibility attributes added (aria-\*, role)
- [ ] Error boundaries implemented
- [ ] Loading and error states handled
- [ ] Code is consistent with team style guide

---

## Additional Resources

- [React Official Docs](https://react.dev)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Patterns.dev](https://www.patterns.dev/)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)

---

**Last Updated:** 2025

**Remember:** These are guidelines, not rigid rules. Context matters. Always consider your specific use case, team preferences, and project requirements.
