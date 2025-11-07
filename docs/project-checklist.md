# 🧰 React Project Checklist (2025 Edition)

_From zero to production — and beyond._

> ✅ **Last Updated**: November 7, 2025  
> 🎯 **For**: Solo devs • Teams • Tech leads • Senior engineers  
> 📦 **Stack-agnostic core**, with Next.js/RSC + Vite paths  
> 🧪 Inspired by real-world audits of 50+ production React apps

---

## 🗺️ Phase 0: Planning & Architecture

### ✅ Vision & Scope

- [ ] Define **user goals** (not just features)
- [ ] Write **1-sentence product vision**: _“Helps [user] do [task] so they can [outcome].”_
- [ ] Prioritize with **MoSCoW**: Must/Should/Could/Won’t
- [ ] Identify **core metrics** (e.g., time-to-interaction, conversion, error rate)

### ✅ Tech Stack Decision

| Decision          | Options                                    | Recommendation (2025)                                                                   |
| ----------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| **App type**      | SPA / MPA / Hybrid                         | → Prefer **MPA + RSC** (Next.js App Router) for most apps                               |
| **Framework**     | Next.js / Remix / Vite + React Router      | → **Next.js 14.2+** (App Router + Turbopack) unless full control needed                 |
| **Styling**       | CSS Modules / Tailwind / CSS-in-JS         | → **Tailwind + `@layer` + `clsx`** (no runtime bloat)                                   |
| **State**         | Context / Zustand / Jotai / TanStack Store | → **Zustand** for global; **React Query (v5)** for server state                         |
| **Data Fetching** | `fetch` / SWR / TanStack Query             | → **TanStack Query v5** (supports RSC + streaming)                                      |
| **Forms**         | `react-hook-form` + Zod                    | ✅ **RHF + Zod** (type-safe, performant, RSC-compatible)                                |
| **Testing**       | Vitest / Jest + RTL / Playwright           | → **Vitest + RTL + Playwright E2E**                                                     |
| **Linting**       | ESLint + Biome (new!)                      | → **Biome** (faster, all-in-one)                                                        |
| **TypeScript**    | Strict mode?                               | ✅ `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` |

### ✅ Folder Structure (Recommended)

```bash
src/
├── app/                  # Next.js App Router
│   ├── (marketing)/      # Route groups
│   ├── api/              # Route handlers
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # Reusable primitives (Button, Card)
│   ├── features/         # Business logic components (CheckoutForm)
│   └── layouts/          # App shell, headers, footers
├── lib/                  # Utilities, helpers, constants
├── hooks/                # Custom hooks (`useAuth`, `useBreakpoint`)
├── stores/               # Zustand/Jotai stores
├── types/                # Shared TS types & schemas
├── styles/               # Globals, Tailwind config, CSS vars
├── public/               # Static assets (favicons, robots.txt)
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 🛠️ Phase 1: Setup & Tooling

### ✅ Repo & CI Foundation

- [ ] Initialize with **`create-next-app@latest --ts --tailwind --eslint`** (or `vite create`)
- [ ] Add `.gitignore` (include `.next/`, `.turbo/`, `node_modules/`, `.env.local`)
- [ ] Set up **pre-commit hooks**: `lint-staged` + `husky`
- [ ] Enable **TypeScript strict checks** (see above)
- [ ] Add **`.nvmrc`** (e.g., `20.15.0`)
- [ ] Add **`.dockerignore`** & **`Dockerfile`** (multi-stage build)

### ✅ Developer Experience (DX)

- [ ] Configure **Biome** (`biome init --typescript`) + disable ESLint if using Biome
- [ ] Add **Prettier** (or let Biome format)
- [ ] Add **VS Code settings**:
  ```json
  {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": { "source.organizeImports": true },
    "[typescriptreact]": { "editor.defaultFormatter": "biome" }
  }
  ```
- [ ] Set up **React DevTools** (browser extension + inline props in dev)
- [ ] Add **Storybook** (v8) or **Chromatic** for component dev/docs
- [ ] Enable **Turbopack** (Next.js) — `next dev --turbo`

### ✅ Environment & Secrets

- [ ] Use `.env.local` for local, never commit
- [ ] Prefix **client-side** vars with `NEXT_PUBLIC_` (Next) or `VITE_` (Vite)
- [ ] Use **Vault / Doppler / AWS SSM** for prod secrets
- [ ] Validate env at runtime:
  ```ts
  // lib/env.ts
  const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    DATABASE_URL: z.string().min(1),
  });
  export const env = envSchema.parse(process.env);
  ```

---

## 🧱 Phase 2: Core Implementation

### ✅ Component Hygiene

- [ ] **All components**:
  - [ ] Named exports only
  - [ ] TypeScript interfaces for props (`Props`, not `TProps`)
  - [ ] `displayName` for debugging (optional but helpful)
  - [ ] Avoid `any`, `// @ts-ignore`, `!` non-null assertions
