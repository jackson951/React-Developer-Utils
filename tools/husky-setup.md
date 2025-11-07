````markdown
# Husky Setup for Git Hooks

Husky allows you to **run scripts automatically on Git hooks**, like `pre-commit` or `pre-push`. This is useful to **lint, format, and test code** before committing.

---

## 1️⃣ Install Husky

```bash
npm install --save-dev husky
```
````

---

## 2️⃣ Initialize Husky

```bash
npx husky install
```

> This will create a `.husky/` directory in your project root.

### Optional: Add install script to package.json

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

> This ensures Husky is automatically installed when someone runs `npm install`.

---

## 3️⃣ Add a Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npm run lint:fix"
```

- Runs `npm run lint:fix` before every commit.
- Make the hook executable:

```bash
chmod +x .husky/pre-commit
```

---

## 4️⃣ Add a Pre-Push Hook (Optional)

```bash
npx husky add .husky/pre-push "npm test"
```

- Ensures tests pass before pushing to remote.

---

## 5️⃣ Integrating with Lint-Staged

**Lint-Staged** allows you to **run scripts only on staged files** instead of the whole project.

### Install Lint-Staged

```bash
npm install --save-dev lint-staged
```

### Add configuration in package.json

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,scss,md}": [
    "prettier --write"
  ]
}
```

### Update Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## 6️⃣ Example Workflow

1. Developer modifies files.
2. Runs `git add .`
3. On commit, Husky triggers `pre-commit` hook.
4. Lint-Staged formats and fixes staged files automatically.
5. Commit only succeeds if all checks pass.

---

## 7️⃣ Useful Links

- [Husky Official Docs](https://typicode.github.io/husky/#/)
- [Lint-Staged GitHub](https://github.com/okonet/lint-staged)
- [Integrating Husky with ESLint & Prettier](https://dev.to/namirsab/comment/2c60)

---

> 💡 Tip: Using Husky + Lint-Staged ensures **clean code** and prevents **bad commits** from entering your main branches.
