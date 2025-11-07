# ⚡ `nextjs-tips.md`  
*Next.js Pro Tips & Best Practices (App Router, React 19 — 2025 Edition)*

> ✅ **Last Updated**: November 7, 2025  
> 🎯 **For**: Developers using **Next.js 14+ with App Router**  
> 📌 **Assumes**: TypeScript, Server Components, `use client`, Server Actions

---

## 🚀 1. Project Setup

### ✅ Create a new project (recommended flags)
```bash
npx create-next-app@latest my-app \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

| Flag | Why |
|------|-----|
| `--app` | ✅ Enables **App Router** (required for RSC, streaming) |
| `--src-dir` | Cleaner root (`src/` instead of flat structure) |
| `--import-alias "@/*"` | Absolute imports (`import Button from '@/components/ui/Button'`) |

---

## 🗂️ 2. Folder Structure (2025 Standard)

```
my-app/
├── src/
│   ├── app/                     # App Router
│   │   ├── layout.tsx           # Root layout (Server Component)
│   │   ├── page.tsx             # Homepage
│   │   └── api/                 # Route handlers (optional)
│   │       └── hello/route.ts
│   │
│   ├── components/
│   │   ├── ui/                  # Design-system primitives (Button, Card)
│   │   └── features/            # Business components (CheckoutForm)
│   │
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utils, API clients, types
│   ├── styles/                  # Global CSS, Tailwind config
│   └── public/                  # Static assets
│
├── .env.local                   # Local env (gitignored)
├── next.config.js
├── tsconfig.json
└── package.json
```

> 💡 **Rule of thumb**:  
> - Keep `app/` **lean** — compose pages from `components/` and `lib/`.  
> - Avoid logic in `app/` — push to `lib/` or Server Components.

---

## 🧩 3. Routing & Navigation

### ✅ Dynamic Routes
```tsx
// app/blog/[slug]/page.tsx
export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug); // ✅ Data fetch in Server Component
  return <article>{post.title}</article>;
}
```

### ✅ Catch-all Routes
```tsx
// app/docs/[...slug]/page.tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
  // slug = ['getting', 'started'] for /docs/getting/started
  return <nav>{params.slug.join(' > ')}</nav>;
}
```

### ✅ Navigation (App Router)
```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

// Static
<Link href="/dashboard">Dashboard</Link>

// Programmatic
const router = useRouter();
router.push("/settings");
```

---

## ⚙️ 4. Data Fetching (Modern Patterns)

### ✅ Server Components (Preferred)
```tsx
// app/page.tsx
export default async function Home() {
  const posts = await db.post.findMany(); // ✅ Direct DB access — no API layer
  return <PostsList posts={posts} />;
}
```

### ✅ Caching & Revalidation
```ts
// lib/data.ts
export const getPosts = async () => {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });
  return res.json();
};
```

| Strategy | `next` config | Use Case |
|---------|----------------|----------|
| **Static** | `revalidate: false` (default) | Blog posts, docs |
| **ISR** | `revalidate: 60` | Product catalog, dashboards |
| **Dynamic** | `cache: 'no-store'` | User-specific data (e.g., `/profile`) |

### ✅ Streaming with Suspense
```tsx
// app/page.tsx
export default function Page() {
  return (
    <div>
      <NavBar />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts /> {/* Suspends until data loads */}
      </Suspense>
    </div>
  );
}
```

---

## 📤 5. Mutations: Server Actions > API Routes

### ✅ Basic Server Action
```ts
// lib/actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  await db.post.create({ data: { title } });
}
```

```tsx
// Client Component
"use client";

