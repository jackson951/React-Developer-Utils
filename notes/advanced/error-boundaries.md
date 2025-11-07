# 🛡️ `error-boundaries.md`

_Graceful failure in React apps — beyond the basics._

> ✅ **Last Updated**: November 7, 2025  
> 📌 **TL;DR**:
>
> - Error boundaries **only catch errors in child components’ lifecycle/render** — _not_ in event handlers, async code, or Server Components.
> - Always log errors (Sentry, etc.) + show user-friendly UI.
> - In Next.js: Combine with `error.tsx`, `global-error.tsx`, and Server Actions for full coverage.
> - Never let an app crash silently.

---

## 🔍 What Is an Error Boundary?

An **error boundary** is a React component that catches JavaScript errors anywhere in its child component tree, logs them, and displays a fallback UI instead of crashing the whole app.

It uses two lifecycle methods (class-based only — _no hook equivalent_):

- `static getDerivedStateFromError(error)` → render fallback UI
- `componentDidCatch(error, info)` → log error

> ⚠️ **Critical Limitation**:  
> Error boundaries **do not catch**:
>
> - Errors in **event handlers** (e.g., `onClick`)
> - Errors in **asynchronous code** (`setTimeout`, `fetch.then`)
> - Errors in **Server Components**
> - Errors thrown in the error boundary itself

---

## ✅ Basic Implementation (Class Component)

```tsx
// ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service (e.g., Sentry)
    console.error("React Error Boundary caught:", error, errorInfo);
    // In production:
    // Sentry.captureException(error, { extra: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>❌ Something went wrong.</h2>
          <p>We’re sorry — this part of the app failed to load.</p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre>{this.state.error.stack}</pre>
          )}
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage**:

```tsx
<ErrorBoundary>
  <UserProfile userId="123" />
</ErrorBoundary>
```

✅ **Best Practice**: Wrap **feature-level components** (e.g., `<Dashboard>`, `<SettingsTab>`), not the entire app.

---

## 🧩 Advanced Patterns

### 1. **Reset + Recovery Flow**

Allow users to retry _without_ full page reload:

```tsx
// In render():
{
  this.state.hasError ? (
    <div>
      <ErrorDisplay error={this.state.error} />
      <button onClick={() => this.setState({ hasError: false })}>
        ↻ Retry this section
      </button>
      <button onClick={() => window.location.reload()}>
        🌐 Reload entire page
      </button>
    </div>
  ) : (
    this.props.children
  );
}
```

### 2. **Context-Aware Fallbacks**

Show different UI based on context (e.g., modal vs page):

```tsx
<ErrorBoundary fallback={<InlineError />} scope="inline">
  <Widget />
</ErrorBoundary>

<ErrorBoundary fallback={<FullPageError />} scope="page">
  <MainContent />
</ErrorBoundary>
```

### 3. **Error Boundary + Suspense Combo**

Handle both loading _and_ error states:

```tsx
<Suspense fallback={<Loader />}>
  <ErrorBoundary>
    <UserProfile />
  </ErrorBoundary>
</Suspense>
```

> 📝 Note: `Suspense` catches promise rejections from `async` Server Components — _not_ JavaScript errors.

---

## ⚠️ Error Boundaries & Server Components (RSC)

### ❗ Key Reality:

- **Server Components run on the server** → errors become HTTP 500s **before** reaching the client.
- **Client Components** can use error boundaries — but only for _client-side_ errors.

### ✅ Next.js Strategy (App Router)

Use **file-based error UIs** instead of (or alongside) class boundaries:

| File                   | Scope         | Catches                                                          |
| ---------------------- | ------------- | ---------------------------------------------------------------- |
| `app/error.tsx`        | Route segment | Errors in _Client Components_ + _Server Component data fetching_ |
| `app/global-error.tsx` | Entire app    | Unhandled errors (e.g., layout crashes)                          |
| `app/layout.tsx`       | Layout-level  | Wrap with `<ErrorBoundary>` for client-only errors               |

#### Example: `app/error.tsx`

```tsx
"use client"; // ← Required

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service
    console.error(error);
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="error-page">
      <h2>🚨 Oops! Something broke.</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

> ✅ **Pro Tip**:
>
> - `reset()` re-renders the route — perfect for transient errors (network flake).
> - `error.digest` is a stable ID for grouping errors in logs.

---

## 🛠️ Production-Grade Error Handling

### 1. **Logging & Monitoring**

- [ ] Integrate **Sentry**, **LogRocket**, or **Honeybadger**
- [ ] Capture:
  - Error message + stack
  - User ID (if authed)
  - URL, component stack (`errorInfo.componentStack`)
  - Device/browser info
- [ ] Set up alerts for:
  - Error rate > 0.5%
  - New error fingerprints

### 2. **User Experience**

- [ ] Never show raw stack traces in production
- [ ] Offer actionable recovery:
  - “Retry”
  - “Go back”
  - Contact support link
- [ ] Preserve app shell (header/nav) so users aren’t stranded
- [ ] Use `aria-live="polite"` for screen readers

### 3. **Testing Errors**

```tsx
// tests/ErrorBoundary.test.tsx
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const BadComponent = () => {
  throw new Error("Boom!");
};

test("renders fallback on error", () => {
  render(
    <ErrorBoundary fallback={<div>⚠️ Fallback</div>}>
      <BadComponent />
    </ErrorBoundary>
  );
  expect(screen.getByText("⚠️ Fallback")).toBeInTheDocument();
});
```

Use **React Testing Library’s `ErrorBoundary` wrapper**:

```ts
// test-utils.tsx
export const withErrorBoundary = (ui: ReactElement) => (
  <ErrorBoundary fallback={<div>Error!</div>}>{ui}</ErrorBoundary>
);
```

---

## 🆚 Alternatives & Complements

| Tool                                  | Role                               | When to Use                                 |
| ------------------------------------- | ---------------------------------- | ------------------------------------------- |
| **`try/catch` in event handlers**     | Handle async/user-initiated errors | `onClick`, form submissions                 |
| **Server Actions + `useActionState`** | Catch mutations at source          | `form action={serverAction}`                |
| **`onError` in `<img>`/`<script>`**   | Handle resource failures           | Broken images, CDN outages                  |
| **Global `window.onerror`**           | Last-resort catch-all              | For non-React errors (e.g., vendor scripts) |

> ✅ **Golden Rule**:  
> _Combine error boundaries (UI layer) with Server Action error handling (data layer) and global monitoring (ops layer)._

---

## 📚 Recommended Reading

- [React Docs: Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Next.js: Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Sentry React Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Testing Error Boundaries (RTL)](https://testing-library.com/docs/react-testing-library/example-intro#test-the-unhappy-path)

---

> 💡 **Final Thought**:  
> _“Users don’t care that your app is ‘React-based.’ They care that it works — especially when things go wrong.”_  
> — Build empathy into your error states.

---
