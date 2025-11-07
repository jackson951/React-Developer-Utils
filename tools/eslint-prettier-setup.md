````markdown
# ESLint + Prettier Setup for React / Next.js / Vite

This guide will help you set up **ESLint** and **Prettier** in your React, Next.js, or Vite project to ensure **consistent code formatting** and **linting rules**.

---

## 1️⃣ Install Dependencies

### For JavaScript projects

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```
````

### For React projects

```bash
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
```

### For Next.js projects

```bash
npm install --save-dev eslint-config-next
```

### Optional: TypeScript support

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 2️⃣ Initialize ESLint

```bash
npx eslint --init
```

- Choose **"To check syntax, find problems, and enforce code style"**
- Pick your framework: **React**
- Choose **JavaScript** or **TypeScript**
- Choose **ESM** or **CommonJS** depending on your project
- Select your preferred style guide or custom
- Choose **JSON** or **JS** format for the config

This generates an **`.eslintrc.json`** (or `.eslintrc.js`) file.

---

## 3️⃣ Configure `.eslintrc.json`

Example for **React + Prettier**:

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

> Notes:
>
> - `"plugin:prettier/recommended"` automatically integrates Prettier into ESLint.
> - `"react/react-in-jsx-scope": "off"` is needed for Next.js 12+ or React 17+.

---

## 4️⃣ Configure Prettier

Create **`.prettierrc`**:

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

Optional: **`.prettierignore`** to exclude files:

```
node_modules
dist
build
*.min.js
```

---

## 5️⃣ Add NPM Scripts

Update your `package.json`:

```json
"scripts": {
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
  "format": "prettier --write ."
}
```

- `npm run lint` → check linting issues
- `npm run lint:fix` → auto-fix linting issues
- `npm run format` → format code with Prettier

---

## 6️⃣ VS Code Integration

1. Install VS Code extensions:

   - **ESLint**
   - **Prettier - Code formatter**

2. Add to your workspace settings (`.vscode/settings.json`):

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

---

## 7️⃣ Optional: Husky + lint-staged

Automatically lint and format before committing:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

---

## ✅ Summary

- ESLint detects code issues
- Prettier formats code consistently
- Husky + lint-staged enforces formatting & linting on commit
- VS Code auto-applies formatting on save

Now your project is fully set up for **clean, consistent, and error-free code**.