- [ ] Prefer **function components + hooks** — _no class components_
- [ ] Use **`React.memo`** _only_ when proven needed (profile first!)
- [ ] Extract logic into **custom hooks**, not HOCs/render props
- [ ] **Compound components** for complex UI (e.g., `<Tabs><TabList><TabPanel>`)

### ✅ State Management Strategy

| Use Case                              | Tool                                           |
| ------------------------------------- | ---------------------------------------------- |
| Local UI state (`isOpen`, `count`)    | `useState`, `useReducer`                       |
| Form state                            | `react-hook-form`                              |
| Server-cached data (users, posts)     | **TanStack Query** (`useQuery`, `useMutation`) |
| Global UI state (theme, auth)         | **Zustand** (simpler, no Provider trees)       |
| Complex workflows (steppers, wizards) | **XState** or `useReducer` + context           |

### ✅ Data Fetching (RSC Era)

- [ ] **Server Components**: Fetch directly with `async/await` + `fetch` (no hooks)
- [ ] Use **`cache()`** and **`revalidate()`** for data freshness control
- [ ] For mutations: **Server Actions** (`'use server'`) > `fetch` > `useMutation`
- [ ] Wrap external APIs in **dedicated service layer**:
  ```ts
  // lib/api/posts.ts
  export async function getPosts() {
    const res = await fetch("https://api.example.com/posts", {
      next: { revalidate: 3600 },
    });
    return res.json();
  }
  ```
- [ ] **Streaming w/ Suspense**:
  ```tsx
  // app/page.tsx
  export default async function Page() {
    return (
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    );
  }
  ```

### ✅ Forms & Validation (2025 Standard)

- [ ] Use `react-hook-form` + **Zod resolver**
- [ ] Server-side validation in **Server Actions** (never trust client!)
- [ ] Schema shared between client & server:
  ```ts
  // types/forms.ts
  export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  ```
- [ ] Optimistic updates for mutations (TanStack Query `useMutation`)

---

## 🧪 Phase 3: Quality Assurance

### ✅ Testing Pyramid

| Level           | Tools                 | Coverage Goal         | Key Checks                            |
| --------------- | --------------------- | --------------------- | ------------------------------------- |
| **Unit**        | Vitest + RTL          | ≥70% (critical paths) | Custom hooks, utils, pure components  |
| **Integration** | RTL + MSW             | ≥50% (user flows)     | Form submission, auth flow, API mocks |
| **E2E**         | Playwright            | ≥3 core user journeys | Login → Checkout → Confirmation       |
| **Visual**      | Storybook + Chromatic | All UI components     | Regression on design tokens           |

### ✅ Essential Tests to Write

- [ ] `useCounter` hook increments correctly
- [ ] `<LoginForm>` validates email & shows errors
- [ ] `POST /api/login` returns 401 on bad password
- [ ] **Critical path E2E**:
  ```ts
  // tests/e2e/checkout.spec.ts
  test("user can purchase item", async ({ page }) => {
    await page.goto("/products/123");
    await page.click("text=Add to Cart");
    await page.click("text=Checkout");
    await fillForm({ email: "test@example.com", card: "4242..." });
    await page.click("text=Place Order");
    await expect(page.locator("text=Thank you!")).toBeVisible();
  });
  ```

### ✅ Accessibility (a11y)

- [ ] Run `axe-core` in CI:
  ```bash
  npx playwright test --project=chromium --grep "@a11y"
  ```
- [ ] All interactive elements:
  - [ ] Keyboard navigable (`Tab`, `Enter`, `Space`)
  - [ ] `aria-*` attributes where needed (`aria-expanded`, `aria-live`)
  - [ ] Sufficient color contrast (≥4.5:1)
  - [ ] Semantic HTML (`<button>`, not `<div onClick>`)
- [ ] Use `@testing-library/user-event` for realistic interaction tests

### ✅ Performance Budgets

| Metric           | Target (Lighthouse) | Tool                         |
| ---------------- | ------------------- | ---------------------------- |
| **FCP**          | ≤1.8s               | Lighthouse CI                |
| **TTI**          | ≤3.5s               | WebPageTest                  |
| **Bundle (JS)**  | ≤250KB (main route) | `source-map-explorer`        |
| **Image (hero)** | ≤100KB (WebP/AVIF)  | `next/image` or `@vercel/og` |

| [ ] Add **performance regression check** in CI:

```yaml
# .github/workflows/perf.yml
- name: Lighthouse
  run: npx lhci autorun --upload.target=temporary-public-storage
```

---

## 🚀 Phase 4: Production Readiness

### ✅ Build & Deployment

- [ ] **Static assets**:
  - [ ] Image optimization (`next/image`, `sharp`)
  - [ ] Font subsetting + `font-display: swap`
  - [ ] SVGs inlined (not `<img src="icon.svg">`)
- [ ] **Caching strategy**:
  - `Cache-Control: public, max-age=31536000, immutable` for hashed assets
  - `stale-while-revalidate` for HTML/data (Next.js does this by default)
