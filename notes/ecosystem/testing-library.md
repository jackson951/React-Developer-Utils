# 🧪 React Testing Library (RTL) — Complete Guide

> **React Testing Library (RTL)** focuses on testing components the way users interact with them — not implementation details.  
> It encourages accessible, maintainable tests that give you confidence in your UI.

---

## 🚀 1. Installation

### Choose your test runner:

```bash
# Vitest (recommended for Vite projects)
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Jest (with Create React App or custom setup)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**TypeScript users** (optional but helpful):

```bash
npm install --save-dev @types/jest @testing-library/jest-dom/vitest # or /jest
```

> 📦 **@testing-library/react** works with any test runner; we'll use **Vitest** for examples.

---

## ⚙️ 2. Setup (Vite + Vitest Example)

**`vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,             // so you don't need to import `describe`, `it`, `expect`
    environment: "jsdom",      // browser-like DOM
    setupFiles: "./src/setupTests.ts",
    css: true,                 // optional: process CSS imports
  },
});
```

**`src/setupTests.ts`**

```ts
import "@testing-library/jest-dom/vitest"; // adds custom matchers (toBeInTheDocument, etc.)
```

Add a `test` script to `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:watch": "vitest --watch"
}
```

---

## 🧱 3. Your First Test

**Component (`Counter.tsx`)**

```tsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

**Test (`Counter.test.tsx`)**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

test("increments counter when button is clicked", async () => {
  render(<Counter />);

  const button = screen.getByRole("button", { name: /increment/i });
  await userEvent.click(button);

  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

✅ **What’s happening?**  
- `render()` mounts your component in a simulated DOM.  
- `screen` gives you query methods that mirror how a real user finds elements.  
- `userEvent` simulates realistic interactions (click, type, tab).  
- `@testing-library/jest-dom` matchers like `toBeInTheDocument()` provide readable assertions.

---

## 🔍 4. Query Methods Cheat Sheet

| Query Type | Throws if not found | Returns null if not found | Returns promise (async) |
|------------|---------------------|----------------------------|--------------------------|
| `getBy...` | ✅                  | ❌                         | ❌                       |
| `queryBy...` | ❌                | ✅                         | ❌                       |
| `findBy...` | ❌                | ❌                         | ✅                       |

### Most used queries (prefer `byRole` whenever possible)

- `getByRole(role, options?)` – e.g., `screen.getByRole("button", { name: /submit/i })`
- `getByLabelText(text)` – for inputs with associated `<label>`
- `getByPlaceholderText(text)`
- `getByText(text)`
- `getByTestId(id)` – **last resort**, use only when no other query fits

Example:

```tsx
const emailInput = screen.getByLabelText(/email/i);
const submitBtn = screen.getByRole("button", { name: /submit/i });
const successMsg = await screen.findByText(/thank you/i);
```

---

## ⚙️ 5. Testing Asynchronous Code

When your component performs async operations (data fetching, timers, etc.), use `findBy` or `waitFor`.

**`FetchUser.tsx`**

```tsx
import { useEffect, useState } from "react";

export default function FetchUser() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  if (!user) return <p>Loading...</p>;
  return <h2>Hello {user.name}</h2>;
}
```

**Test with mocked fetch**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import FetchUser from "./FetchUser";

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: "Jackson" }),
  });
});

test("displays user after fetch", async () => {
  render(<FetchUser />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Using findByText (returns promise)
  const greeting = await screen.findByText(/hello jackson/i);
  expect(greeting).toBeInTheDocument();
});

// Alternative with waitFor:
// await waitFor(() => expect(screen.getByText(/hello jackson/i)).toBeInTheDocument());
```

✅ Always clean up mocks (`afterEach(() => vi.restoreAllMocks())`) or use `beforeEach` to reset.

---

## 🧰 6. Testing Forms

```tsx
// Form.tsx
import { useState, type FormEvent } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Submit</button>
      {submitted && <p>Submitted: {name}</p>}
    </form>
  );
}
```

**Test:**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";

test("submits name correctly", async () => {
  render(<Form />);

  const input = screen.getByLabelText(/name/i);
  await userEvent.type(input, "Jackson");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(screen.getByText(/submitted: jackson/i)).toBeInTheDocument();
});
```

---

## 🧩 7. Mocking API Calls with MSW (Mock Service Worker)

MSW intercepts network requests at the service worker level, giving you full control without mocking `fetch` globally.

```bash
npm install msw --save-dev
```

**`src/mocks/handlers.ts`**

```ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/user", () => HttpResponse.json({ name: "Mocked Jackson" })),
];
```

**`src/mocks/server.ts`**

```ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

**`src/setupTests.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Now any `fetch("/api/user")` in your tests will return the mocked data.  
✅ MSW works with both `fetch` and `axios` — no more manual mocking!

---

## 🧠 8. Testing Components with Providers

Wrap your component with required contexts / providers in the test.

```tsx
// ThemeContext.tsx (simplified)
import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("Missing ThemeProvider");
  return ctx;
};
```

**Test:**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeContext";

function TestComponent() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <p>Current: {theme}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

test("toggles theme", async () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  await userEvent.click(screen.getByRole("button", { name: /toggle/i }));
  expect(screen.getByText(/current: dark/i)).toBeInTheDocument();
});
```

---

## 📦 9. Custom Render with Providers (Test Utils)

To avoid repeating provider wrappers in every test, create a custom `render`.

**`test-utils.tsx`**

```tsx
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

Now in tests:

```tsx
import { render, screen } from "../test-utils";
// uses the same providers as your app
```

---

## 🧪 10. Testing Custom Hooks with `renderHook`

RTL provides a `renderHook` utility for testing hooks in isolation.

```ts
// useCounter.ts
import { useState } from "react";
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  return { count, increment, decrement };
}
```

**Test:**

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

✅ Works with hooks that call other hooks, contexts, etc. — just provide a `wrapper` if needed.

---

## 🧱 11. Common Matchers (from `@testing-library/jest-dom`)

| Matcher | Example |
|--------|---------|
| `.toBeInTheDocument()` | `expect(element).toBeInTheDocument()` |
| `.toHaveTextContent()` | `expect(el).toHaveTextContent("Submit")` |
| `.toBeVisible()` | `expect(button).toBeVisible()` |
| `.toBeDisabled()` | `expect(input).toBeDisabled()` |
| `.toHaveAttribute()` | `expect(link).toHaveAttribute("href", "/home")` |
| `.toHaveClass()` | `expect(div).toHaveClass("active")` |
| `.toHaveValue()` | `expect(input).toHaveValue("Jackson")` |

---

## 🧭 12. Project Structure & Naming

```
src/
├── components/
│   ├── Counter.tsx
│   └── __tests__/
│       └── Counter.test.tsx
├── hooks/
│   ├── useAuth.ts
│   └── __tests__/
│       └── useAuth.test.ts
├── context/
│   ├── ThemeContext.tsx
│   └── __tests__/
│       └── ThemeContext.test.tsx
└── utils/
    ├── formatDate.ts
    └── __tests__/
        └── formatDate.test.ts
```

✅ Tests co-located with source files (or in a central `__tests__` folder, pick one and be consistent).

---

## 💡 13. Best Practices (2025)

- **Test user behavior**, not implementation (no shallow renders, no testing state directly).
- **Prefer `getByRole`** — it enforces accessibility.
- **Use `userEvent`** instead of `fireEvent` (more realistic).
- **Keep tests small** — one flow per test.
- **Mock API calls at the network level** (MSW), not module level.
- **Avoid snapshot tests** for dynamic content — they break easily and hide intent.
- **Test error and loading states** as well as happy paths.
- **Use `screen.debug()`** only for debugging, not in committed tests.
- **When testing Server Components** (Next.js App Router), test the **client components** that receive props; RSC itself is tested via E2E/Playwright.

---

## 🧰 14. Debugging

```tsx
screen.debug();                      // logs the entire DOM
screen.debug(screen.getByRole("button")); // logs a specific element
```

In Vitest, you can also use `screen.logTestingPlaygroundURL()` to open a visual selector in the browser.

---

## 🧠 15. Running Tests

```bash
npm test          # run once
npm run test:watch # watch mode
```

For coverage:

```bash
npx vitest --coverage   # (requires @vitest/coverage-v8)
```

---

## 🔗 16. Essential Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
- [Vitest Docs](https://vitest.dev)
- [MSW Docs](https://mswjs.io/docs)
- [Common Mistakes with RTL (Kent C. Dodds)](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Playground](https://testing-playground.com) (helps choose the right query)
- [Testing Custom Hooks](https://react-hooks-testing-library.com/)

---

## ✅ Summary

> RTL helps you write **confident, user‑centric** tests.  
> Avoid testing implementation details; focus on what the user sees and does.  
> Combine it with **Vitest**, **MSW**, and **userEvent** for a modern, robust testing stack.  
> Your tests should give you the courage to refactor and ship faster.
```
