# React Interview Questions & Answers

A comprehensive collection of React interview questions from beginner to advanced levels, with detailed answers and code examples.

---

## Table of Contents

1. [Fundamentals](#fundamentals)
2. [Components & Props](#components--props)
3. [State & Lifecycle](#state--lifecycle)
4. [Hooks](#hooks)
5. [Performance Optimization](#performance-optimization)
6. [Advanced Concepts](#advanced-concepts)
7. [Routing & Navigation](#routing--navigation)
8. [State Management](#state-management)
9. [Testing](#testing)
10. [Real-World Scenarios](#real-world-scenarios)
11. [Architecture & Best Practices](#architecture--best-practices)
12. [React 18 Features](#react-18-features)
13. [Advanced Patterns](#advanced-patterns)
14. [React 19 Features](#react-19-features)

---

## Fundamentals

### Q1: What is React? Why use it?

**Answer:**
React is a JavaScript library for building user interfaces, particularly single-page applications. It was developed by Facebook (Meta).

**Key Benefits:**
- **Component-Based**: Reusable UI pieces
- **Virtual DOM**: Efficient updates and rendering
- **Declarative**: Describe what UI should look like, React handles the how
- **One-Way Data Flow**: Predictable state management
- **Large Ecosystem**: Rich tooling and community support

```jsx
// Declarative approach
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

---

### Q2: What is JSX?

**Answer:**
JSX (JavaScript XML) is a syntax extension that allows writing HTML-like code in JavaScript. It's syntactic sugar for `React.createElement()` (compiled today via the `jsx` runtime, `_jsx()`, rather than `createElement` directly — same idea, slightly different output).

```jsx
// JSX
const element = <h1 className="greeting">Hello!</h1>;

// Conceptually compiles to:
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello!'
);
```

**Rules:**
- Must return a single root element (or a Fragment `<>...</>`)
- Use `className` instead of `class`
- Use `camelCase` for attributes (onClick, onChange)
- Close all tags (`<img />`, `<br />`)

---

### Q3: What is the Virtual DOM?

**Answer:**
The Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to optimize updates.

**How it works:**
1. React creates a virtual DOM tree
2. When state changes, React creates a new virtual DOM
3. React compares (diffs) the old and new virtual DOM
4. React updates only the changed parts in the real DOM

**Benefits:**
- Minimizes expensive DOM operations
- Batch updates for better performance
- Cross-browser compatibility

```jsx
// When count changes, only the text node updates, not the entire button
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### Q4: What's the difference between Element and Component?

**Answer:**

**Element:**
- Plain object describing what to render
- Immutable
- Created with JSX or React.createElement

```jsx
const element = <div>Hello</div>;
```

**Component:**
- Function or class that returns elements
- Can have state and lifecycle
- Reusable

```jsx
function Welcome() {
  return <div>Hello</div>;
}
```

---

## Components & Props

### Q5: What are Props?

**Answer:**
Props (properties) are read-only inputs passed from parent to child components.

```jsx
// Parent
<UserCard name="Alice" age={25} isActive={true} />

// Child
function UserCard({ name, age, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isActive && <span>Active</span>}
    </div>
  );
}
```

**Key Points:**
- Props are immutable (read-only)
- Flow down (parent → child)
- Can pass any data type including functions
- Use destructuring for cleaner code

---

### Q6: Controlled vs Uncontrolled Components?

**Answer:**

**Controlled Component:**
React controls the form data through state.

```jsx
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
    />
  );
}
```

**Uncontrolled Component:**
DOM handles the form data, accessed via refs.

```jsx
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
```

**When to use:**
- Controlled: Most cases, when you need validation, conditional rendering
- Uncontrolled: File inputs, integrating with non-React code, large forms where per-keystroke re-renders matter

---

### Q7: How to pass data from child to parent?

**Answer:**
Pass a callback function from parent to child.

```jsx
// Parent
function Parent() {
  const [message, setMessage] = useState('');
  
  const handleMessage = (msg) => {
    setMessage(msg);
  };
  
  return (
    <div>
      <p>Message: {message}</p>
      <Child onSendMessage={handleMessage} />
    </div>
  );
}

// Child
function Child({ onSendMessage }) {
  return (
    <button onClick={() => onSendMessage('Hello from child!')}>
      Send Message
    </button>
  );
}
```

---

## State & Lifecycle

### Q8: What is State?

**Answer:**
State is a built-in object that holds data that may change over time. When state changes, the component re-renders.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**State vs Props:**
- State is mutable, props are immutable
- State is local, props come from parent
- State changes trigger re-renders

---

### Q9: Explain Component Lifecycle

**Answer:**

**Modern (Hooks):**
```jsx
function Component() {
  // Mount
  useEffect(() => {
    console.log('Component mounted');
    
    // Unmount
    return () => {
      console.log('Component will unmount');
    };
  }, []);
  
  // Update (when dep changes)
  useEffect(() => {
    console.log('Dependency changed');
  }, [dependency]);
}
```

**Class Components (Legacy):**
- **Mounting**: constructor → render → componentDidMount
- **Updating**: render → componentDidUpdate
- **Unmounting**: componentWillUnmount

**Note on StrictMode:** in development, React 18+'s `<StrictMode>` intentionally mounts, unmounts, then remounts every component once (running effects twice) to surface missing cleanup functions. This is dev-only behavior — production runs effects once — but it trips people up if they don't know it's expected.

---

### Q10: What happens when setState is called?

**Answer:**

1. React schedules a re-render
2. React merges the new state with old state
3. React re-renders the component
4. React updates the DOM if needed

**Important:**
- setState is asynchronous
- Multiple setState calls are batched — as of React 18, this batching happens everywhere (event handlers, promises, timeouts, native event handlers), not just inside React event handlers as in React 17 and earlier
- Use functional form for state that depends on previous state

```jsx
// ❌ Wrong
setCount(count + 1);
setCount(count + 1); // Still increments by 1 — both read the same stale `count`

// ✅ Correct
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Increments by 2 — each reads the latest pending value
```

---

## Hooks

### Q11: What are Hooks? Why were they introduced?

**Answer:**
Hooks are functions that let you use state and lifecycle features in functional components.

**Benefits:**
- Reuse stateful logic without HOCs or render props
- Split code by concern, not lifecycle
- Easier to understand and test
- No `this` binding confusion

```jsx
function useAuth() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);
  
  return user;
}

// Use in any component
function Profile() {
  const user = useAuth();
  return <div>{user?.name}</div>;
}
```

---

### Q12: Explain useState

**Answer:**
`useState` adds state to functional components.

```jsx
const [state, setState] = useState(initialValue);
```

**Examples:**

```jsx
// Primitive value
const [count, setCount] = useState(0);

// Object
const [user, setUser] = useState({ name: '', age: 0 });

// Lazy initialization (expensive computation) — pass a function, not the call itself,
// so the computation only runs once on mount, not on every render
const [data, setData] = useState(() => expensiveCalculation());

// Updating objects (must spread — setState replaces, it doesn't merge, unlike class setState)
setUser(prev => ({ ...prev, name: 'Alice' }));
```

---

### Q13: Explain useEffect

**Answer:**
`useEffect` handles side effects (data fetching, subscriptions, DOM manipulation).

```jsx
useEffect(() => {
  // Effect code
  
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

**Examples:**

```jsx
// Run once on mount
useEffect(() => {
  fetchData();
}, []);

// Run when userId changes
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// Run on every render (rare — usually a sign something belongs in the render body instead)
useEffect(() => {
  console.log('Component rendered');
});

// Cleanup example
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer);
}, []);
```

For fetching data specifically, prefer a library (TanStack Query, SWR) or a framework's built-in data layer over raw `useEffect` — it's easy to under-handle race conditions (see Q32) by hand.

---

### Q14: What is useContext?

**Answer:**
`useContext` accesses context values without prop drilling.

```jsx
// Create context
const ThemeContext = createContext();

// Provider
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// Consumer
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      Toggle Theme
    </button>
  );
}
```

(React 19 also allows rendering `<ThemeContext>` directly as a provider, without the `.Provider` — see Q49.)

---

### Q15: useRef vs useState?

**Answer:**

**useState:**
- Triggers re-render on change
- For UI data

**useRef:**
- Doesn't trigger re-render
- Persists across renders
- For DOM access or mutable values

```jsx
function Component() {
  const [count, setCount] = useState(0); // Re-renders
  const countRef = useRef(0); // No re-render
  
  const inputRef = useRef(); // DOM access
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return <input ref={inputRef} />;
}
```

---

### Q16: What is useCallback?

**Answer:**
`useCallback` memoizes a function reference so it doesn't get recreated on every render — useful when that function is passed to a `React.memo`-wrapped child, since a new reference would otherwise defeat the memoization.

```jsx
// Without useCallback: a brand-new function every render,
// which breaks memo() on Child below
function ParentWithoutMemo() {
  const [count, setCount] = useState(0);
  const handleClick = () => console.log('clicked');
  return <Child onClick={handleClick} />;
}

// With useCallback: same function reference across renders
// (as long as deps don't change), so Child can actually skip re-rendering
function ParentWithMemo() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Only recreates if dependencies change

  return <Child onClick={handleClick} />;
}

const Child = memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
```

---

### Q17: What is useMemo?

**Answer:**
`useMemo` memoizes an expensive **computed value**.

```jsx
function Component({ a, b }) {
  const expensiveValue = useMemo(() => {
    console.log('Computing...');
    return a * b * 1000000;
  }, [a, b]); // Only recomputes when a or b change
  
  return <div>{expensiveValue}</div>;
}
```

**useMemo vs useCallback:**
- `useMemo(fn, deps)` calls `fn` and memoizes its **return value**
- `useCallback(fn, deps)` memoizes **`fn` itself**, without calling it

They're related: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)` — a `useMemo` whose factory just returns the function unchanged, rather than a computed result.

```jsx
useCallback(fn, deps)        // memoizes and returns fn itself
useMemo(() => fn, deps)      // equivalent — the factory returns fn, not fn()
useMemo(() => fn(), deps)    // different! this calls fn and memoizes its result
```

---

### Q18: Rules of Hooks?

**Answer:**

1. **Only call hooks at the top level**
   - Don't call inside loops, conditions, or nested functions
   
2. **Only call hooks from React functions**
   - Functional components
   - Custom hooks

```jsx
// ❌ Wrong
function Component() {
  if (condition) {
    const [state, setState] = useState(0); // Conditional!
  }
  
  for (let i = 0; i < 3; i++) {
    useEffect(() => {}); // Loop!
  }
}

// ✅ Correct
function Component() {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    if (condition) {
      // Use condition inside hook
    }
  });
}
```

Install `eslint-plugin-react-hooks` — it catches most violations of this rule automatically, which is why it's rarely a bug in practice on a properly-linted codebase.

---

### Q19: Create a custom hook

**Answer:**

```jsx
// useLocalStorage hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [value, setStoredValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');
  
  return (
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  );
}
```

---

## Performance Optimization

### Q20: How to optimize React performance?

**Answer:**

**1. React.memo**
```jsx
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Heavy rendering */}</div>;
});
```

**2. useMemo for expensive calculations**
```jsx
const result = useMemo(() => heavyCalculation(data), [data]);
```

**3. useCallback for functions**
```jsx
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

**4. Lazy loading**
```jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

**5. Code splitting**
```jsx
<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

**6. Virtualization (long lists)**
```jsx
import { FixedSizeList } from 'react-window';
```

**7. Proper keys in lists**
```jsx
{items.map(item => <Item key={item.id} {...item} />)}
```

**8. Avoid inline functions where it actually matters**
```jsx
// Fine on a plain DOM element — no memo() below it to break
<button onClick={() => handleClick(id)}>

// Matters when passed to a memoized child, since a new reference each render
// defeats the memoization
const onClick = useCallback(() => handleClick(id), [id]);
<MemoizedChild onClick={onClick}>
```

A good interview answer here isn't "always memoize" — it's "measure with the Profiler first, then apply the specific technique that addresses the measured bottleneck." Over-memoizing has its own cost (extra comparisons on every render) and is a common junior mistake to over-correct into.

---

### Q21: What is React.memo?

**Answer:**
`React.memo` is a higher-order component that memoizes component output based on props — it skips re-rendering if props are shallow-equal to the last render.

```jsx
const MyComponent = memo(function MyComponent({ name }) {
  console.log('Rendering...');
  return <div>{name}</div>;
});

// Custom comparison
const MyComponent = memo(({ data }) => {
  return <div>{data.name}</div>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  return prevProps.data.id === nextProps.data.id;
});
```

**When to use:**
- Pure components that render often with the same props
- Components with expensive rendering
- Paired with `useCallback`/`useMemo` upstream — otherwise new prop references each render make `memo` a no-op

---

### Q22: Keys in React - Why important?

**Answer:**
Keys help React identify which items changed, were added, or removed.

```jsx
// ❌ Bad: Using index
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ✅ Good: Using unique ID
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

**Problems with index keys:**
- Wrong component state after reordering
- Performance issues
- Incorrect focus management

```jsx
// Example of key problem
const [items, setItems] = useState(['A', 'B', 'C']);

// User clicks "Remove B"
// With index keys: C becomes key=1 (was 2), causes wrong state
// With ID keys: C keeps its identity
```

Index keys are acceptable only when the list is static and never reordered/filtered — e.g. a hard-coded list rendered once. For anything dynamic, use a stable ID.

---

## Advanced Concepts

### Q23: What is Context API?

**Answer:**
Context provides a way to pass data through the component tree without prop drilling.

```jsx
// 1. Create Context
const UserContext = createContext();

// 2. Provider
function App() {
  const [user, setUser] = useState({ name: 'Alice' });
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

// 3. Consumer
function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

**When to use:**
- Theme data
- User authentication
- Language preferences
- NOT for frequent updates (use state management library) — every value change re-renders every consumer

---

### Q24: What are Error Boundaries?

**Answer:**
Error Boundaries catch JavaScript errors during rendering in child components and display fallback UI.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Limitations:**
- Only class components (no hook equivalent yet)
- Don't catch errors in event handlers (use try/catch there instead)
- Don't catch errors in async code
- Don't catch errors thrown in the boundary component itself

---

### Q25: Higher-Order Components (HOC)?

**Answer:**
HOC is a pattern where a function takes a component and returns a new component.

```jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

**Modern Alternative:** Custom Hooks
```jsx
function useAuth() {
  const [user, setUser] = useState(null);
  // Auth logic
  return user;
}

function Dashboard() {
  const user = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <div>Dashboard</div>;
}
```

HOCs still show up in older codebases and some libraries, but for new code, custom hooks are almost always the more direct tool — worth knowing HOCs exist and why hooks largely replaced them (no wrapper hell, no prop name collisions, no `ref` forwarding gymnastics).

---

### Q26: Render Props pattern?

**Answer:**
Sharing code between components using a prop whose value is a function.

```jsx
// Render Props Component
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return render(position);
}

// Usage
<Mouse render={({ x, y }) => (
  <div>Mouse at {x}, {y}</div>
)} />
```

**Modern Alternative:** Custom Hooks
```jsx
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Same logic
  return position;
}

function Component() {
  const { x, y } = useMouse();
  return <div>Mouse at {x}, {y}</div>;
}
```

---

### Q27: What is Portals?

**Answer:**
Portals render children into a DOM node outside the parent hierarchy.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// index.html
<body>
  <div id="root"></div>
  <div id="modal-root"></div>
</body>
```

**Use cases:**
- Modals
- Tooltips
- Dropdowns
- Notifications

Note: events still bubble through the React tree (not the DOM tree) for portalled content — a click inside a portal will still trigger an `onClick` on a React-tree ancestor, even though the DOM node lives elsewhere.

---

### Q28: Fragments - Why use them?

**Answer:**
Fragments let you group children without adding extra DOM nodes.

```jsx
// ❌ Adds extra div
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Text</p>
    </div>
  );
}

// ✅ No extra DOM node
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Text</p>
    </>
  );
}

// With key (when mapping)
{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}
```

(The shorthand `<>...</>` can't take a `key` — use the explicit `<Fragment key={...}>` whenever you're mapping.)

---

## Routing & Navigation

### Q29: How does React Router work?

**Answer:**

```jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/123">User 123</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Access params
function User() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}

// Programmatic navigation
function LoginButton() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // After login
    navigate('/dashboard');
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

Recent React Router versions (v6.4+/v7) also support a data-loading API (`loader`, `action` per route, `useLoaderData()`) that moves data fetching out of components and into the route definition — worth mentioning if the interviewer is probing for current router knowledge rather than just the basics above.

---

## State Management

### Q30: Redux vs Context API?

**Answer:**

**Context API:**
- Built into React
- Simple, no extra dependencies
- Good for low-frequency updates (theme, auth)
- Can cause unnecessary re-renders

**Redux (via Redux Toolkit today, not hand-rolled Redux):**
- Predictable state management
- DevTools for debugging (time-travel, action log)
- Middleware support
- Better for complex, cross-cutting state logic
- Redux Toolkit (`@reduxjs/toolkit`) is the officially recommended way to write Redux now — it removes most of the boilerplate the classic pattern required (see Q45)

```jsx
// Context (simple state)
const ThemeContext = createContext();

// Redux Toolkit (complex state)
const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});
```

---

## Testing

### Q31: How to test React components?

**Answer:**

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Component
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Test
test('increments counter', () => {
  render(<Counter />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  
  fireEvent.click(button);
  
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});

// Async test
test('loads data', async () => {
  render(<UserList />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });
});
```

Testing Library's philosophy — query by role/label/text the way a user would, not by internal state or implementation detail — is itself a common interview talking point; be ready to explain *why* (tests stay valid through refactors that don't change behavior).

---

## Real-World Scenarios

### Q32: How to handle API calls?

**Answer:**

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchUser();
    
    return () => {
      cancelled = true; // Cleanup — prevents setting state from a stale/out-of-order request
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;
  
  return <div>{user.name}</div>;
}
```

**Better approach with TanStack Query** (handles caching, race conditions, and refetching for you — this is the answer to lead with in an interview if asked "how would you actually do this in production"):
```jsx
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}
```

---

### Q33: Debouncing search input?

**Answer:**

```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults);
    }
  }, [debouncedQuery]);
  
  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}

// useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

### Q34: Infinite scroll implementation?

**Answer:**

```jsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef();
  const lastItemRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`/api/items?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setItems(prev => [...prev, ...data.items]);
        setHasMore(data.hasMore);
        setLoading(false);
      });
  }, [page]);
  
  return (
    <div>
      {items.map((item, index) => {
        if (items.length === index + 1) {
          return <div ref={lastItemRef} key={item.id}>{item.name}</div>;
        }
        return <div key={item.id}>{item.name}</div>;
      })}
      {loading && <div>Loading...</div>}
    </div>
  );
}
```

---

### Q35: Form validation?

**Answer:**

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit form
    console.log('Form submitted:', formData);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      
      <div>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

**Better approach with React Hook Form** (uncontrolled by default — fewer re-renders on large forms — and the current default recommendation over Formik for new projects):
```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Required', pattern: /\S+@\S+\.\S+/ })} />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Architecture & Best Practices

### Q36: How to structure a React project?

**Answer:**

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   └── Modal/
│   ├── features/        # Feature-based components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── profile/
│   └── layouts/         # Layout components
├── hooks/               # Custom hooks
├── services/            # API calls, external services
├── utils/               # Helper functions
├── constants/           # App constants
├── contexts/            # React contexts
├── store/               # Redux store (if using)
└── pages/               # Page components
```

**Best Practices:**
- Feature-based organization
- One component per file
- Index files for clean imports
- Separation of concerns

---

### Q37: How to handle authentication?

**Answer:**

```jsx
// Auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token).then(userData => {
        setUser(userData);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email, password) => {
    const { user: userData, token } = await loginAPI(email, password);
    localStorage.setItem('token', token);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = { user, login, logout, loading };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  if (loading) return <div>Loading...</div>;
  
  return user ? children : null;
}
```

A note worth raising in interview: storing tokens in `localStorage` is convenient but exposed to XSS. An `HttpOnly` cookie (set by the server) is the more defensible choice for the auth token itself when the threat model includes untrusted third-party scripts.

---

### Q38: Code splitting best practices?

**Answer:**

**1. Route-based splitting:**
```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**2. Component-based splitting:**
```jsx
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Analytics() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>
      
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

**3. Prefetching:**
```jsx
const prefetchSettings = () => {
  import('./pages/Settings');
};

<Link to="/settings" onMouseEnter={prefetchSettings}>
  Settings
</Link>
```

---

### Q39: How to handle errors globally?

**Answer:**

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// API error handling hook
function useApiErrorHandler() {
  const [error, setError] = useState(null);
  
  const handleError = (error) => {
    setError(error);
    
    if (error.response?.status === 401) {
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
  };
  
  const clearError = () => setError(null);
  
  return { error, handleError, clearError };
}
```

---

## React 18 Features

### Q40: What's new in React 18?

**Answer:**

**1. Concurrent Rendering root API:**
```jsx
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

**2. Automatic Batching everywhere** (see Q10)

**3. Transitions:**
```jsx
import { useTransition } from 'react';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    startTransition(() => {
      setResults(searchAPI(value));
    });
  };
  
  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Loading...</span>}
      <Results data={results} />
    </div>
  );
}
```

**4. New Hooks:**
```jsx
// useId - for generating unique, hydration-safe IDs
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react" />
    </>
  );
}

// useSyncExternalStore - for subscribing to external (non-React) stores safely
function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
```

---

### Q41: What are Concurrent Features?

**Answer:**
Concurrent React allows rendering to be interruptible, enabling better user experience under load.

**Key Concepts:**
- **Suspense**: Declaratively specify loading states
- **Transitions**: Distinguish between urgent (typing) and non-urgent (results list) updates
- **Batching**: Group multiple state updates into a single re-render

```jsx
function TabContainer() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();
  
  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab); // Non-urgent update — UI stays responsive while it processes
    });
  }
  
  return (
    <>
      <TabButton isActive={tab === 'home'} onClick={() => selectTab('home')}>
        Home
      </TabButton>
      <TabButton isActive={tab === 'about'} onClick={() => selectTab('about')}>
        About
      </TabButton>
    </>
  );
}
```

---

### Q42: Server-Side Rendering (SSR) with React 18

**Answer:**

```jsx
// Client
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
hydrateRoot(container, <App />);

// Server (Node.js)
import { renderToPipeableStream } from 'react-dom/server';

app.get('*', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    }
  });
});
```

In practice today, most teams reach for a framework (Next.js, React Router's framework mode) rather than hand-rolling `renderToPipeableStream` — worth knowing the primitive exists, but the framework-level answer is usually the more relevant one in an interview about production SSR.

---

## Advanced Patterns

### Q43: Compound Components Pattern

**Answer:**
Compound components are components that work together as a group, sharing implicit state through context.

```jsx
const SelectContext = createContext();

function Select({ children, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const contextValue = { value, onChange, isOpen, setIsOpen };
  
  return (
    <SelectContext.Provider value={contextValue}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  );
}

function Option({ children, value }) {
  const { value: selectedValue, onChange, setIsOpen } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  
  const handleClick = () => {
    onChange(value);
    setIsOpen(false);
  };
  
  return (
    <div className={`option ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {children}
    </div>
  );
}

function Trigger() {
  const { value, isOpen, setIsOpen } = useContext(SelectContext);
  return (
    <div className="trigger" onClick={() => setIsOpen(!isOpen)}>
      {value || 'Select...'}
    </div>
  );
}

Select.Option = Option;
Select.Trigger = Trigger;

// Usage
<Select value={selected} onChange={setSelected}>
  <Select.Trigger />
  <Select.Option value="apple">Apple</Select.Option>
  <Select.Option value="banana">Banana</Select.Option>
</Select>
```

---

### Q44: Render Props vs Custom Hooks

**Answer:**

**Render Props (Legacy):**
```jsx
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url).then(res => res.json()).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [url]);
  
  return render({ data, loading });
}

