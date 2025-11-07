### 📘 **File:** `notes/ecosystem/nextjs-tips.md`


# ⚡ Next.js Tips & Best Practices

> A collection of practical tips, patterns, and gotchas for building production-grade Next.js applications.

---

## 🚀 1. Project Setup

### ✅ Create a new project

```bash
npx create-next-app@latest my-app
# or with TypeScript
npx create-next-app@latest my-app --typescript
```
````

### ✅ Folder structure (recommended)

```
my-app/
├── app/                     # (Next.js 13+ App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── hello/route.ts
├── components/
├── hooks/
├── lib/
├── styles/
└── public/
```

> 💡 Prefer the **App Router** (introduced in Next 13) for server components, streaming, and better data fetching.

---

## 🧩 2. Routing & Navigation

### ✅ Dynamic routes

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

### ✅ Catch-all routes

```tsx
// app/docs/[...slug]/page.tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
  return <pre>{JSON.stringify(params.slug, null, 2)}</pre>;
}
```

### ✅ Navigation

```tsx
import Link from "next/link";

<Link href="/about">About</Link>;
```

---

## ⚙️ 3. Data Fetching

### ✅ Server-side rendering (SSR)

```tsx
export default async function Page() {
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store",
  });
  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### ✅ Static generation (SSG)

```tsx
export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}
```

### ✅ Incremental Static Regeneration (ISR)

```tsx
export const revalidate = 60; // seconds
```

> 💡 ISR automatically rebuilds pages in the background when data changes.

---

## 🧠 4. Layouts & Metadata

### ✅ Nested layouts

Layouts are **React Server Components** that wrap pages.

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### ✅ Metadata API

```tsx
export const metadata = {
  title: "Dashboard",
  description: "Your main dashboard area",
};
```

---

## 🎯 5. Optimizing Performance

### ✅ Image optimization

```tsx
import Image from "next/image";

<Image src="/hero.png" alt="Hero" width={600} height={400} priority />;
```

### ✅ Script optimization

```tsx
import Script from "next/script";

<Script src="https://analytics.js" strategy="afterInteractive" />;
```

### ✅ Bundle analysis

```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});
```

Run with:

```bash
ANALYZE=true npm run build
```

---

## 🧰 6. Useful Built-in APIs

- `next/link` → Client-side navigation
- `next/image` → Optimized images
- `next/font` → Local and Google Fonts
- `next/navigation` → Hooks for App Router (`useRouter`, `redirect`, `usePathname`)
- `next/server` → Middleware, Edge runtime APIs

---

## 🔐 7. Authentication

### ✅ Using NextAuth.js

```bash
npm install next-auth
```

```tsx
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

> 💡 For secure sessions, use `next-auth` with the **App Router** (v4.22+ supports it natively).

---

## 🧱 8. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

Access in code:

```tsx
process.env.NEXT_PUBLIC_API_URL;
```

> Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## 🧪 9. Testing

### ✅ Using Jest + Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Example test:

```tsx
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

test("renders heading", () => {
  render(<Home />);
  expect(screen.getByText("Welcome")).toBeInTheDocument();
});
```

---

## 🚀 10. Deployment

### ✅ Vercel (recommended)

```bash
vercel --prod
```

or just connect your GitHub repo to [vercel.com](https://vercel.com/).

### ✅ Self-hosting

```bash
npm run build
npm start
```

> Use `output: "standalone"` in `next.config.js` for Docker or custom hosting.

---

## 💡 11. Developer Productivity Tips

- Use **TypeScript** for safer data handling.
- Create a `/lib` folder for reusable utilities and API helpers.
- Keep UI components in `/components` and hooks in `/hooks`.
- Use `next/font/google` for built-in, optimized fonts.
- Add ESLint + Prettier for consistent formatting:

  ```bash
  npx next lint
  ```

---

## 🔗 12. Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Vercel Analytics](https://vercel.com/analytics)
- [Bundle Analyzer Plugin](https://www.npmjs.com/package/@next/bundle-analyzer)

---

✅ **Summary**

> Next.js combines the best of React, SSR, and static generation — ideal for fast, SEO-friendly web apps.
> Master layouts, data fetching, and optimization early to scale your projects cleanly.


