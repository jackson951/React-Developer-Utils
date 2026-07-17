# React Developer Utils

**A curated React knowledge base, utilities library, and experimentation workspace.**

[![CI](https://github.com/jackson951/React-Developer-Utils/actions/workflows/ci.yml/badge.svg)](https://github.com/jackson951/React-Developer-Utils/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## Overview

This is a long-term, evolving reference for professional React development. It's not a starter template or tutorial — it's the accumulated set of hooks, utilities, components, and notes I actually reach for on real projects, kept in one place so patterns don't get reinvented (or forgotten) between repos.

## What's actually in here

### Hooks (`hooks/`)
| Hook | Purpose |
|---|---|
| `useDebounce` | Debounce a fast-changing value (search inputs, filters) |
| `useEventListener` | Attach/detach DOM event listeners with automatic cleanup |
| `useOutsideClick` | Detect clicks outside a ref'd element (dropdowns, modals) |
| `useOnlineStatus` | Track `navigator.onLine` connectivity state |
| `useMediaQuery` | Reactively match CSS media queries |
| `useHover` | Track hover state on a ref'd element |
| `useClipboard` | Copy text to clipboard with success/error state |
| `useFetch` | Lightweight data-fetching hook with loading/error state |
| `useTheme` | Light/dark theme state with persistence |

### Utils (`utils/`)
| Function | Purpose |
|---|---|
| `debounce` | Framework-agnostic debounce |
| `throttle` | Framework-agnostic throttle |
| `formatDate` | Date formatting helpers |
| `classNames` | Conditional class name concatenation |
| `storage` | Typed `localStorage` wrapper |

### Components (`components/`)
Lightweight, dependency-light UI primitives: `Modal`, `Toast`, `Tooltip`, `Pagination`, `Loader`.

### Snippets (`snippets/`)
Standalone, copy-pasteable examples: `ErrorBoundary`, `PortalExample`, `SuspenseExample`, plus a few hook variants kept here as teaching examples rather than shipped hooks.

### Notes (`notes/`)
Structured conceptual references, organized by depth:
- `fundamentals/` — JSX, props/state, lifecycle, rendering
- `advanced/` — context, suspense, error boundaries, performance, hooks in depth
- `architecture/` — folder structure, atomic design, clean code patterns, project setup
- `ecosystem/` — Vite, Next.js, Redux Toolkit, Zustand, TanStack Query, Tailwind, Testing Library

### Tools (`tools/`)
Config references for ESLint/Prettier, Husky, lint-staged, Vite/Next config, Axios interceptors, git tips, VS Code extensions.

### Docs (`docs/`)
Career-and-practice adjacent guides: best practices, interview questions, learning resources, project checklist, roadmap.

### Playground (`playground/`)
Isolated Vite and Next.js sandboxes for trying a pattern before it graduates into `hooks/` or `utils/`.

---

## Quick Start

```bash
git clone https://github.com/jackson951/react-developer-utils.git
cd react-developer-utils
npm install
```

Run a playground environment:

```bash
cd playground/vite-demo && npm install && npm run dev
# or
cd playground/next-demo && npm install && npm run dev
```

## Example

```js
import { useDebounce } from "./hooks/useDebounce";

function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

All hooks and utilities are dependency-free unless explicitly stated.

---

## Design Principles

- Predictable over clever
- Composable by default
- Minimal abstraction
- Explicit configuration
- Documentation as part of the system

## Contribution Model

This repo is intentionally opinionated and personal, but issues/PRs pointing out bugs, better patterns, or React-version updates are welcome.

1. Add patterns encountered in real projects
2. Refine or remove outdated approaches
3. Keep examples minimal and focused
4. Favor clarity over completeness

## References

- [React Docs](https://react.dev) · [Epic React](https://epicreact.dev) · [React Patterns](https://reactpatterns.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) · [Vite Docs](https://vitejs.dev) · [Next.js Docs](https://nextjs.org/docs)

## License

MIT — unrestricted use in personal and commercial projects.

---

> This repository is a working system, not a finished product.
