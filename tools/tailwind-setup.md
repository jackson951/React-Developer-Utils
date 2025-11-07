### 📘 **File:** `notes/fundamentals/tailwind-setup.md`

# 🎨 Tailwind CSS Setup Guide

> **Tailwind CSS** is a utility-first CSS framework that enables you to build **modern, responsive, and customizable** UIs quickly.
> This guide covers setup for **React**, **Vite**, and **Next.js** projects.

---

## ⚙️ 1️⃣ Install Tailwind CSS

```bash
# Install Tailwind and dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind configuration
npx tailwindcss init -p
```

✅ This creates two files:

* `tailwind.config.js`
* `postcss.config.js`

---

## 🧩 2️⃣ Configure Tailwind

Edit your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

> 🧠 The `content` array ensures Tailwind scans the correct files for utility class usage.

---

## 🎨 3️⃣ Add Tailwind Directives

In your main CSS file (e.g., `src/index.css`, `src/styles.css`, or `app/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> This injects Tailwind’s base styles, reusable components, and utilities into your project.

---

## ⚛️ 4️⃣ Using Tailwind in React

Example component:

```jsx
export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
      Click Me
    </button>
  );
}
```

✅ Combine utility classes for layout, spacing, color, typography, and effects.

---

## ⚡ 5️⃣ Vite + Tailwind Setup

If using **Vite**, confirm your `tailwind.config.js` includes:

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
```

Then start your dev server:

```bash
npm run dev
```

Tailwind utilities should now apply automatically.

---

## 🔷 6️⃣ Next.js + Tailwind Setup

### Add Tailwind Directives

In `src/app/globals.css` (App Router) or `styles/globals.css` (Pages Router):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configure Content Paths

```js
content: [
  "./src/app/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}"
];
```

Then restart your Next.js dev server:

```bash
npm run dev
```

✅ Tailwind should now work across all components and pages.

---

## 🔌 7️⃣ Recommended Plugins

Enhance Tailwind with official plugins:

| Plugin                      | Description                         |
| --------------------------- | ----------------------------------- |
| `@tailwindcss/forms`        | Improves form element styles        |
| `@tailwindcss/typography`   | Adds rich text formatting utilities |
| `@tailwindcss/aspect-ratio` | Handles responsive aspect ratios    |

### Installation Example

```bash
npm install -D @tailwindcss/forms
```

Then include in your `tailwind.config.js`:

```js
plugins: [require("@tailwindcss/forms")];
```

---

## 🔗 8️⃣ Helpful Resources

* [Tailwind CSS Docs](https://tailwindcss.com/docs)
* [Tailwind + Vite Guide](https://tailwindcss.com/docs/guides/vite)
* [Tailwind + Next.js Guide](https://tailwindcss.com/docs/guides/nextjs)
* [Tailwind Plugin Library](https://tailwindcss.com/docs/plugins)

---

> 💡 **Pro Tip:**
> Tailwind 3+ enables **JIT (Just-In-Time) mode** by default — generating styles on demand for faster builds and fully dynamic class support.

