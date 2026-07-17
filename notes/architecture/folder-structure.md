# React Project Folder Structure Guide

A practical guide to organizing React projects of any size — from a weekend prototype to a large‑scale enterprise application. The goal is **clarity, scalability, and developer happiness**, not rigid rules.

---

## Guiding Principles

- **Co-location**: Keep files that change together close together (component + its styles + tests + stories).
- **Feature‑first**: Group by business domain, not technical role (e.g., `features/cart` over `components/Cart`).
- **Flat where possible**: Avoid deeply nested folders; a 3–4 level maximum is a good rule of thumb.
- **Explicit over implicit**: Use clear, descriptive names; barrel exports (`index.ts`) only for public API surfaces.
- **TypeScript by default**: All examples assume TypeScript (`.tsx` / `.ts`), but the same structure works for JavaScript.

---

## Recommended Tech Stack (Modern Baseline)

| Layer             | Preferred                                  |
|------------------|--------------------------------------------|
| **Framework**    | Next.js App Router (full‑stack) or Vite (SPA) |
| **Styling**      | Tailwind CSS + `clsx`/`cn` utility          |
| **State (UI)**   | Zustand (global) + `useState`/`useReducer` (local) |
| **State (Server)**| TanStack Query + Server Components          |
| **Testing**      | Vitest + React Testing Library + Playwright |

---

## Small to Medium Projects (< 15 screens)

Best for side projects, MVPs, or small teams. Keep it simple and flat.

```
src/
├── app/                         # Next.js App Router (or main.tsx for Vite)
│   ├── layout.tsx
│   ├── page.tsx
│   └── (routes)/                # Route groups & page files
├── components/
│   ├── ui/                      # Generic design‑system primitives (Button, Input)
│   └── layout/                  # Header, Footer, Sidebar…
├── hooks/                       # Shared custom hooks
├── lib/                         # API client, utilities, constants
├── styles/                      # Global CSS or Tailwind imports
└── types/                       # Shared TypeScript types
```

**When to use:** Single developer, limited feature overlap, quick iterations.

---

## Medium to Large Projects (Multiple features, growing team)

Introduce a **feature‑based layer** while keeping shared primitives separate.

```
src/
├── app/                         # Next.js pages & layouts (thin – mainly compose features)
├── features/
│   ├── auth/                    # Everything related to authentication
│   │   ├── components/          # LoginForm, SignUpForm…
│   │   ├── hooks/               # useAuth, useLogin
│   │   ├── api/                 # authService, mutations
│   │   ├── store/               # Zustand slice or Redux slice
│   │   └── utils/               # feature‑specific validators, helpers
│   ├── products/
│   └── orders/
├── shared/
│   ├── ui/                      # Reusable design system (Button, Card, Modal…)
│   ├── hooks/                   # useDebounce, useLocalStorage…
│   ├── lib/                     # Formatting, apiClient, env validation
│   └── types/                   # Global domain types (User, Order…)
├── config/                      # App configuration, routes, theme
├── styles/                      # Global styles & Tailwind config
└── tests/                       # Global test setup, mocks, fixtures
```

**Key rules:**

- **`features/`** folder is the backbone. Each feature is a self‑contained module with its own components, hooks, API logic, and state.
- **`shared/`** contains only code that is truly generic and used across multiple features. Avoid dumping everything here.
- **`app/`** stays thin – it composes features and handles routing/metadata.

---

## Enterprise / Large‑Scale Projects

When multiple teams work on different domains, add **domain boundaries** and **packages** (monorepo).

```
packages/
├── core/                        # Design system, shared UI components, tokens
├── utils/                       # Shared utilities
├── api/                         # API client & server contracts
├── features/
│   ├── auth/
│   ├── catalog/
│   └── checkout/
└── app/                         # Next.js or Vite app that assembles everything
```

Using tools like **Turborepo** or **Nx** to manage dependencies and build pipelines.

---

## Component Structure (Co-location)

Every component lives in its own folder with all related files. This makes it trivial to move, delete, or reason about.

### Recommended (Design‑System Components)

```
components/ui/Button/
├── Button.tsx                   # Component implementation
├── Button.test.tsx              # Unit/integration tests
├── Button.stories.tsx           # Storybook story (optional)
├── Button.module.css            # CSS Modules (if not using Tailwind)
└── index.ts                     # Public API: export { Button } from './Button';
```

### For feature components:

```
features/cart/components/CartItem/
├── CartItem.tsx
├── CartItem.test.tsx
├── CartItemSkeleton.tsx         # Loading state variant
└── index.ts
```

Tests always live alongside the component – not in a separate `__tests__` folder. This makes them easy to discover and maintain.

---

## Naming Conventions

| What               | Convention                        | Example                     |
|--------------------|-----------------------------------|-----------------------------|
| Component files    | PascalCase                        | `UserAvatar.tsx`            |
| Hooks              | `use` prefix, camelCase           | `useAuth.ts`                |
| Utility functions  | camelCase, descriptive verb       | `formatCurrency.ts`         |
| Types/interfaces   | PascalCase                        | `User.ts`, `Order.ts`       |
| Barrel exports     | `index.ts` (only at public boundaries) |                           |
| Constants          | UPPER_SNAKE_CASE                  | `MAX_UPLOAD_SIZE`           |

---

## Path Aliases (TypeScript)

Configure path aliases to keep imports clean and refactor‑safe.

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/shared/ui/*"],
      "@/hooks/*": ["src/shared/hooks/*"],
      "@/features/*": ["src/features/*"],
      "@/lib/*": ["src/shared/lib/*"]
    }
  }
}
```

Vite and Next.js respect these aliases automatically. Imports become:

```tsx
import { Button } from '@/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
```

---

## Modern Considerations (RSC & Next.js App Router)

- **Server Components (default)**: Can import and render client components. Keep them focused on data fetching and static UI.
- **Client Components (`'use client'`)**: For interactivity, hooks, and browser APIs. Co-locate with their feature, but mark them explicitly.
- **Data fetching**: Use Server Components to fetch data and pass it down as props. Use TanStack Query on the client only when you need caching, polling, or optimistic updates.

Layouts and pages in `app/` compose features, which themselves can mix server and client components as needed.

---

## When to Choose Which Structure

| Project size | Recommended structure                                    |
|--------------|----------------------------------------------------------|
| Prototype / tiny team | Flat `components/`, minimal layers                |
| 1–3 developers, few features | Basic feature folders + `shared/`            |
| 4+ developers, many features | Full feature‑based architecture with explicit boundaries |
| Multi‑team / monorepo | Domain packages, shared core, strict module contracts |

---

## Common Pitfalls to Avoid

- **Over‑abstracting too early** – Start simple, extract only when patterns repeat.
- **Deep nesting** – Keep folder depth to 3–4 levels maximum.
- **Mixing concerns** – Don’t put business logic in UI components.
- **Monolithic `common/` folder** – If a component is used in only one feature, keep it there.
- **Ignoring barrel file hygiene** – Only expose what’s necessary; don’t re‑export the entire folder.

---

## Tooling & Automation

Use these to enforce structure and consistency:

- **Biome** or ESLint + Prettier for formatting and linting.
- **Husky** + **lint‑staged** for pre‑commit checks.
- **TypeScript strict mode** as a design constraint.
- **Storybook** (optional) for isolated component development.

---

## Summary

> The best folder structure is the one your team agrees on and can evolve.  
> **Start flat, go feature‑based as you scale, and never stop refining.**  
> Co‑location, clear naming, and module boundaries are the pillars of a maintainable React codebase.
```
