# ⚡ Vite Setup for React Projects

> Vite is a fast, modern build tool for frontend projects.  
> It provides **instant hot module replacement (HMR)** and optimized builds.

---

## 🚀 1. Create a New Vite Project

```bash
# Create project
npm create vite@latest react-app

# Select:
# - Framework: React
# - Variant: JavaScript or TypeScript
```

Or manually in an existing repo:

```bash
npm install --save-dev vite @vitejs/plugin-react
```

---

## ⚙️ 2. Vite Project Structure

```
react-app/
├── index.html
├── package.json
├── vite.config.js
├── node_modules/
└── src/
    ├── main.jsx
    ├── App.jsx
    └── assets/
```

> In TypeScript projects, files are `.ts` / `.tsx`.

---

## ⚡ 3. Vite Config for React

**`vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // opens browser automatically
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

---

## 🧩 4. Scripts in `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

Run commands:

```bash
npm run dev      # start development server
npm run build    # build for production
npm run preview  # preview production build locally
```

---

## 🎨 5. Integrate Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

Include Tailwind in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🔧 6. TypeScript Support

Install TypeScript:

```bash
npm install --save-dev typescript
npm install --save-dev @types/react @types/react-dom
```

Rename files:

```
src/main.jsx → src/main.tsx
src/App.jsx → src/App.tsx
```

Add `tsconfig.json` (generated with `npx tsc --init`):

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["DOM", "ESNext"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

---

## 🧪 7. ESLint & Prettier Integration

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```

**`.eslintrc.js`**

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {},
  settings: {
    react: { version: "detect" },
  },
};
```

**`.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "arrowParens": "avoid"
}
```

Run lint & fix:

```bash
npx eslint src --fix
```

---

## 🧩 8. React Refresh & HMR

Vite already includes **React Fast Refresh** via `@vitejs/plugin-react`:

```js
import react from "@vitejs/plugin-react";
```

HMR works out-of-the-box — edit your component and the browser updates instantly without losing state.

---

## 🌐 9. Proxy API Requests (Optional)

If backend API is on a different port:

```js
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
```

This avoids CORS issues during development.

---

## 🧭 10. Environment Variables

- `.env` → `VITE_API_URL=https://api.example.com`
- Access in code:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

> ⚠️ Only variables prefixed with `VITE_` are exposed to the client.

---

## 📦 11. Production Build & Deployment

```bash
npm run build
npm run preview
```

- Output: `dist/` folder
- Deploy `dist/` to Vercel, Netlify, or any static hosting

---

## 💡 12. Best Practices

✅ Use **TypeScript** for type safety  
✅ Use `.env` files for configuration  
✅ Split large apps into **src/components**, **src/hooks**, **src/utils**  
✅ Combine **Vite + React + Tailwind + React Query** for a modern stack  
✅ Keep HMR fast: avoid heavy computations during render  

---

## 🔗 13. Resources

- [Vite Docs](https://vitejs.dev/)
- [Vite + React](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Vite + Tailwind](https://tailwindcss.com/docs/guides/vite)
- [Vite Plugin React](https://github.com/vitejs/vite/tree/main/packages/plugin-react)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ Summary

> Vite = lightning-fast development server and build tool for React.  
> Combines perfectly with modern React ecosystem tools.  
> Perfect for building scalable, performant React applications.

