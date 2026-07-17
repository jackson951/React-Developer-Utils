# 🎨 `tailwind.md`  
*Tailwind CSS for React Developers — The Modern Guide*

> 🎯 **For**: React developers using **Vite, Next.js, or Turbopack**  
> 📌 **Assumes**: TypeScript, component-driven architecture, accessibility awareness  

---

## 🚀 1. Installation & Setup

### ✅ Vite + React (Recommended)
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install Tailwind + deps
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### ✅ Next.js App Router (Recommended)
```bash
npx create-next-app@latest my-app \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```
→ Tailwind is pre-configured 🎉

---

## ⚙️ 2. Configuration (`tailwind.config.ts`)

Use **TypeScript config** for safety and autocomplete:
```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Next.js App Router
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

✅ **Best practices**:
- Use **semantic color names** (`primary`, `danger`, `success`)  
- Extend `theme` — don’t override  
- Use `content` array to avoid missing classes in build

---

## 🧩 3. Project Structure

```
src/
├── components/
│   ├── ui/                   # Reusable primitives (Button, Card)
│   └── features/             # Business components
├── styles/
│   ├── index.css             # @tailwind imports
│   └── custom.css            # @layer + custom @keyframes
└── hooks/
    └── useTheme.ts           # Dark mode toggle
```

### `src/styles/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #111827;
  }
  .dark {
    --background: #0a0a0a;
    --foreground: #e5e7eb;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }
  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700;
  }
}
```

---

## 🌗 4. Dark Mode

### ✅ System-Aware, User-Overridable
```ts
// hooks/useTheme.ts
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme };
}
```

Usage:
```tsx
const { theme, toggleTheme } = useTheme();
return <button onClick={toggleTheme}>🌙 / ☀️</button>;
```

> 💡 **Pro tip**: Use `next-themes` in Next.js for SSR-compatible dark mode.

---

## 📱 5. Responsive Design

### ✅ Mobile-First + Max-Width Utilities
```tsx
<div className="w-full max-w-4xl mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} />
    ))}
  </div>
</div>
```

### ✅ Container Queries (Future-Proof)
```css
@layer utilities {
  .cq-min-w-\[400px\] {
    container-type: inline-size;
  }
}

@container (min-width: 400px) {
  .cq-card-title {
    font-size: 1.25rem;
  }
}
```

```tsx
<div className="cq-min-w-[400px]">
  <h3 className="cq-card-title">Responsive per container</h3>
</div>
```

---

## 🧠 6. Component Patterns

### ✅ Atomic UI Primitives (`components/ui/Button.tsx`)
```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  className,
  variant,
  size,
  ...props
}: ButtonProps) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
```

✅ **Why this pattern?**  
- Type-safe variants (via `cva`)  
- Composable with `cn()` (see below)  
- Matches `shadcn/ui`, Radix, and modern design systems

> Install helpers:  
> ```bash
> npm install class-variance-authority clsx tailwind-merge
> ```

### ✅ `cn` Utility (Merge + Tailwind-safe class names)
```ts
// lib/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 🧰 7. Essential Plugins

| Plugin | Why | Install |
|--------|-----|---------|
| `@tailwindcss/forms` | Better `<input>`, `<select>` reset | `npm install -D @tailwindcss/forms` |
| `@tailwindcss/typography` | Beautiful prose with `prose` class | `npm install -D @tailwindcss/typography` |
| `tailwindcss-animate` | Enhanced animations for `shadcn/ui` | `npm install -D tailwindcss-animate` |
| `prettier-plugin-tailwindcss` | Auto-sort class names (dev ergonomics) | `npm install -D prettier-plugin-tailwindcss` |

Example `tailwind.config.ts`:
```ts
plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
  require('tailwindcss-animate'),
],
```

---

## 🧪 8. Optimizations & Gotchas

| Issue | Fix |
|-------|-----|
| **FOUC (Flash of Unstyled Content)** | Add `class="dark"` to `<html>` via SSR (Next.js: `RootLayout`) |
| **Unused class purge fails** | Double-check `content` paths — include `app/`, `mdx`, etc. |
| **Class order affects output** | Use `prettier-plugin-tailwindcss` to auto-sort |
| **Custom fonts not loading** | Self-host + `font-display: swap` (Next.js: `next/font`) |

### ✅ Bundle Size Tip
Use `@apply` *sparingly* — prefer composing classes in JSX. Overusing `@apply` can bloat CSS.

---

## 🧱 9. Ecosystem Integration

### ✅ With `shadcn/ui`
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card
```
→ Auto-generates accessible, theme-aware, Tailwind-styled components.

### ✅ With Framer Motion
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="btn-primary"
>
  Animated Button
</motion.button>
```

### ✅ With Headless UI / Radix
```tsx
<Popover>
  <Popover.Trigger className="btn">Open</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content className="bg-white p-4 shadow-lg rounded">
      Popover content
    </Popover.Content>
  </Popover.Portal>
</Popover>
```

---

## 🔗 10. Essential Resources

| Resource | Link |
|---------|------|
| **Official Docs** | [tailwindcss.com](https://tailwindcss.com) |
| **Tailwind Play** | [play.tailwindcss.com](https://play.tailwindcss.com) |
| **shadcn/ui** | [ui.shadcn.com](https://ui.shadcn.com) |
| **Heroicons** | [heroicons.com](https://heroicons.com) |
| **Prettier Plugin** | [github.com/tailwindlabs/prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) |
| **CVA (Class Variance Authority)** | [cva.joe-bell.co.uk](https://cva.joe-bell.co.uk) |

---

> ✅ **Summary**:  
> *Tailwind isn’t just utility classes — it’s a design system enabler. Combine it with `cva`, `cn`, `shadcn/ui`, and dark mode hooks to build scalable, accessible, and maintainable UIs — fast.*

> 🚀 **Modern Pro Move**: Use Tailwind + React Server Components + `shadcn/ui` = production-ready UI in minutes.
```
