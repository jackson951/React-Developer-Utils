# ⚡ Vite Setup for React Projects

> Vite is a fast, modern build tool for frontend projects.  
> It provides **instant hot module replacement (HMR)** and optimized builds, making it the best companion for React development.

---

## 🚀 1. Create a New Vite Project

```bash
# With npm
npm create vite@latest my-react-app -- --template react-ts

# With yarn
yarn create vite my-react-app --template react-ts

# With pnpm
pnpm create vite my-react-app --template react-ts
```

Alternatively, manually set up in an existing folder:

```bash
npm install --save-dev vite @vitejs/plugin-react
```

> **Always choose the TypeScript template (`react-ts`) – type safety from day one.**

---

## ⚙️ 2. Project Structure (Recommended)

```
my-react-app/
├── index.html               # Entry HTML (Vite requires it in root)
├── package.json
├── tsconfig.json
├── tsconfig.node.json       # Separate config for Vite config file
├── vite.config.ts
├── public/                  # Static assets (favicon, robots.txt)
└── src/
    ├── main.tsx             # Application entry
    ├── App.tsx
    ├── assets/              # Images, fonts
    ├── components/          # Shared components
    ├── hooks/               # Custom hooks
    ├── lib/                 # Utilities, API clients
    ├── styles/              # Global CSS
    └── types/               # TypeScript type declarations
```

---

## ⚡ 3. Vite Config for React (TypeScript)

**`vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),   // absolute imports
    },
  },
  server: {
    port: 5173,
    open: true,             // opens browser on start
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

**`tsconfig.json` (base)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    /* Path alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`tsconfig.node.json`** (for Vite config itself)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 🧩 4. Scripts in `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```

> **Note**: We use `tsc` before build to type-check the project. Vite itself only transpiles TS, it doesn't type-check.

---

## 🎨 5. Integrate Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import `index.css` in `main.tsx`:

```ts
import './index.css';
```

---

## 🔧 6. TypeScript & Absolute Imports

With the `@/` alias configured above, you can now import cleanly:

```tsx
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
```

If you want even stricter typing, add `types` folder and declare modules for `.svg`, `.css`, etc.

---

## 🧹 7. Linting & Formatting with Biome (or ESLint + Prettier)

We recommend **Biome** — a fast, all-in-one linter and formatter.

```bash
npm install --save-dev @biomejs/biome
npx @biomejs/biome init
```

Basic `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

**VS Code settings** (optional):

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  }
}
```

> If you prefer ESLint + Prettier, install the usual plugins and configure accordingly.

---

## 🧪 8. Testing with Vitest + React Testing Library

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Extend `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Now you can write tests alongside components:

```tsx
// Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('increments counter', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

Run tests:

```bash
npm test
```

---

## 🌐 9. Proxy API Requests (avoid CORS)

```ts
// vite.config.ts
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

All `/api/...` requests from the dev server will be forwarded to your backend.

---

## 🧭 10. Environment Variables

Create `.env` files:

```
# .env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=My App
```

Access in code:

```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

> Only variables prefixed with `VITE_` are exposed to the client.  
> Validate them at startup (e.g., with Zod) to catch misconfiguration early.

```ts
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
});

export const env = envSchema.parse(import.meta.env);
```

---

## 📦 11. Production Build & Deployment

```bash
npm run build   # type-check + Vite build
npm run preview # serve production build locally
```

- Output: `dist/` folder
- Deploy to Vercel, Netlify, Cloudflare Pages, or any static hosting.

For Docker, add a `Dockerfile` that serves `dist/` with nginx or similar.

---

## 💡 12. Best Practices

- **Use TypeScript** – set `strict: true`.
- **Path aliases** (`@/`) for clean imports.
- **Co-locate tests** – `Component.test.tsx` next to `Component.tsx`.
- **Keep the entry HTML (`index.html`) clean** – Vite processes it directly.
- **Leverage environment validation** to fail fast on missing config.
- **Split vendor chunks** via `rollupOptions` for better caching.
- **Use `tsc` for type-checking** in CI and pre-commit hooks.
- **Prefer `Biome`** over ESLint/Prettier for speed and simplicity.
- **Integrate `vite-plugin-pwa`** if you need offline support.

---

## 🔗 13. Resources

- [Vite Official Docs](https://vitejs.dev/)
- [Vite + React Guide](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/guides/vite)
- [Vitest](https://vitest.dev/)
- [Biome](https://biomejs.dev/)
- [Vite Plugin React](https://github.com/vitejs/vite-plugin-react)

---

## ✅ Summary

> Vite is the default build tool for modern React apps.  
> It combines instant HMR, an optimized build pipeline, and seamless TypeScript/React support.  
> Pair it with Tailwind, Vitest, and Biome for a best-in-class developer experience.  
> Ship faster, stay happy.
```
