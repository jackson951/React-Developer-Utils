### 📘 **File:** `notes/ecosystem/testing-library.md`

````markdown
# 🧪 React Testing Library (RTL) — Complete Guide

> **React Testing Library (RTL)** focuses on testing components the way users interact with them — not implementation details.

---

## 🚀 1. Installation

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```
````

For **Vite** projects:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

If you’re using **TypeScript**:

```bash
npm install --save-dev @types/jest @types/testing-library__jest-dom
```

---

## ⚙️ 2. Setup (Vite + Vitest Example)

Add a testing configuration:

**`vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
```

**`src/setupTests.js`**

```js
import "@testing-library/jest-dom";
```

---

## 🧱 3. Your First Test

**`src/components/Counter.jsx`**

```jsx
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

**`src/components/__tests__/Counter.test.jsx`**

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "../Counter";

test("increments counter when button clicked", async () => {
  render(<Counter />);
  const button = screen.getByRole("button", { name: /increment/i });
  await userEvent.click(button);
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

✅ **What happened?**

- `render()` mounts your component in a virtual DOM.
- `screen` queries elements the way users see them.
- `userEvent` simulates real interactions (click, type, tab, etc).

---

## 🔍 4. Common Query Methods

| Query                  | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `getByText`            | Finds element by visible text (throws if not found) |
| `queryByText`          | Returns `null` if not found                         |
| `findByText`           | Returns promise — for async UI                      |
| `getByRole`            | Finds element by ARIA role (recommended)            |
| `getByLabelText`       | Finds form fields by label                          |
| `getByPlaceholderText` | Finds inputs by placeholder                         |
| `getAllByRole`         | Finds multiple matching elements                    |

Example:

```js
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText("Username");
screen.findByText(/loading/i);
```

---

## ⚙️ 5. Testing Asynchronous Code

**`src/components/FetchUser.jsx`**

```jsx
import { useEffect, useState } from "react";

export default function FetchUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  if (!user) return <p>Loading...</p>;
  return <h2>Hello {user.name}</h2>;
}
```

**`FetchUser.test.jsx`**

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import FetchUser from "../FetchUser";

beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ name: "Jackson" }),
    })
  );
});

test("displays user after fetch", async () => {
  render(<FetchUser />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(screen.getByText(/jackson/i)).toBeInTheDocument());
});
```

✅ Use `waitFor` or `findBy...` for async expectations.

---

## 🧰 6. Testing Forms and Input

**`Form.jsx`**

```jsx
import { useState } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
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

**`Form.test.jsx`**

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../Form";

test("submits name correctly", async () => {
  render(<Form />);
  const input = screen.getByLabelText(/name/i);
  await userEvent.type(input, "Jackson");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(screen.getByText(/submitted: jackson/i)).toBeInTheDocument();
});
```

---

## 🧩 7. Mocking API Calls with MSW

Mocking API responses is best done with **Mock Service Worker (MSW)**.

```bash
npm install msw --save-dev
```

**`src/mocks/handlers.js`**

```js
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/user", () => HttpResponse.json({ name: "Mocked Jackson" })),
];
```

**`src/mocks/server.js`**

```js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

**`src/setupTests.js`**

```js
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

✅ MSW intercepts `fetch`/`axios` requests and returns fake data for consistent tests.

---

## 🧠 8. Testing Context + Providers

```jsx
// ThemeContext.js
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**Test:**

```jsx
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../ThemeContext";

function TestComponent() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <p>{theme}</p>
      <button onClick={toggle}>Switch</button>
    </div>
  );
}

test("toggles theme", async () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
  await userEvent.click(screen.getByRole("button", { name: /switch/i }));
  expect(screen.getByText(/dark/i)).toBeInTheDocument();
});
```

---

## 📦 9. Custom Render Utility

If your components always need context/providers, make a wrapper:

**`test-utils.js`**

```js
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../context/ThemeContext";

const queryClient = new QueryClient();

const customRender = (ui, options) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>,
    options
  );

export * from "@testing-library/react";
export { customRender as render };
```

Now in tests:

```js
import { render, screen } from "../test-utils";
```

---

## 🧱 10. Common Matchers (from `@testing-library/jest-dom`)

| Matcher                | Example                                         |
| ---------------------- | ----------------------------------------------- |
| `.toBeInTheDocument()` | `expect(element).toBeInTheDocument()`           |
| `.toHaveTextContent()` | `expect(el).toHaveTextContent("Submit")`        |
| `.toBeVisible()`       | `expect(button).toBeVisible()`                  |
| `.toBeDisabled()`      | `expect(input).toBeDisabled()`                  |
| `.toHaveAttribute()`   | `expect(link).toHaveAttribute("href", "/home")` |
| `.toHaveClass()`       | `expect(div).toHaveClass("active")`             |

---

## 🧭 11. Organizing Tests

```
src/
├── components/
│   ├── Button.jsx
│   ├── __tests__/
│   │   └── Button.test.jsx
├── hooks/
│   ├── useFetch.js
│   └── __tests__/useFetch.test.js
├── context/
│   ├── ThemeContext.js
│   └── __tests__/ThemeContext.test.js
└── utils/
    ├── formatDate.js
    └── __tests__/formatDate.test.js
```

---

## 💡 12. Best Practices

✅ Test behavior, not implementation
✅ Use `getByRole` over `getByTestId`
✅ Prefer **userEvent** over `fireEvent`
✅ Keep tests small and focused
✅ Name test files as `<Component>.test.jsx`
✅ Don’t test 3rd-party libraries (mock them)
✅ Don’t use snapshot testing for dynamic UI
✅ Use `await screen.findBy...` for async rendering

---

## 🧰 13. Debugging

```js
screen.debug(); // Logs current DOM state
```

You can also pass a specific element:

```js
screen.debug(screen.getByRole("button"));
```

---

## 🧠 14. Running Tests

**With Vitest:**

```bash
npx vitest
```

**Watch mode:**

```bash
npx vitest --watch
```

**With Jest:**

```bash
npm test
```

---

## 🔗 15. Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
- [Vitest Docs](https://vitest.dev)
- [MSW Docs](https://mswjs.io/docs)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Playground](https://testing-playground.com/)

---

✅ **Summary**

> Test your React components the way users use them — not how they’re built.
> Use **React Testing Library** for accessibility-first, maintainable tests.
> Combine it with **MSW** and **Vitest/Jest** for a production-grade test setup.
