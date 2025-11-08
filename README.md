# 🧰 React Developer Utils

<div align="center">

**Your personal knowledge base, snippet library, and dev toolkit for modern React development**

[![Last Updated](https://img.shields.io/badge/Updated-November%202025-blue.svg)](https://github.com/jackson951/react-developer-utils)
[![React](https://img.shields.io/badge/React-19%2B-61dafb.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Learn deeply. Ship faster. Stop reinventing the wheel.*

[Quick Start](#-quick-start) • [Documentation](#-project-structure) • [Contributing](#-contributing--personalizing)

</div>

---

## 🎯 Why This Exists

React evolves **fast**. New patterns emerge, tools mature, and best practices shift with every release:

- 🔄 **React Server Components** & Server Actions
- ⚡ **Modern Tooling** — Vite, Turbopack, Biome
- 🎨 **New Hooks** — `useOptimistic`, `useTransition`, `use`
- 📊 **Performance Budgets** & Core Web Vitals
- 🔐 **TypeScript-First** development

**The Challenge**: Staying sharp while shipping real products.

**The Solution**: A centralized, living reference that provides:

<table>
<tr>
<td align="center">📝<br/><b>Context</b><br/><i>Why it works</i></td>
<td align="center">🧩<br/><b>Implementation</b><br/><i>How to build it</i></td>
<td align="center">🎮<br/><b>Experimentation</b><br/><i>Try it live</i></td>
<td align="center">📚<br/><b>Growth</b><br/><i>Plan your learning</i></td>
</tr>
</table>

> **Think of it as your personal React brain extension** — battle-tested patterns, zero fluff, always up-to-date.

---

## 🗂️ Project Structure

```
react-developer-utils/
│
├── 📘 notes/                    Theory & Mental Models
│   ├── fundamentals/            → JSX, Components, Props/State, Rendering
│   ├── advanced/                → Context, Hooks Deep Dive, Suspense, Error Boundaries
│   ├── architecture/            → Folder Structure, Atomic Design, Clean Code
│   └── ecosystem/               → Vite, Next.js, Zustand, TanStack Query, Testing
│
├── 💡 snippets/                 Copy-Paste, Zero-Dependency Code
│   ├── useDebounce.js           → Debounce state updates
│   ├── useOnClickOutside.js     → Close modals/dropdowns on outside click
│   ├── PortalExample.jsx        → Render modals outside React tree
│   └── ...                      → 10+ battle-tested snippets
│
├── ⚙️ utils/                    Pure Helper Functions (Framework Agnostic)
│   ├── debounce.js              → Delay function execution
│   ├── throttle.js              → Rate-limit function calls
│   ├── formatDate.js            → Relative dates, ISO-safe parsing
│   ├── classNames.js            → Conditional class composition
│   └── storage.js               → localStorage + sessionStorage wrappers
│
├── 🪝 hooks/                    Reusable, Tested React Hooks
│   ├── useFetch.js              → Abortable, retry-capable data fetching
│   ├── useMediaQuery.js         → Responsive breakpoints in JS
│   ├── useClipboard.js          → Copy to clipboard + success feedback
│   ├── useOnlineStatus.js       → Network connectivity detection
│   └── index.js                 → Barrel exports
│
├── 🧱 components/               Lightweight, Accessible UI Primitives
│   ├── Modal.jsx                → A11y-compliant, portal-based
│   ├── Tooltip.jsx              → Delayed, focusable, keyboard-navigable
│   ├── Toast.jsx                → Stackable, auto-dismiss, imperative API
│   └── Loader.jsx               → Lightweight SVG spinner
│
├── 🛠️ tools/                    Dev Environment & Workflow Guides
│   ├── eslint-prettier-setup.md → Biome or ESLint + Prettier (2025 style)
│   ├── vite-config.md           → Optimized vite.config.ts
│   ├── next-config.md           → App Router + RSC best practices
│   ├── husky-setup.md           → Pre-commit hooks with lint-staged
│   ├── tailwind-setup.md        → JIT mode + @layer utilities + dark mode
│   └── vscode-extensions.md     → Essential extensions
│
├── 🎮 playground/               Safe Experimentation Sandbox
│   ├── vite-demo/               → Quick React prototyping
│   └── next-demo/               → App Router + RSC testing
│
└── 📚 docs/                     Career & Architecture Guides
    ├── roadmap.md               → Zero → Senior React Dev (6-month plan)
    ├── interview-questions.md   → 50+ modern React interview Q&A
    ├── best-practices.md        → Do's and Don'ts (2025 edition)
    ├── react-patterns.md        → Compound, State Machines, RSC patterns
    ├── project-checklist.md     → Production-ready checklist
    └── learning-resources.md    → Curated resources (free + paid)
```

---

## ⚡ Quick Start

### 1️⃣ Clone & Explore

```bash
git clone https://github.com/jackson951/react-developer-utils.git
cd react-developer-utils
code .  # Opens in VS Code
```

### 2️⃣ Try the Playground

```bash
cd playground/vite-demo
npm install
npm run dev
# → Open http://localhost:5173 and start experimenting
```

### 3️⃣ Copy Your First Hook

```javascript
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

**Drop it into your project. Zero dependencies. Just works.** ✨

---

## 📖 Usage Guide

<table>
<thead>
<tr>
<th>Scenario</th>
<th>How to Use</th>
</tr>
</thead>
<tbody>
<tr>
<td>🎓 <b>Learning a concept</b></td>
<td>Read <code>notes/fundamentals/jsx.md</code> → Run <code>playground/vite-demo</code> → Experiment in <code>App.jsx</code></td>
</tr>
<tr>
<td>🪟 <b>Building a modal</b></td>
<td>Copy <code>components/Modal.jsx</code> + <code>snippets/PortalExample.jsx</code></td>
</tr>
<tr>
<td>🔍 <b>Debouncing search</b></td>
<td>Drop <code>hooks/useDebounce.js</code> into <code>src/hooks/</code></td>
</tr>
<tr>
<td>🚀 <b>Starting a new project</b></td>
<td>Follow <code>tools/vite-config.md</code> + <code>tools/eslint-prettier-setup.md</code></td>
</tr>
<tr>
<td>💼 <b>Interview prep</b></td>
<td>Study <code>docs/interview-questions.md</code> + <code>docs/react-patterns.md</code></td>
</tr>
<tr>
<td>✅ <b>Pre-launch audit</b></td>
<td>Run through <code>docs/project-checklist.md</code></td>
</tr>
</tbody>
</table>

> 💡 **Pro Tip**: Fork this repo, customize it with your own insights, and keep it synced as your knowledge evolves.

---

## 🧪 Playground Setup

The `playground/` directory includes minimal demos for rapid experimentation:

```bash
# Install root dependencies (for tooling scripts)
npm install

# Run Vite demo
npm run dev:vite

# Run Next.js demo
npm run dev:next
```

**Add these scripts to your root `package.json`:**

```json
{
  "scripts": {
    "dev:vite": "npm --prefix playground/vite-demo run dev",
    "dev:next": "npm --prefix playground/next-demo run dev"
  }
}
```

---

## 🎯 Core Philosophy

Built on React's 2025 principles:

| Principle | Implementation |
|-----------|---------------|
| **Declarative** | Notes explain *what* and *why*, not just *how* |
| **Component-Based** | Every hook/component is self-contained, composable, and testable |
| **Learn Once, Write Anywhere** | Works in Vite, Next.js, and React Native (where applicable) |
| **Community-Driven** | Inspired by [react.dev](https://react.dev), [EpicReact](https://epicreact.dev), and OSS best practices |

> ✨ *"React lets you build user interfaces out of individual pieces called components… It is designed to let you seamlessly combine components written by independent people, teams, and organizations."*  
> — [react.dev](https://react.dev)

**This repo is your personal component library — for knowledge, not just code.**

---

## 🤝 Contributing & Personalizing

This is **your toolkit**. Make it yours:

1. **🍴 Fork it** — Start your personal knowledge base
2. **✏️ Edit notes** — Add insights, gotchas, diagrams
3. **➕ Add snippets** — Save solutions to tricky bugs
4. **🧪 Expand playground** — Try Remix, Expo, tRPC
5. **🔄 Sync upstream** — `git pull upstream main` for updates

> 🌱 **Grow this repo like a garden** — prune outdated patterns, plant new ones.

---

## 🔗 Recommended Resources

| Resource | Description |
|----------|-------------|
| [📘 React Docs](https://react.dev) | Official documentation — always start here |
| [🎓 EpicReact.dev](https://epicreact.dev) | Deep mastery, React 19-ready |
| [🛠️ React Patterns](https://reactpatterns.com) | Classic patterns, still relevant |
| [📊 React Status](https://react.statuscode.com) | Weekly newsletter |
| [🎥 React Conf](https://conf.react.dev) | Annual conference talks |

---

## 📜 License

**MIT** — Use freely in personal and commercial projects.

*Attribution appreciated but not required.*

---

<div align="center">

### 💬 *"The best React developers aren't those who memorize APIs — they're the ones who understand the why, and have a system to recall it."*

**— Adapted from Kent C. Dodds**

---

### 🚀 Your Next Step

1. Open `notes/fundamentals/components.md`
2. Skim for 5 minutes
3. Build a `<Counter>` in `playground/vite-demo/src/App.jsx`

**You've got this.**

---

*Curated with ❤️ for the React community — November 2025*

*Structure inspired by real-world workflows at Meta, Vercel, and open-source teams*

[⬆ Back to Top](#-react-developer-utils)

</div>
