# 🛠️ `project-setup.md`

_Professional React Project Setup (2025 Edition)_  
_From `npm create` to CI/CD — zero to production-ready._

> ✅ **Last Updated**: November 7, 2025  
> 🎯 **For**: Solo devs, startups, agency teams, enterprise engineers  
> 📦 **Stack**: Vite **or** Next.js (App Router), TypeScript, Biome, Playwright  
> 🧪 Inspired by real-world setups at Vercel, Shopify, and open-source teams

---

## 🚀 Step 1: Choose Your Foundation

| Use Case                                  | Recommendation                 | Why                                              |
| ----------------------------------------- | ------------------------------ | ------------------------------------------------ |
| **Marketing site, blog, content**         | `Next.js` (App Router)         | SSR, RSC, image optimization, routing out-of-box |
| **Dashboard, SaaS, internal tool**        | `Next.js` (App Router)         | Auth, mutations, streaming, full-stack           |
| **SPA, PWA, Electron, embeddable widget** | `Vite + React`                 | Faster dev server, lighter, full control         |
| **Mobile + Web**                          | `Next.js` + `Expo` (universal) | Shared logic, separate UI layers                 |

> ✅ **Default 2025 choice**: **Next.js App Router** — unless you _need_ full control.

---

## 📦 Step 2: Initialize the Project

### ✅ Next.js (App Router — Recommended)

```bash
npx create-next-app@latest my-app \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

- ✅ `--app`: App Router (RSC-ready)
- ✅ `--src-dir`: Clean `src/` root
- ✅ `--import-alias "@/*"`: Absolute imports (`import { Button } from '@/components/ui/Button'`)

### ✅ Vite (SPA)

```bash
npm create vite@latest my-app \
  -- --template react-ts

cd my-app
npm install
```

Then add essentials:

```bash
npm install -D biome vitest @testing-library/react @testing-library/jest-dom
npm install react-router-dom @tanstack/react-query zustand clsx
```

---

## 🗂️ Step 3: Folder Structure (2025 Standard)

```
my-app/
├── src/
│   ├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/              # Route handlers (Next.js)
│   │
│   ├── components/           # Reusable UI
│   │   ├── ui/               # Atoms/molecules (Button, Input, Card)
│   │   └── features/         # Business components (CheckoutForm, UserCard)
│   │
│   ├── hooks/                # Custom hooks (useDebounce, useLocalStorage)
│   ├── lib/                  # Utilities (formatDate, apiClient, storage)
│   ├── styles/               # Global CSS, Tailwind config, design tokens
│   ├── types/                # Shared TS types (User, Product)
│   │
│   ├── features/             # Feature-sliced design (optional but recommended)
│   │   └── auth/
│   │       ├── ui/           # Auth-specific components
│   │       ├── model/        # Hooks, types, API
│   │       └── index.ts
│   │
│   └── tests/
│       ├── unit/             # utils, hooks
│       ├── integration/      # components + MSW
│       └── e2e/              # Playwright
│
├── public/                   # Static assets (favicon, robots.txt)
├── .env.local                # Local env (gitignored)
├── biome.json                # Linting + formatting
├── tsconfig.json             # Strict TS
├── playwright.config.ts      # E2E config
└── package.json
```

✅ **Key Decisions**:

- `src/` root (not `pages/` or flat `components/`)
- `ui/` for design-system components, `features/` for business logic
- `lib/` for pure utils (no React)

---

## ⚙️ Step 4: Tooling Setup

### ✅ TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es2022"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### ✅ Biome (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "files": { "ignore": ["dist", "node_modules", ".next"] },
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "noNonNullAssertion": "error" },
      "correctness": { "noUnusedVariables": "error" }
    }
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

### ✅ Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "prepare": "husky"
  }
}
```

---

## 🔐 Step 5: Environment & Security

### `.env.local` (gitignored)

```env
# Client-side (Next.js: NEXT_PUBLIC_; Vite: VITE_)
NEXT_PUBLIC_API_URL=https://api.example.com

# Server-side (never exposed to client)
DATABASE_URL=postgres://...
AUTH_SECRET=your_strong_secret_here
```

### ✅ Validate at Runtime (lib/env.ts)

```ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

### ✅ Security Hardening

- [ ] Add `Content-Security-Policy` header (Next.js: `next-secure-headers`)
- [ ] Sanitize user content (`DOMPurify`)
- [ ] Rate limit API routes
- [ ] `npm audit --production` in CI

---

## 🧪 Step 6: Testing Strategy

| Level           | Tool         | Coverage Goal       | Example                            |
| --------------- | ------------ | ------------------- | ---------------------------------- |
| **Unit**        | Vitest + RTL | ≥70% (utils, hooks) | `useDebounce`, `formatDate`        |
| **Integration** | RTL + MSW    | ≥50% (components)   | `<LoginForm>` with mocked API      |
| **E2E**         | Playwright   | 3–5 core user flows | Login → Add item → Checkout        |
| **A11y**        | `axe-core`   | 100% pass           | `npx playwright test --grep @a11y` |

**Playwright setup**:

```bash
npm init playwright@latest
# → Select TypeScript, Chrome, install dependencies
```

---

## 🚀 Step 7: CI/CD (GitHub Actions)

`.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build
      - run: npm run test:e2e
        env:
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
```

✅ **Bonus**: Add Lighthouse CI for PR previews.

---

## 👥 Step 8: Team Onboarding

### `CONTRIBUTING.md`

```md
## Local Setup

1. `git clone`
2. `npm install`
3. Copy `.env.example` → `.env.local` and fill secrets
4. `npm run dev`

## Branch Strategy

- `main`: production
- `feat/*`, `fix/*`: feature/bug branches
- PRs require: ✅ lint, ✅ tests, ✅ review

## PR Template

- [ ] Tests added/updated
- [ ] A11y checked (keyboard, screen reader)
- [ ] Mobile responsive
- [ ] Screenshots (if UI change)
```

### `ADR.md` (Architecture Decision Records)

```md
## 2025-11-07: Choose Zustand over Redux

### Status: Accepted

### Context

Team struggled with Redux boilerplate and Provider trees.

### Decision

Use Zustand for global UI state (cart, filters).

### Consequences

✅ Simpler code  
✅ No Provider needed  
⚠️ Must avoid putting API data in Zustand (→ TanStack Query)
```

---

## 📦 Starter Templates

| Template                           | Command                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Next.js + RSC + TanStack Query** | `npx create-next-app@latest --example https://github.com/vercel/next.js/tree/canary/examples/with-tanstack-query` |
| **Vite + React + Biome**           | [GitHub Gist](https://gist.github.com/...)                                                                        |
| **Full-stack (Next.js + Prisma)**  | `npx create-next-app@latest --example with-prisma`                                                                |

---

## 📚 Recommended Reading

- 📘 [Next.js: App Router](https://nextjs.org/docs/app)
- 🧪 [Vite: React Setup](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- 🛠️ [Biome Configuration Guide](https://biomejs.dev/guides/configuring-biome/)
- 📊 [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

> 💡 **Final Thought**:  
> _“A great setup isn’t about the latest tools — it’s about removing friction so your team can focus on building value.”_  
> — Start simple, automate relentlessly, evolve intentionally.
