# Tailwind CSS Setup

Tailwind CSS is a **utility-first CSS framework** for rapidly building modern web UIs. This guide covers setup for **React, Vite, and Next.js** projects.

---

## 1️⃣ Install Tailwind CSS

```bash
# Install Tailwind and dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind config
npx tailwindcss init -p
```
````

- This generates `tailwind.config.js` and `postcss.config.js`.

---

## 2️⃣ Configure Tailwind

Update `tailwind.config.js`:

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

- The `content` array ensures Tailwind scans the right files for class usage.

---

## 3️⃣ Add Tailwind Directives

In your main CSS file (e.g., `src/index.css` or `globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 4️⃣ Using Tailwind in React

```jsx
export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Click me
    </button>
  );
}
```

- Compose utility classes for **layout, spacing, typography, and colors**.

---

## 5️⃣ Vite + Tailwind

If using **Vite**, ensure `tailwind.config.js` `content` includes:

```js
"./index.html", "./src/**/*.{js,ts,jsx,tsx}";
```

Start the dev server:

```bash
npm run dev
```

Tailwind classes should work automatically.

---

## 6️⃣ Next.js + Tailwind

Next.js uses the App Router or Pages Router. Add Tailwind to `globals.css`:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- `tailwind.config.js` content paths:

```js
"./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}";
```

- Restart the dev server after changes.

---

## 7️⃣ Useful Plugins

- `@tailwindcss/forms` – Better styling for forms
- `@tailwindcss/typography` – For rich text content
- `@tailwindcss/aspect-ratio` – Manage responsive ratios

Install example:

```bash
npm install -D @tailwindcss/forms
```

Add to `tailwind.config.js`:

```js
plugins: [require("@tailwindcss/forms")];
```

---

## 8️⃣ Useful Links

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind with Vite](https://tailwindcss.com/docs/guides/vite)
- [Tailwind with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [Tailwind Plugins](https://tailwindcss.com/docs/plugins)

---

> 💡 Tip: Use **JIT mode** (enabled by default in Tailwind 3+) for faster builds and dynamic classes.
