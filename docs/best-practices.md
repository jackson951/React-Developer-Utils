# React Best Practices

A comprehensive guide to writing clean, maintainable, and performant React applications.

---

## Table of Contents

1. [Component Design](#component-design)
2. [State Management](#state-management)
3. [Performance Optimization](#performance-optimization)
4. [Code Organization](#code-organization)
5. [Hooks Best Practices](#hooks-best-practices)
6. [React 19+ Patterns](#react-19-patterns)
7. [Props & TypeScript](#props--typescript)
8. [Event Handling](#event-handling)
9. [Forms](#forms)
10. [Styling](#styling)
11. [Accessibility](#accessibility)
12. [Error Boundaries](#error-boundaries)
13. [Testing](#testing)
14. [Security](#security)

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

Context is convenient, but it re-renders every consumer on every value change. For frequently-updating values (like mouse position or form state), prefer a dedicated state library or splitting context by concern rather than one large "app context."

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

### Separate Server State from Client State

Not all state belongs in `useState`/`useReducer`. Data fetched from an API (server state) has different concerns — caching, revalidation, dedup — than local UI state (a modal being open). Reaching for `useEffect` + `useState` to fetch data works, but a library like TanStack Query or SWR handles caching and race conditions you'd otherwise write by hand.

```jsx
// Local/UI state — useState is right here
const [isOpen, setIsOpen] = useState(false);

// Server state — better handled by a data-fetching library
const { data, isLoading } = useQuery({ queryKey: ["user", id], queryFn: () => fetchUser(id) });
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

`useMemo`, `useCallback`, and `React.memo` aren't free — they cost a comparison on every render. Reach for them when you've actually measured a re-render problem (e.g. with React DevTools Profiler), not by default on every component and function. Premature memoization adds noise without benefit.

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

Use libraries like `react-window` or `@tanstack/react-virtual` for large lists.

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

Barrel files are convenient but can hurt tree-shaking and slow down builds in large apps if every file re-exports through one giant index. Fine for a utils library like this one; worth reconsidering in a large app with a bundler that struggles to tree-shake re-exports.

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

Turn on `eslint-plugin-react-hooks` — it catches this class of bug at lint time instead of runtime.

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

Let `eslint-plugin-react-hooks`'s `exhaustive-deps` rule flag missing dependencies rather than disabling it — a missing dependency is usually a real bug (stale closures), not noise to suppress.

---

## React 19+ Patterns

### `ref` as a Regular Prop

`forwardRef` is no longer required to receive a `ref` — as of React 19, function components can accept `ref` directly as a prop.

```jsx
// ✅ React 19 — no forwardRef needed
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### `useActionState` for Form Submissions

Replaces the manual `loading`/`error`/`data` triad for form actions.

```jsx
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const result = await submitForm(formData);
  return result.error ? { error: result.error } : { success: true };
}, null);

<form action={formAction}>
  <input name="email" />
  <button disabled={isPending}>Submit</button>
</form>;
```

### `useOptimistic` for Instant UI Feedback

```jsx
const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state, newTodo) => [
  ...state,
  newTodo,
]);
```

### The `use()` API

Reads a promise or context value, and can be called conditionally (unlike other hooks) — useful for reading a promise passed from a Server Component or a context inside an `if`.

```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map((c) => <p key={c.id}>{c.text}</p>);
}
```

These are additive — existing `useState`/`useReducer`/`useEffect` patterns above remain correct and are still the right tool outside of form-submission and Suspense-driven data flows.

---

## Props & TypeScript

### Destructure Props

**✅ Good:**

```jsx
function Button({ label, onClick, variant = "primary" }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Use TypeScript (Preferred Over PropTypes)

`PropTypes` only checks at runtime and only in development. TypeScript catches prop mismatches at compile time and gives you editor autocomplete — for any new project, prefer TypeScript over `PropTypes`.

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

If you're on an older JS-only codebase, `PropTypes` is still better than nothing:

```jsx
import PropTypes from "prop-types";

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
};
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

### Don't Create Functions in Render (When It Matters)

**❌ Avoid when passed to memoized children or in hot lists:**

```jsx
<button onClick={() => handleClick(id)}>Click</button>
```

**✅ Better:**

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

<button onClick={handleClick}>Click</button>;
```

Note: for a plain `<button>` with no memoized child underneath it, an inline arrow function is genuinely fine — React doesn't re-render a DOM node because its handler prop is a new function reference each time. This optimization matters when the handler is passed to a `React.memo`-wrapped component that would otherwise skip re-rendering.

### Use Event Delegation for Lists

**✅ Good:**

```jsx
function List({ items }) {
  const handleItemClick = (e) => {
    const id = e.target.closest("[data-id]")?.dataset.id;
    if (id) handleClick(id);
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

(`closest()` guards against clicks landing on a nested element inside the `<li>` rather than the `<li>` itself.)

---

## Forms

### Controlled Inputs for Validation-Heavy Forms

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const error = email && !email.includes("@") ? "Invalid email" : null;

  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <span role="alert">{error}</span>}
    </>
  );
}
```

### Uncontrolled Inputs for Simple, High-Volume Forms

For large forms where per-keystroke re-renders are wasteful, uncontrolled inputs with `ref` (or a library like React Hook Form, which uses uncontrolled inputs internally) avoid re-rendering the whole form on every keystroke.

```jsx
function SimpleForm() {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    submitForm(Object.fromEntries(data));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Validate on Blur, Not on Every Keystroke

Validating on every keystroke (before the user has finished typing) reads as the form yelling at them. Validate `onBlur`, then re-validate `onChange` only after the first error has been shown.

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

## Accessibility

Accessibility isn't a separate pass at the end — most of it is free if you reach for the right element from the start.

### Use Semantic HTML First

```jsx
// ❌ Bad: a div pretending to be a button
<div onClick={handleClick}>Submit</div>

// ✅ Good: a real button — gets keyboard focus, Enter/Space activation, and a11y tree role for free
<button onClick={handleClick}>Submit</button>
```

### Label Every Form Control

```jsx
// ✅ Good
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Or, if a visible label doesn't fit the design:
<input aria-label="Email" type="email" />
```

### Manage Focus for Dynamic UI

Modals and dropdowns should trap and restore focus, not just show/hide.

```jsx
function Modal({ isOpen, onClose, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true">
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  );
}
```

### Announce Dynamic Content

```jsx
<div role="status" aria-live="polite">
  {isSaving ? "Saving..." : "Saved"}
</div>
```

### Quick Wins

- Every `<img>` gets a meaningful `alt` (or `alt=""` if purely decorative).
- Interactive elements are reachable and operable by keyboard alone — test by unplugging your mouse.
- Color isn't the only signal for state (pair a red border with an error icon/text, not just red).

---

## Error Boundaries

Error boundaries catch rendering errors in their child tree and show a fallback UI instead of a blank white screen. They must be class components (there is no hook equivalent yet) — write one once and reuse it.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}

// Usage — scope boundaries to isolate failures, don't wrap only the whole app
<ErrorBoundary fallback={<DashboardError />}>
  <Dashboard />
</ErrorBoundary>;
```

Note what error boundaries **don't** catch: event handler errors, async code (`setTimeout`, promises), server-side rendering errors, and errors thrown in the boundary itself. Wrap async errors in a try/catch and surface them through normal state instead.

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

### Query the Way a User Would

Testing Library's query priority favors accessible queries first — this also doubles as an accessibility check.

```jsx
// Preferred order: role > label > text > testid
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText("Email");
screen.getByText("Welcome");
screen.getByTestId("submit-btn"); // last resort — no accessible link to the DOM
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

### Use Environment Variables for Secrets — Correctly

```bash
# .env — no spaces around `=`, no trailing semicolon, this is not JS
REACT_APP_API_KEY=your_key_here
```

```jsx
// Usage
const apiKey = process.env.REACT_APP_API_KEY;
```

Anything prefixed `REACT_APP_` (CRA) or `VITE_` (Vite) is bundled into client-side JS and is publicly visible in the browser. Never put a real secret (a server-side API key, a database credential) behind these prefixes — only values that are safe to be public (a publishable Stripe key, a public analytics ID) belong here. True secrets stay server-side.

### Validate External Links

```jsx
// Prevent the new tab from getting a reference back to your window
<a href={externalUrl} target="_blank" rel="noopener noreferrer">
  Visit site
</a>
```

---

## Quick Checklist

- [ ] Components are small and single-purpose
- [ ] State is kept close to where it's used; server state uses a data-fetching library, not raw `useEffect`
- [ ] Effects have proper cleanup functions
- [ ] Dependencies arrays are correct (enforced by `exhaustive-deps` lint rule)
- [ ] Expensive calculations are memoized — after measuring, not by default
- [ ] Lists use stable, unique keys (not array index)
- [ ] No unnecessary inline function creation passed to memoized children
- [ ] Props are typed (TypeScript preferred; PropTypes as a fallback)
- [ ] Semantic HTML used before reaching for ARIA
- [ ] Interactive elements are keyboard-operable and properly labeled
- [ ] Error boundaries scoped around risky subtrees, not just the app root
- [ ] Loading and error states handled explicitly
- [ ] `.env` secrets are actually server-side secrets, not bundled client values
- [ ] Code is consistent with team style guide

---

## Additional Resources

- [React Official Docs](https://react.dev)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Patterns.dev](https://www.patterns.dev/)
- [Testing Library Docs](https://testing-library.com/docs/queries/about/#priority)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)

---

**Remember:** These are guidelines, not rigid rules. Context matters. Always consider your specific use case, team preferences, and project requirements.