<DataFetcher
  url="/api/users"
  render={({ data, loading }) => (
    loading ? <div>Loading...</div> : <UserList users={data} />
  )}
/>
```

**Custom Hooks (Modern):**
```jsx
function useData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url).then(res => res.json()).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [url]);
  
  return { data, loading };
}

function UserList() {
  const { data, loading } = useData('/api/users');
  if (loading) return <div>Loading...</div>;
  return <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>;
}
```

Custom hooks won out because they compose without nesting — three render-prop components wrapping each other becomes unreadable ("wrapper hell"), while three custom hooks are just three lines at the top of a function.

---

### Q45: State Management Patterns

**Answer:**

**1. Local State:**
```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
}
```

**2. Lifted State:**
```jsx
function Parent() {
  const [sharedData, setSharedData] = useState(null);
  return (
    <>
      <ChildA data={sharedData} onUpdate={setSharedData} />
      <ChildB data={sharedData} />
    </>
  );
}
```

**3. Context API:**
```jsx
const AppStateContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const value = { user, setUser, theme, setTheme };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
```

**4. Redux Toolkit** (the current standard way to write Redux — not the old hand-rolled `switch`-statement reducer pattern):
```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; }, // Immer under the hood — "mutation" here is safe
    decrement: (state) => { state.value -= 1; },
  },
});

