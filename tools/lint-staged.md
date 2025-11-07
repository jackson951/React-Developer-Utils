````markdown
# Lint-Staged Setup

**Lint-Staged** lets you run scripts **only on staged files** in Git, making pre-commit checks faster and more efficient. Typically used with **ESLint, Prettier, or tests**.

---

## 1️⃣ Install Lint-Staged

```bash
npm install --save-dev lint-staged
```
````

---

## 2️⃣ Add Configuration

You can configure **lint-staged** in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,md,json}": ["prettier --write"]
  }
}
```

> ✅ This runs **ESLint and Prettier** on staged JS/TS files and Prettier on CSS/SCSS/Markdown/JSON files.

---

### Alternative: Separate Config File

Create a `lint-staged.config.js`:

```js
module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,md,json}": ["prettier --write"],
};
```

---

## 3️⃣ Integrate with Husky

Add a **pre-commit hook**:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

- Husky triggers the **lint-staged** script on each commit.
- Only staged files are checked and auto-fixed.

---

## 4️⃣ Example Workflow

1. Make changes to files in your project.
2. Stage files: `git add .`
3. Commit: `git commit -m "feat: add button component"`
4. **Lint-staged** auto-runs ESLint and Prettier on staged files.
5. Commit completes only if all scripts pass.

---

## 5️⃣ Useful Tips

- Combine with **pre-push hook** to run tests:

```bash
npx husky add .husky/pre-push "npm test"
```

- Run **lint-staged manually** anytime:

```bash
npx lint-staged
```

- Ensure your **VS Code Prettier settings** match lint-staged rules to avoid conflicts.

---

## 6️⃣ Useful Links

- [Lint-Staged GitHub](https://github.com/okonet/lint-staged)
- [Husky + Lint-Staged Guide](https://typicode.github.io/husky/#/?id=lint-staged)
- [ESLint Docs](https://eslint.org/docs/user-guide/getting-started)
- [Prettier Docs](https://prettier.io/docs/en/index.html)

---

> 💡 Tip: Lint-Staged + Husky ensures **clean, consistent code** in your repo and prevents bad commits.
