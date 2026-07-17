# Clean Code Patterns in React

*Readability, Maintainability, and Team Scalability*

**Summary**

* Code is read far more than it’s written – optimise for clarity.
* Prefer **explicit over clever**, **composable over monolithic**, **tested over anecdotal correctness**.
* In modern React, clean code is enforced through **TypeScript strict mode**, **Biome**, and **automated testing**.
* Clean code isn’t minimal code; it’s intentional, communicative, and empathetic to future maintainers.

---

## Core Principles (React-Specific)

| Principle              | Anti-Pattern                                                      | Preferred Approach                               |
|------------------------|-------------------------------------------------------------------|--------------------------------------------------|
| **Single Responsibility** | A component fetches data, formats values, and handles mutations | Split into UI, custom hooks, and utility functions |
| **Explicitness**          | Magic strings, implicit state shapes                              | Use enums, constants, named union types          |
| **Fail Fast**             | Silent error handling (empty catch blocks)                        | Log, surface to error boundary, or throw         |
| **Predictability**        | Side effects during render                                        | `useEffect`, event handlers, or Server Actions    |
| **Testability**           | Hard‑coded dependencies, global singletons                        | Dependency injection, pure functions, mocks       |

> Modern React guide: [https://react.dev/learn](https://react.dev/learn)

---

## File and Folder Structure

A feature‑oriented structure scales far better than dumping everything into global component folders.

```bash
src/
├── features/
│   └── cart/
│       ├── ui/              # CartButton, CartModal…
│       ├── model/           # useCart, cartUtils, types
│       └── CartPage.tsx
│
├── shared/
│   ├── ui/                  # Design system primitives (Button, Input)
│   ├── lib/                 # utils, API clients, config
│   └── types/               # global TypeScript types
│
├── app/                     # (Next.js App Router) or main entry
│   ├── layout.tsx
│   └── page.tsx
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Conventions**:

* **One component per file** (named export preferred).
* Use **barrel files** (`index.ts`) only for public APIs, not for global re‑exports.
* **Feature code owns its UI and logic** – co‑locate hooks, utils, and types with the feature.
* Keep `shared/` for truly generic, reusable code; don’t let it become a dumping ground.

---

## Naming Conventions

| Category        | Example                             | Rationale                             |
|-----------------|-------------------------------------|---------------------------------------|
| **Components**  | `UserAvatar`, `SearchBar`           | Clear, domain‑intent names            |
| **Hooks**       | `useLocalStorage`, `useDebounce`    | Standard `use` prefix, action‑driven   |
| **Utilities**   | `formatCurrency`, `isEmailValid`    | Verb‑oriented, descriptive            |
| **Booleans**    | `isLoading`, `hasAccess`, `isOpen` | Self‑documenting state flags          |
| **Callbacks**   | `onSubmit`, `onClose`               | Predictable event handler convention  |

TypeScript naming guidelines: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

---

## Component Design Patterns

### Small, Focused Components

Every component should have **one reason to change**. Compose them to build complex UIs.

- **Extract side effects** into custom hooks or Server Actions.
- **Derive data** instead of storing redundant state.
- **Avoid a stateful component that does data fetching, transformation, and rendering** – split them.

```tsx
// ❌ Monolithic component
function UserProfile({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser(id).then(setUser); }, [id]);
  // ... formatting, loading, error handling all in one
}

// ✅ Separated
function useUser(id) { /* data fetching */ }
function UserProfile({ user }) { /* only rendering */ }
```

### Composition over Configuration

Use `children`, render props (rarely), or compound components to keep APIs flexible.

```tsx
// Compound component pattern (Tabs, Dropdown, etc.)
<Tabs>
  <TabList>
    <Tab>Item 1</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
  </TabPanels>
</Tabs>
```

### Server vs. Client Components

In frameworks like Next.js App Router, **Server Components are the default**. Keep them free of hooks and event handlers. **Client Components** (`'use client'`) handle interactivity. This separation improves performance and clarity.

---

## Testing as a Design Constraint

If a component or hook is hard to test, it’s often a design smell.

| Trait                 | Outcome                                      |
|----------------------|----------------------------------------------|
| **Pure functions**   | Deterministic, no side effects, easy to unit-test |
| **Isolated hooks**   | Can be tested with `renderHook` from RTL      |
| **Explicit dependencies** | Easy to mock/stub, no hidden globals     |
| **Thin UI components**  | Tests focus on behaviour, not implementation |

Testing stack (modern):

- **Vitest** + **React Testing Library** for unit/integration
- **Playwright** for E2E
- **MSW** (Mock Service Worker) for network mocking

---

## Tooling for Clean Code

| Tool        | Purpose                     | Notes                                     |
|-------------|-----------------------------|-------------------------------------------|
| **Biome**       | Linting & formatting        | Replaces ESLint + Prettier, much faster   |
| **TypeScript**  | Static type safety          | `strict: true`, no implicit `any`         |
| **Vitest**      | Unit & integration tests    | Native ESM, instant watch mode            |
| **Playwright**  | End‑to‑end tests            | Cross‑browser, reliable                   |
| **Husky**       | Git hooks                   | Lint/format before commit                 |
| **Commitlint**  | Enforce conventional commits| Consistent changelog generation           |

Minimal Biome config (`biome.json`):

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

---

## Common Anti-Patterns

| Anti-Pattern                | Impact                       | Correction                                      |
|------------------------------|------------------------------|-------------------------------------------------|
| **Deep prop drilling**       | Fragile, hard to refactor    | Lift state only as needed, use context or Zustand |
| **Large `useEffect` blocks** | Hidden coupling, hard to debug | Split effects by concern, move logic to hooks   |
| **`any` or `ts-ignore`**     | Type erosion, unexpected bugs | Use proper types, narrow with type guards       |
| **Inline magic values**      | Poor reusability, hidden intent | Extract to constants, tokens, or config        |
| **Over-memoisation**         | Added complexity, no real gain | Profile first, memoise only expensive operations |
| **Mixing server & client state** | Confusing data flow      | Keep server data in TanStack Query, UI state in Zustand/local |

---

## Further Reading

- [React – Thinking in React](https://react.dev/learn/thinking-in-react)
- [Epic React by Kent C. Dodds](https://epicreact.dev)
- [The Tao of Node – Design Patterns (same principles apply)](https://alexkondov.com/tao-of-node/)
- [Biome Rules Reference](https://biomejs.dev/linter/rules/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)

---

> Clean code is not about following rules blindly. It’s about writing code that **communicates intent** and **cares for the next developer** – who might be you, six months from now.
```