export const { increment, decrement } = counterSlice.actions;
const store = configureStore({ reducer: { counter: counterSlice.reducer } });

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(increment())}>Count: {count}</button>;
}
```

**5. Zustand (lighter-weight alternative, less boilerplate than Redux):**
```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## React 19 Features

### Q46: What's new in React 19?

**Answer:**

**1. Actions and `useActionState`** — first-class support for async transitions tied to forms, replacing the manual `loading`/`error`/`data` state triad:
```jsx
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const result = await updateName(formData.get('name'));
  return result.error ? { error: result.error } : { success: true };
}, null);

<form action={formAction}>
  <input name="name" />
  <button disabled={isPending}>Update</button>
</form>
```

**2. `useOptimistic`** — show an optimistic UI state while an async action is in flight, automatically reverting on failure:
```jsx
const [optimisticName, setOptimisticName] = useOptimistic(name);

async function submitAction(formData) {
  const newName = formData.get('name');
  setOptimisticName(newName);
  await updateName(newName);
}
```

**3. `use()`** — reads a promise or context value, and unlike other hooks it can be called conditionally or in a loop:
```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise); // Suspends until resolved
  return comments.map((c) => <p key={c.id}>{c.text}</p>);
}
```

**4. `ref` as a plain prop** — `forwardRef` is no longer required for function components to accept a `ref`:
```jsx
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

**5. Simplified Context provider syntax** — a context object can be rendered directly, without `.Provider`:
```jsx
const ThemeContext = createContext('light');