export default function PostForm() {
  const [state, formAction] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" required />
      <button disabled={state?.pending}>
        {state?.pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

✅ **Benefits**:  
- Type-safe (no `fetch`/JSON parsing)  
- Built-in pending states  
- Works with JS disabled (progressive enhancement)  
- Combine with `useOptimistic` for instant UI feedback

---

## 🎨 6. Layouts & Metadata

### ✅ Nested Layouts (Server Components)
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      <Sidebar />
      <main className="p-4">{children}</main>
    </div>
  );
}
```

### ✅ Dynamic Metadata
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverUrl],
    },
  };
}
```

---

## 🚀 7. Performance Optimizations

### ✅ Image Optimization
```tsx
import Image from "next/image";

<Image
  src="/hero.avif"     // ✅ Prefer AVIF > WebP > PNG
  alt="Hero"
  width={1200}
  height={600}
  priority              // For LCP images
  className="object-cover"
/>
```

### ✅ Font Optimization
```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### ✅ Bundle Analysis
```bash
npm install -D @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({});
```

→ Run: `ANALYZE=true npm run build`

---

## 🔐 8. Authentication (NextAuth.js v5+)

### ✅ App Router Setup
```bash
npm install next-auth@beta @auth/core
```

```ts
// src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
});
```

```ts
// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login");

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
```

✅ **Why v5?**  
- Full App Router support  
- Simpler API (`handlers`, `auth`)  
- Built-in `/api/auth/...` routes

---

## 🌐 9. Environment Variables

### `.env.local`
```env
# Client-side (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.prod.com

# Server-side (never exposed)
DATABASE_URL=postgres://...
AUTH_SECRET=your_strong_32+_char_secret
```

✅ **Validate at runtime** (`lib/env.ts`):
```ts
import { z } from "zod";

export const env = z
  .object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    DATABASE_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(32),
  })
  .parse(process.env);
```

---

## 🧪 10. Testing Strategy

| Type | Tool | Why |
|------|------|-----|
| **Unit** | Vitest + RTL | ✅ Faster than Jest, ESM-native |
| **E2E** | Playwright | ✅ Reliable, modern, supports auth flows |
| **Visual** | Storybook + Chromatic | ✅ Catch UI regressions |

**Vitest config** (`vitest.config.ts`):
```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

---

## 🚀 11. Deployment & Observability

### ✅ Vercel (Recommended)
- Zero-config preview deployments  
- Built-in **Analytics**, **Speed Insights**, **AI Gateway**  
- `vercel --prod` for CLI deploy

### ✅ Self-Hosting (Docker)
```js
// next.config.js
module.exports = {
  output: "standalone", // ✅ Generates minimal Docker image
};
```

### ✅ Observability
- **Vercel Analytics**: Real-user metrics (FCP, LCP, INP)  
- **Vercel Logs**: Runtime logs across all environments  
- **Sentry**: Error tracking + source maps

---

## 💡 12. Pro Tips

| Tip | Why |
|-----|-----|
| **Avoid `use client` overuse** | Every Client Component = JS bundle bloat |
| **Use `cache()` for DB calls** | Prevents duplicate queries in one request |
| **Server Actions + `zod`** | Type-safe validation on server |
| **Parallel Routes for Modals** | `/settings?modal=edit` → clean UX |
| **Route Groups `(marketing)/`** | Organize without affecting URLs |

---

## 🔗 Useful Resources

| Resource | Link |
|---------|------|
| **Next.js Docs (App Router)** | [nextjs.org/docs/app](https://nextjs.org/docs/app) |
| **Next.js Conf 2025** | [youtube.com/@nextjs](https://youtube.com/@nextjs) |
| **NextAuth.js v5 Guide** | [next-auth.js.org](https://next-auth.js.org) |
| **Vercel Analytics** | [vercel.com/analytics](https://vercel.com/analytics) |
| **Bundle Analyzer** | [npmjs.com/package/@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) |

---

> ✅ **Summary**:  
> *Next.js isn’t just a framework — it’s a full-stack platform. Leverage Server Components for data, Server Actions for mutations, and streaming for performance. Let the framework handle the hard parts — you focus on building great products.*
