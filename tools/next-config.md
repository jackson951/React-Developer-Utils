### 📘 **File:** `notes/fundamentals/next-config.md`

# ⚙️ Next.js Configuration (`next.config.js` / `next.config.mjs`)

> The Next.js configuration file customizes **build, runtime, and development behavior**.
> Depending on your module system, it can be:
>
> * `next.config.js` → CommonJS format
> * `next.config.mjs` → ES Modules format

---

## 🧩 1️⃣ Basic Configuration

Create a `next.config.js` file at the project root:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC compiler for faster builds
};

module.exports = nextConfig;
```

### 🧠 ES Modules Alternative (`next.config.mjs`)

```js
import { defineConfig } from "next";

export default defineConfig({
  reactStrictMode: true,
  swcMinify: true,
});
```

> ⚠️ When using ESM, **avoid CommonJS syntax** (`require`, `module.exports`, `__dirname`).

---

## ⚡ 2️⃣ Common Configuration Options

| Option                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `reactStrictMode`      | Enables React’s Strict Mode for development      |
| `swcMinify`            | Uses SWC for faster JS minification              |
| `images.domains`       | Defines allowed external domains for `<Image />` |
| `experimental.appDir`  | Enables the **App Router** (`src/app`)           |
| `i18n`                 | Configures internationalization/localization     |
| `output: 'standalone'` | Prepares app for Docker or standalone deploys    |

### Example with Images & App Router

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["example.com", "cdn.example.com"],
  },
};

module.exports = nextConfig;
```

---

## 🌍 3️⃣ Environment Variables

* Define environment variables in:

  * `.env.local`
  * `.env.development`
  * `.env.production`

Access them via `process.env` or expose them through the config file:

```js
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

> ✅ Variables prefixed with `NEXT_PUBLIC_` are accessible in the **browser**.
> Use this prefix for frontend-safe values (e.g., API URLs).

---

## 🧭 4️⃣ Path Aliases

Simplify imports by defining **path aliases** in `jsconfig.json` or `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Example usage:

```js
import Button from "@/components/Button";
```

> 💡 Makes refactoring easier and keeps imports clean across large projects.

---

## 🧰 5️⃣ Useful Tips & Features

* **⚡ Turbopack** → Next.js 16+ uses Turbopack for lightning-fast dev builds.
* **🧹 Built-in Linting** → Next.js automatically integrates ESLint.
* **📦 Static Export** → Use `next export` for fully static sites.
* **🅰️ Next Fonts** → Use `next/font/google` for optimized Google Fonts.
* **🔒 Secrets** → Never hardcode API keys or secrets — use `.env` files.

---

## 🔗 6️⃣ Helpful Resources

* [📘 Next.js Config Docs](https://nextjs.org/docs/api-reference/next.config.js/introduction)
* [📂 App Router Guide](https://nextjs.org/docs/app)
* [🌍 Environment Variables](https://nextjs.org/docs/pages/building-your-application/environment-variables)
* [⚡ Turbopack Overview](https://nextjs.org/docs/app/building/turbopack)

---

> 💡 **Pro Tip:**
> Keep your `next.config.js` minimal — rely on environment variables and modular configs
> for flexibility across environments (development, staging, production).