// React 19
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

**6. The React Compiler** — a build-time tool (currently opt-in) that automatically memoizes components and values, aiming to make manual `useMemo`/`useCallback`/`React.memo` largely unnecessary. Understanding *why* memoization is needed (Q16/Q17/Q20/Q21) is still the fundamental interview knowledge — the compiler automates applying it, it doesn't remove the underlying concept.

---

## Final Tips for React Interviews

### Q47: Common Interview Mistakes to Avoid

**Answer:**

1. **Not understanding the Virtual DOM**
   - Explain how it works and why it's beneficial

2. **Confusing state and props**
   - State: internal, mutable
   - Props: external, immutable

3. **Not knowing when to use useMemo/useCallback**
   - Don't over-optimize
   - Use when there are actual, measured performance issues

4. **Poor component structure**
   - Follow single responsibility principle
   - Use proper separation of concerns

5. **Not testing your code**
   - Be familiar with testing approaches
   - Understand what to test (behavior, not implementation)

6. **Answering with outdated patterns**
   - If asked "how would you fetch data" or "how would you manage state," lead with the current standard (TanStack Query, Redux Toolkit) and mention the manual approach as the "how it works under the hood," not the other way around

### Q48: How to approach React coding challenges?

**Answer:**

1. **Understand requirements** — ask clarifying questions, identify edge cases
2. **Plan your component structure** — break down into smaller components, identify state and props
3. **Start with basic implementation** — make it work first, then optimize
4. **Add features incrementally** — state management, event handling, error handling, loading states
5. **Optimize and refactor** — identify performance bottlenecks, use proper keys, memoize only when necessary
6. **Test your solution** — check different scenarios, verify edge cases

```jsx
// Example: Build a todo list
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

(Note: `onKeyPress` is deprecated — use `onKeyDown` for key-event handling, as shown above.)

---

This comprehensive React interview guide covers everything from fundamental concepts to advanced patterns and real-world scenarios. Practice these concepts, understand the underlying principles, and you'll be well-prepared for your React interviews!

Remember: The goal is not just to memorize answers, but to understand the "why" behind each concept. Good luck!
