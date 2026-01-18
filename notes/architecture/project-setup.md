# project-setup.md

*Professional React Project Setup (2026 Edition)*
*From project initialization to CI/CD — production-ready by default.*

> **Last Updated**: January 18, 2026
> **Audience**: Solo developers, startups, agencies, enterprise teams
> **Stack**: Next.js (App Router) or Vite, TypeScript, Biome, Vitest, Playwright
> **Influences**: Practices from Vercel, Shopify, and mature open‑source projects

---

## 1. Choose Your Foundation

| Use case                        | Recommendation       | Rationale                                 |
| ------------------------------- | -------------------- | ----------------------------------------- |
| Marketing site, blog, content   | Next.js (App Router) | SSR, RSC, routing, image optimization     |
| Dashboard, SaaS, internal tools | Next.js (App Router) | Full‑stack workflows, auth, streaming     |
| SPA, PWA, Electron, widgets     | Vite + React         | Faster dev server, minimal abstraction    |
| Mobile + Web                    | Next.js + Expo       | Shared business logic, separate UI layers |

**Default (2026)**: Prefer **Next.js App Router** unless you explicitly require framework‑level control.

---

## 2. Initialize the Project

### Next.js (App Router)

```bash
npx create-next-app@latest my-app \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Key flags:

* `--app`: Enables the App Router (RSC‑ready)
* `--src-dir`: Enforces a clean `src/` root
* `--import-alias`: Enables absolute imports

### Vite (SPA)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

Recommended additions:

```bash
npm install -D biome vitest @testing-library/react @testing-library/jest-dom
npm install react-router-dom @tanstack/react-query zustand clsx
```

---

## 3. Folder Structure (Current Standard)

```
my-app/
├── src/
│   ├── app/                  # Next.js App Router (routes, layouts, handlers)
│   ├── components/           # Reusable UI
│   │   ├── ui/               # Design-system components
│   │   └── features/         # Business-level components
│   ├── features/             # Feature-sliced modules
│   ├── hooks/                # Reusable hooks
│   ├── lib/                  # Framework-agnostic utilities
│   ├── styles/               # Global styles and tokens
│   ├── types/                # Shared TypeScript types
│   └── tests/                # Unit, integration, and e2e tests
├── public/
├── .env.local
├── biome.json
├── tsconfig.json
├── playwright.config.ts
└── package.json
```

Design principles:

* `src/` as the only source root
* `ui/` for generic components, `features/` for domain logic
* `lib/` must not depend on React

---

## 4. Tooling

### TypeScript

Strict by default, no implicit escapes:

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
    "moduleResolution": "bundler",
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

### Biome

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

### Scripts

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
    "test:e2e": "playwright test"
  }
}
```

---

## 5. Environment & Security

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgres://...
AUTH_SECRET=replace_with_strong_secret
```

### Runtime Validation

```ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

Security checklist:

* Content Security Policy headers
* Input sanitization (DOMPurify)
* API rate limiting
* Dependency auditing in CI

---

## 6. Testing Strategy

| Level         | Tooling               | Scope               |
| ------------- | --------------------- | ------------------- |
| Unit          | Vitest                | Utilities and hooks |
| Integration   | Testing Library + MSW | Component behavior  |
| E2E           | Playwright            | Critical user flows |
| Accessibility | axe-core              | WCAG compliance     |

Playwright initialization:

```bash
npm init playwright@latest
```

---

## 7. CI/CD (GitHub Actions)

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
```

Optional extensions: Lighthouse CI, preview deployments, bundle analysis.

---

## 8. Team Enablement

### CONTRIBUTING.md

* Deterministic local setup
* Enforced branch naming
* Mandatory tests and review gates

### Architecture Decision Records

Use ADRs to document irreversible or high‑impact decisions.

---

## Starter Templates

* Next.js App Router: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
* Vite React Scaffolding: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)
* Biome Configuration: [https://biomejs.dev/guides/configuring-biome/](https://biomejs.dev/guides/configuring-biome/)
* Playwright Best Practices: [https://playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices)

---

**Guiding principle**: Optimize for clarity, repeatability, and long‑term maintainability. Tooling exists to reduce friction, not to define a
