# 🧰 `react-developer-utils`

_A personal knowledge base, snippet library, and dev toolkit for modern React developers (2025+)._

> ✅ **Last Updated**: November 7, 2025  
> 🎯 **For**: React devs who want to **learn deeply**, **ship faster**, and **avoid reinventing the wheel**  
> 💡 Inspired by real-world projects, [EpicReact.dev](https://epicreact.dev), and React’s official philosophy: _Declarative. Component-Based. Learn Once, Write Anywhere._

---

## 🌟 Why This Exists

React evolves fast. New patterns (RSC, Server Actions, `useOptimistic`), tooling (Vite, Turbopack), and best practices (TypeScript-first, performance budgets) make it hard to stay sharp.

This repo is your **centralized, living reference** — not just code, but _context_:

- ✍️ **Notes** → _Why_ something works
- 🧩 **Snippets/Hooks/Utils** → _How_ to implement it
- 🛠️ **Tools/Playground** → _Try it now_
- 📚 **Docs** → _Plan your growth_

Think of it as your **personal React brain extension**.

---

## 🗂️ Project Structure

```
react-developer-utils/
│
├── README.md                    ← You are here
├── package.json                 ← Dev dependencies (for playground)
├── tsconfig.json                ← Optional; shared TS config
├── .gitignore
│
├── notes/                       📘 Theory & mental models
│   ├── fundamentals/            → JSX, Components, Props/State, Rendering
│   ├── advanced/                → Context, Hooks deep dive, Suspense, Error Boundaries
│   ├── architecture/            → Folder structure, Atomic Design, Clean Code
│   └── ecosystem/               → Vite, Next.js, Zustand, TanStack Query, Testing
│
├── snippets/                    💡 Copy-paste, zero-dependency snippets
│   ├── useDebounce.js           → Debounce state updates
│   ├── useOnClickOutside.js     → Close modals/dropdowns on outside click
│   ├── PortalExample.jsx        → Render modals outside React tree
│   └── ...                      → 10+ battle-tested snippets
│
├── utils/                       ⚙️ Pure helper functions (no React)
│   ├── debounce.js
│   ├── throttle.js
│   ├── formatDate.js            → Relative dates, ISO-safe parsing
│   ├── classNames.js            → `clsx`-style utility
│   └── storage.js               → `localStorage` + `sessionStorage` wrappers
│
├── hooks/                       🧩 Reusable, tested React hooks
│   ├── useFetch.js              → Abortable, retry-capable data fetching
│   ├── useMediaQuery.js         → Responsive breakpoints in JS
│   ├── useClipboard.js          → Copy to clipboard + success feedback
│   ├── useOnlineStatus.js       → Detect network connectivity
│   └── index.js                 → Barrel export (`export * from './useDebounce'`)
│
├── components/                  🧱 Lightweight, accessible, unstyled UI primitives
│   ├── Modal.jsx                → A11y-compliant, portal-based
│   ├── Tooltip.jsx              → Delayed, focusable, keyboard-navigable
│   ├── Toast.jsx                → Stackable, auto-dismiss, imperative API
│   ├── Loader.jsx               → SVG spinner (lightweight)
│   └── index.js                 → `export { Modal, Tooltip }`
│
├── tools/                       🛠️ Dev environment & workflow guides
│   ├── eslint-prettier-setup.md  → Biome or ESLint + Prettier (2025 style)
│   ├── vite-config.md           → Optimized `vite.config.ts`
│   ├── next-config.md           → App Router + RSC best practices
│   ├── husky-setup.md           → Pre-commit hooks (lint-staged)
│   ├── tailwind-setup.md        → JIT + `@layer` + dark mode
│   └── vscode-extensions.md     → Must-have extensions (React, TS, Git)
│
├── playground/                  🎮 Sandbox to experiment safely
│   ├── vite-demo/               → `npm create vite@latest -- --template react-ts`
│   └── next-demo/               → `npx create-next-app@latest --ts --tailwind`
│
└── docs/                        📚 Career & architecture guides
    ├── roadmap.md               → Zero → Senior React dev (6-month plan)
    ├── interview-questions.md   → 50+ modern React Q&A (RSC, perf, hooks)
    ├── best-practices.md        → Do’s/don’ts (2025 edition)
    ├── react-patterns.md        → Compound, State Machines, RSC patterns
    ├── project-checklist.md     → Launch-ready checklist (a11y, perf, CI/CD)
    └── learning-resources.md    → Curated free/paid resources (2025)
```

---

## ⚡ Quick Start

### 1. Clone & Explore

```bash
git clone https://github.com/jackson951/react-developer-utils.git
cd react-developer-utils
code .  # Opens in VS Code
```

### 2. Try the Playground

```bash
cd playground/vite-demo
npm install
npm run dev
# → Open http://localhost:5173
```

### 3. Copy a Hook

```js
// hooks/useDebounce.js
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

→ Paste into your project. Zero dependencies.

---

## 📦 How to Use This Repo

| Scenario                     | How to Use                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------- |
| **Learning a concept**       | Read `notes/fundamentals/jsx.md` → run `playground/vite-demo` → tweak `App.jsx` |
| **Building a modal**         | Copy `components/Modal.jsx` + `snippets/PortalExample.jsx`                      |
| **Debouncing search**        | Drop `hooks/useDebounce.js` into your `src/hooks/`                              |
| **Setting up a new project** | Follow `tools/vite-config.md` + `tools/eslint-prettier-setup.md`                |
| **Prepping for interviews**  | Study `docs/interview-questions.md` + `docs/react-patterns.md`                  |
| **Auditing your app**        | Run through `docs/project-checklist.md` before launch                           |

> 🔁 **Pro Tip**: Fork this repo → customize it → keep it in sync with your evolving knowledge.

---

## 🧪 Playground Setup (Optional)

The `playground/` includes minimal demos to test concepts:

```bash
# Install root dev deps (for tooling scripts)
npm install

# Run Vite demo
npm run dev:vite

# Run Next.js demo
npm run dev:next
```

Add to `package.json`:

```json
{
  "scripts": {
    "dev:vite": "npm --prefix playground/vite-demo run dev",
    "dev:next": "npm --prefix playground/next-demo run dev"
  }
}
```

---

## 📚 Core Philosophy

This repo follows React’s 2025 principles:

| Principle                      | Applied Here                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Declarative**                | Notes explain _what_, not just _how_ (e.g., “Why React re-renders”)                                            |
| **Component-Based**            | Every hook/component is self-contained, composable, testable                                                   |
| **Learn Once, Write Anywhere** | Utils/hooks work in Vite, Next.js, React Native (where applicable)                                             |
| **Community-Driven**           | Inspired by [react.dev](https://react.dev), [EpicReact](https://epicreact.dev), and open-source best practices |

> ✨ From [react.dev](https://react.dev):  
> _“React lets you build user interfaces out of individual pieces called components… It is designed to let you seamlessly combine components written by independent people, teams, and organizations.”_
>
> This repo is your **personal component library** — for knowledge, not just code.

---

## 🤝 Contributing & Personalizing

This is **your** toolkit. To adapt it:

1. ✅ **Fork it**
2. ✏️ **Edit notes** — add your own insights, gotchas, diagrams
3. ➕ **Add snippets** — when you solve a tricky bug, save it here
4. 🧪 **Expand playground** — add Remix, Expo, or tRPC demos
5. 📤 **Sync upstream** — occasionally `git pull upstream main` to get updates

> 🌱 Grow this repo like a garden — prune outdated patterns, plant new ones.

---

## 🔗 Related Resources

- 📘 [Official React Docs](https://react.dev) — _Always start here_
- 🎓 [EpicReact.dev](https://epicreact.dev) — _Deep mastery, React 19-ready_
- 🛠️ [React Patterns](https://reactpatterns.com) — _Classic patterns, still relevant_
- 📊 [React Status](https://react.statuscode.com) — _Weekly updates_

---

## 📜 License

MIT — Use freely in personal and commercial projects.  
_(Attribution appreciated but not required.)_

---

> 💬 **“The best React developers aren’t those who memorize APIs — they’re the ones who understand the _why_, and have a system to recall it.”**  
> — _Adapted from Kent C. Dodds_

🚀 **Your next step**:  
→ Open `notes/fundamentals/components.md`  
→ Skim for 5 minutes  
→ Try building a `<Counter>` in `playground/vite-demo/src/App.jsx`

You’ve got this.

---

_Curated with ❤️ for the React community — Nov 2025_  
_Structure inspired by real-world dev workflows at Meta, Vercel, and open-source teams._
