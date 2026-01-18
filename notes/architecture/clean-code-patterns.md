# Clean Code Patterns in React

*Clean Code in React: Readability, Maintainability, and Team Scalability (2025)*

**Last updated:** November 7, 2025

**Summary**

* Code is read significantly more than it is written; optimize for clarity.
* Prefer **explicit over clever**, **composable over monolithic**, **tested over anecdotal correctness**.
* In modern React, clean code is enforced through **TypeScript strict mode**, **Biome**, and **automated testing**.
* Clean code is not minimal code; it is intentional and communicative.

---

## Core Principles (React-Specific)

| Principle             | Anti-Pattern                                                    | Preferred Approach                     |
| --------------------- | --------------------------------------------------------------- | -------------------------------------- |
| Single Responsibility | A component fetches data, formats values, and handles mutations | Separate UI, hooks, and utilities      |
| Explicitness          | Magic strings and implicit state                                | Enums, constants, and named conditions |
| Fail Fast             | Silent error handling                                           | Log, surface, or rethrow errors        |
| Predictability        | Side effects during render                                      | Effects, actions, or event handlers    |
| Testability           | Hard-coded dependencies                                         | Isolated data and logic layers         |

React guidance: [https://react.dev/learn](https://react.dev/learn)

---

## File and Folder Structure

A feature-oriented structure scales better than global component buckets.

```bash
src/
├── features/
│   └── cart/
│       ├── ui/
│       ├── model/
│       └── CartPage.tsx
│
├── shared/
│   ├── ui/
│   ├── lib/
│   └── types/
│
├── app/
│   ├── layout.tsx
│   └── page.tsx
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

Conventions:

* One component per file
* Barrel files only for public APIs
* Feature code owns its UI and logic

---

## Naming Conventions

| Category   | Recommendation                   | Rationale                  |
| ---------- | -------------------------------- | -------------------------- |
| Components | `UserAvatar`, `SearchBar`        | Clear domain intent        |
| Hooks      | `useLocalStorage`, `useDebounce` | Consistent React semantics |
| Utilities  | `formatCurrency`, `isEmailValid` | Action-oriented names      |
| Booleans   | `isLoading`, `hasAccess`         | Self-documenting state     |
| Callbacks  | `onSubmit`, `onClose`            | Predictable event handling |

TypeScript naming guidance: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

---

## Component Design Patterns

### Small, Focused Components

Components should have one reason to change and compose cleanly.

* Move side effects into hooks or actions
* Extract reusable display logic
* Avoid stateful components doing multiple jobs

This improves reuse, testing, and long-term maintainability.

---

## Testing as a Design Constraint

Testing difficulty is often a signal of poor design.

| Trait                 | Outcome                        |
| --------------------- | ------------------------------ |
| Pure functions        | Deterministic, easy to test    |
| Isolated hooks        | Can be validated independently |
| Explicit dependencies | Simple mocking and stubbing    |
| Thin components       | Behavior-focused tests         |

Testing references:

* React Testing Library: [https://testing-library.com/docs/react-testing-library/intro/](https://testing-library.com/docs/react-testing-library/intro/)
* Playwright: [https://playwright.dev](https://playwright.dev)

---

## Tooling for Clean Code (2025)

| Tool       | Purpose                | Reference                                                            |
| ---------- | ---------------------- | -------------------------------------------------------------------- |
| Biome      | Linting and formatting | [https://biomejs.dev](https://biomejs.dev)                           |
| TypeScript | Static type safety     | [https://www.typescriptlang.org](https://www.typescriptlang.org)     |
| Playwright | End-to-end testing     | [https://playwright.dev](https://playwright.dev)                     |
| Husky      | Git hooks              | [https://typicode.github.io/husky](https://typicode.github.io/husky) |
| Commitlint | Commit standards       | [https://commitlint.js.org](https://commitlint.js.org)               |

Minimal Biome configuration:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
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

| Anti-Pattern           | Impact                 | Correction                  |
| ---------------------- | ---------------------- | --------------------------- |
| Deep prop drilling     | Fragile APIs           | Context or state colocation |
| Large effects          | Hidden coupling        | Split by responsibility     |
| `any` or ignored types | Type erosion           | Narrow types or validation  |
| Inline constants       | Poor reuse             | Extract tokens or helpers   |
| Over-optimization      | Unnecessary complexity | Measure before optimizing   |

---

## Further Reading

* Clean Code — Robert C. Martin: [https://www.oreilly.com/library/view/clean-code-a/9780136083238/](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
* Epic React: [https://epicreact.dev](https://epicreact.dev)
* Thinking in React: [https://react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)
* Biome Rules Reference: [https://biomejs.dev/linter/rules/](https://biomejs.dev/linter/rules/)

---

Clean code emerges from empathy for future maintainers, not from rigid adherence to rules.