- [ ] **Deploy preview**: Vercel, Cloudflare Pages, or Netlify
- [ ] **Production build check**:
  ```bash
  npm run build && echo "✅ Build succeeded"
  npx next export  # if static
  ```

### ✅ Monitoring & Observability

- [ ] **Error tracking**: Sentry / LogRocket / Honeybadger
  - Capture React errors (`ErrorBoundary` + `componentDidCatch`)
  - Source maps uploaded
- [ ] **Performance monitoring**:
  - Web Vitals (CLS, FID → INP) via `web-vitals` + GA4
  - Custom metrics: `TTFC` (Time to First Click), `TTFB`
- [ ] **Logging**: Structured JSON logs (e.g., `pino`)
- [ ] **Health checks**: `/api/health` → `{ "ok": true, "db": "connected" }`

### ✅ Security Hardening

- [ ] **CSP** (Content Security Policy) header (use `next-secure-headers`)
- [ ] **XSS protection**:
  - Sanitize user content (`DOMPurify`)
  - Never `dangerouslySetInnerHTML` without sanitization
- [ ] **CSRF protection** for Server Actions (Next.js auto-handles via tokens)
- [ ] **Rate limiting** on API routes (e.g., `next-rate-limiter`)
- [ ] **Dependency audit**: `npm audit --production` in CI

---

## 📦 Phase 5: Maintenance & Scale

### ✅ Documentation

- [ ] `README.md`:
  - [ ] Local setup (`npm install`, `npm run dev`)
  - [ ] Deploy instructions
  - [ ] Tech decisions (ADR — _Architecture Decision Records_)
- [ ] `CONTRIBUTING.md`: PR expectations, branch naming, tests required
- [ ] Component docs in **Storybook** (Props table, usage examples)
- [ ] **Runbook** for common ops tasks (e.g., “How to rollback”)

### ✅ Code Health

- [ ] **Refactoring schedule**:
  - Tech debt tracked in GitHub Issues (`tech-debt` label)
  - 20% sprint capacity for cleanup
- [ ] **Bundle analysis**: Monthly `source-map-explorer` report
- [ ] **Dependency updates**: Renovate/Dependabot (auto-merge patch/minor)
- [ ] **Dead code elimination**: `unimported` or `ts-prune`

### ✅ Team & Collaboration

- [ ] **PR template**:

  ```md
  ## Changes

  - What & why

  ## Testing

  - Unit: ✅
  - E2E: ✅
  - Accessibility: ✅

  ## Screenshots

  Before / After
  ```

- [ ] **Code review checklist** (add to PR template):
  - [ ] No `console.log`
  - [ ] Types are strict
  - [ ] Tests added/updated
  - [ ] Mobile/responsive checked
- [ ] **Onboarding doc**: “First 30 minutes” guide for new hires

---

## 🧯 Emergency Preparedness

### ✅ Rollback Plan

- [ ] Tag production deploys: `git tag prod-v1.2.3`
- [ ] One-click rollback (Vercel: “Redeploy” old version)
- [ ] Database migration backward-compatible (or reversible)

### ✅ Incident Response

- [ ] **PagerDuty/Opsgenie** alert for:
  - 5xx error rate > 1%
  - Latency p95 > 2s
  - JS error rate > 0.5%
- [ ] Post-mortem template:

  ```md
  ## Impact

  - Users affected: ~5k
  - Duration: 22 min

  ## Root cause

  `useOptimistic` with stale cache key

  ## Fix

  Clear cache on mutation → deployed in 8 min

  ## Prevention

  - Add E2E test for optimistic flow
  - Add cache key linter rule
  ```

---

## 📥 Bonus: Starter Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "test": "vitest",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "audit": "npm audit --production",
    "bundle-report": "npx source-map-explorer 'dist/**/*.js'",
    "storybook": "storybook dev -p 6006",
    "prepare": "husky"
  }
}
```

---

## 🔚 Final Sanity Check (Pre-Launch)

✅ **Run this before every production deploy**:

```bash
npm run lint && \
npm run typecheck && \
npm run test -- --coverage && \
npm run test:e2e && \
npm run build && \
echo "🚀 All systems go."
```

---

📥 **Download this checklist**:  
🔗 [project-checklist.md on GitHub Gist](https://gist.github.com/...)  
📥 **VS Code Task**: Save as `.vscode/tasks.json` for one-click run

---

_“Checklists seem lowly and simplistic, but they help fill in the nooks and crannies of complex systems.”_  
— Atul Gawande, _The Checklist Manifesto_

**You ship better apps when you don’t rely on memory.**  
Pin this. Share it. Iterate on it.

Let me know if you'd like any of these **auto-generated**:

- ✅ `checklist.json` for CI integration (fail build if unchecked)
- 🐳 **Dockerized dev container** (`.devcontainer/`)
- 📊 **Notion dashboard** version with progress tracking
- 🧪 **Playwright test suite** that validates checklist compliance

Happy building! 🏗️✨
