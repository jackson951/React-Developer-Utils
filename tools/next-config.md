````markdown
# Next.js Configuration (`next.config.js` / `next.config.mjs`)

Next.js uses a configuration file to customize the build, runtime, and development behavior of your project. This file is usually named:

- `next.config.js` (CommonJS)
- `next.config.mjs` (ES Modules)

---

## 1️⃣ Basic Configuration

Create `next.config.js` in the project root:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC compiler for faster builds
};

module.exports = nextConfig;
```
````

Or with ES Modules (`next.config.mjs`):

```js
import { defineConfig } from "next";

export default defineConfig({
  reactStrictMode: true,
  swcMinify: true,
});
```

> ⚠️ If using ES Modules, **do not use `__dirname`** or CommonJS syntax.

---

## 2️⃣ Common Configuration Options

| Option                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `reactStrictMode`      | Enables React Strict Mode for dev warnings     |
| `swcMinify`            | Uses SWC for minification (faster than Terser) |
| `images.domains`       | Allows external image domains in `<Image />`   |
| `experimental.appDir`  | Enables the new App Router (`src/app`)         |
| `i18n`                 | Configure internationalization/localization    |
| `output: 'standalone'` | For Docker-friendly builds                     |

Example with images & App Router:

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

## 3️⃣ Environment Variables

- Use `.env.local`, `.env.development`, or `.env.production` to define environment variables.
- Access in Next.js with `process.env.MY_VAR` or `next.config.js` `env` property:

```js
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

> ✅ Prefix with `NEXT_PUBLIC_` if you need it accessible in the browser.

---

## 4️⃣ Aliases

To simplify imports, configure path aliases in `jsconfig.json` or `tsconfig.json`:

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

Then import:

```js
import Button from "@/components/Button";
```

---

## 5️⃣ Useful Tips

- **Turbopack**: Next.js 16 uses Turbopack for faster dev builds.
- **Linting**: Next.js auto-configures ESLint.
- **Static Export**: Use `next export` for static-only projects.
- **Next Fonts**: Use Google Fonts via `next/font/google`.

---

## 6️⃣ Useful Links

- [Next.js Config Docs](https://nextjs.org/docs/api-reference/next.config.js/introduction)
- [App Router Guide](https://nextjs.org/docs/app)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/environment-variables)
- [Next.js Turbopack](https://nextjs.org/docs/app/building/turbopack)

---

> 💡 Tip: Keep your `next.config.js` minimal and use environment variables for secrets or environment-specific configs.
