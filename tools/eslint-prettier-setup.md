### 📘 **File:** `notes/fundamentals/eslint-prettier-setup.md`

# 🧹 ESLint + Prettier Setup for React / Next.js / Vite

> Configure **ESLint** and **Prettier** to maintain consistent code style, catch common issues,
> and enforce best practices in your **React**, **Next.js**, or **Vite** projects.

---

## ⚙️ 1️⃣ Install Dependencies

### 📦 Base Setup (JavaScript Projects)

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```

### ⚛️ React Projects

```bash
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
```

### 🌐 Next.js Projects

```bash
npm install --save-dev eslint-config-next
```

### 🧩 TypeScript Support (Optional)

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 🚀 2️⃣ Initialize ESLint

Run the setup wizard:

```bash
npx eslint --init
```

Then follow prompts:

* ✅ “To check syntax, find problems, and enforce code style”
* ✅ Framework: **React**
* ✅ Language: **JavaScript** or **TypeScript**
* ✅ Module type: **ESM** or **CommonJS**
* ✅ Choose your style guide
* ✅ Config format: **JSON** or **JS**

This creates an **`.eslintrc.json`** (or `.eslintrc.js`) configuration file.

---

## 🧩 3️⃣ Configure `.eslintrc.json`

Example config for **React + Prettier**:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["react", "react-hooks", "prettier"],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": ["error", { "singleQuote": true, "semi": true }],
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

> 💡 **Notes:**
>
> * `"plugin:prettier/recommended"` integrates Prettier with ESLint automatically.
> * `"react/react-in-jsx-scope": "off"` is required for React 17+ or Next.js 12+.

---

## 🎨 4️⃣ Configure Prettier

Create **`.prettierrc`** file:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "endOfLine": "auto"
}
```

Add optional **`.prettierignore`** file to exclude files:

```
node_modules
dist
build
*.min.js
```

---

## 🧠 5️⃣ Add NPM Scripts

Update your `package.json` scripts section:

```json
"scripts": {
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
  "format": "prettier --write ."
}
```

* `npm run lint` → Check for linting issues
* `npm run lint:fix` → Auto-fix linting problems
* `npm run format` → Format code using Prettier

---

## 💻 6️⃣ VS Code Integration

### 🧩 Required Extensions

* **ESLint**
* **Prettier – Code Formatter**

### ⚙️ Add Workspace Settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

✅ Automatically formats and lints files on save.

---

## 🔒 7️⃣ Optional: Husky + lint-staged (Pre-Commit Hooks)

### Install and Configure

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Add to `package.json`

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

✅ Automatically formats and lints staged files **before commit**.

---

## 🧭 ✅ Summary

* 🧠 **ESLint** → Detects code issues
* 🎨 **Prettier** → Enforces consistent formatting
* 🪝 **Husky + lint-staged** → Enforces linting on commit
* 💻 **VS Code** → Auto-format on save

> With this setup, your project is clean, consistent, and follows best practices out of the box.
> Write confidently — your tooling has your back.
