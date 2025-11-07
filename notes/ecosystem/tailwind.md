### 📘 **File:** `notes/ecosystem/tailwind.md`

````markdown
# 🎨 Tailwind CSS — Complete Guide for React Developers

> Tailwind CSS is a utility-first CSS framework for building modern, responsive UIs quickly and consistently.

---

## 🚀 1. Installation & Setup (Vite or CRA)

### ✅ Using Vite (Recommended)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
````

This creates:

```
tailwind.config.js
postcss.config.js
```

### ✅ Configure paths

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### ✅ Import Tailwind into your CSS

In `src/index.css` or `src/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ✅ Run the dev server

```bash
npm run dev
```

You can now use Tailwind classes like:

```jsx
<h1 className="text-3xl font-bold text-blue-500">Hello Tailwind!</h1>
```

---

## 🧩 2. Folder Setup Example

```
src/
├── components/
│   ├── Button.jsx
│   └── Card.jsx
├── styles/
│   └── index.css
└── main.jsx
```

Example `Button.jsx`:

```jsx
export default function Button({ children }) {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
      {children}
    </button>
  );
}
```

---

## 🎨 3. Theme Customization

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: "#2563eb",
      secondary: "#9333ea",
      accent: "#f59e0b",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      mono: ["Fira Code", "monospace"],
    },
  },
}
```

Example usage:

```jsx
<h2 className="text-primary font-sans">Custom color and font</h2>
```

---

## 🌗 4. Dark Mode

### Enable dark mode

```js
module.exports = {
  darkMode: "class", // or 'media'
};
```

Use in React:

```jsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  <p>Switch to dark mode</p>
</div>
```

Toggle with JS:

```jsx
document.documentElement.classList.toggle("dark");
```

> 💡 Use a toggle hook or `useTheme()` context for dark mode state management.

---

## 📱 5. Responsive Design

Tailwind makes responsive styling simple with prefixes:

| Breakpoint | Prefix | Min Width |
| ---------- | ------ | --------- |
| `sm:`      | 640px  |           |
| `md:`      | 768px  |           |
| `lg:`      | 1024px |           |
| `xl:`      | 1280px |           |
| `2xl:`     | 1536px |           |

Example:

```jsx
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text
</div>
```

---

## ⚡ 6. Flexbox & Grid

### Flex

```jsx
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Grid

```jsx
<div className="grid grid-cols-3 gap-4">
  <div className="bg-gray-200 p-2">1</div>
  <div className="bg-gray-200 p-2">2</div>
  <div className="bg-gray-200 p-2">3</div>
</div>
```

---

## ✨ 7. Hover, Focus, Active, and Transitions

```jsx
<button className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 active:scale-95 transition-all">
  Click me
</button>
```

---

## 💫 8. Animations & Transitions

### Built-in utilities

```jsx
<div className="animate-pulse">Loading...</div>
```

### Custom keyframes

```js
extend: {
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
  },
  animation: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
  },
}
```

Usage:

```jsx
<div className="animate-fadeIn">Smooth Fade In</div>
```

---

## 🧠 9. Reusable Components (Using @apply)

You can compose classes inside a CSS file:

```css
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition;
}
```

Use in JSX:

```jsx
<button className="btn">Click</button>
```

---

## 🧱 10. Plugins

### Install official plugins

```bash
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

Add to config:

```js
plugins: [
  require("@tailwindcss/forms"),
  require("@tailwindcss/typography"),
  require("@tailwindcss/aspect-ratio"),
],
```

Example:

```jsx
<article className="prose lg:prose-xl">
  <h1>Beautiful Typography</h1>
</article>
```

---

## 🧩 11. Using Tailwind with React Libraries

- ✅ **Framer Motion**: Works beautifully with Tailwind classes for animation.
- ✅ **React Hook Form**: Use Tailwind for form styling.
- ✅ **Headless UI / Radix UI / shadcn/ui**: Combine accessibility + Tailwind styling.

Example with Framer Motion:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="bg-slate-800 text-white p-4 rounded-2xl"
>
  Hello Animation
</motion.div>
```

---

## 🧰 12. Optimization Tips

- ✅ Use `@layer components` for custom utilities
- ✅ Remove unused CSS (Tailwind does this automatically via Purge)
- ✅ Prefer **semantic React components** with Tailwind classes
- ✅ Install **Prettier plugin for Tailwind** to auto-sort class names:

  ```bash
  npm install -D prettier prettier-plugin-tailwindcss
  ```

---

## 🧪 13. Common Issues

| Problem                | Solution                                                         |
| ---------------------- | ---------------------------------------------------------------- |
| Styles not applying    | Ensure `content` paths in `tailwind.config.js` are correct       |
| Dark mode not toggling | Check `darkMode: "class"` and toggle `classList` on `<html>`     |
| Fonts not changing     | Import custom fonts in `index.css` and extend `theme.fontFamily` |

---

## 🧱 14. Best Practices

✅ Keep class lists readable (split over lines if needed):

```jsx
<div
  className="
    flex flex-col items-center
    bg-gray-800 text-white
    p-6 rounded-xl shadow-lg
  "
>
  ...
</div>
```

✅ Use reusable class patterns with `@apply`
✅ Extend the config file, don’t override it
✅ Pair Tailwind with **Framer Motion**, **Radix UI**, or **shadcn/ui** for beautiful component libraries

---

## 🔗 15. Useful Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com/)
- [Tailwind UI](https://tailwindui.com/)
- [Prettier Tailwind Plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [shadcn/ui](https://ui.shadcn.com/)
- [Heroicons](https://heroicons.com/)

---

✅ **Summary**

> Tailwind CSS = speed + consistency + customization.
> Combine it with good component patterns, dark mode, and utility reusability — and you’ll ship stunning UIs fast.
