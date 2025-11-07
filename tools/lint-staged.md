### 📘 **File:** `notes/fundamentals/lint-staged-setup.md`

# 🧹 Lint-Staged Setup

> **Lint-Staged** lets you run scripts **only on staged files** before committing.
> It’s typically used with **ESLint, Prettier**, or **tests** to ensure your code is clean — fast.

---

## ⚙️ 1️⃣ Install Lint-Staged

```bash
npm install --save-dev lint-staged
```

---

## 🧩 2️⃣ Add Configuration

You can define your configuration directly in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,md,json}": ["prettier --write"]
  }
}
```

✅ **Explanation:**

* Runs **ESLint + Prettier** on all staged JS/TS files
* Runs **Prettier** on CSS, SCSS, Markdown, and JSON files

---

### 📂 Alternative: Separate Config File

Create a `lint-staged.config.js` in your project root:

```js
module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,md,json}": ["prettier --write"],
};
```

> 💡 Use this if you prefer keeping your `package.json` clean or need advanced customization.

---

## 🪄 3️⃣ Integrate with Husky

Add a **pre-commit hook** using Husky:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

* Husky triggers **Lint-Staged** on each commit.
* Only **staged files** are linted and formatted.
* Prevents unformatted or broken code from being committed.

---

## 🔁 4️⃣ Example Workflow

1. Modify files in your project
2. Stage files:

   ```bash
   git add .
   ```
3. Commit changes:

   ```bash
   git commit -m "feat: add button component"
   ```
4. Lint-Staged runs ESLint + Prettier on staged files
5. Commit completes only if all checks pass ✅

---

## 💡 5️⃣ Extra Tips

* Run tests automatically before pushing:

  ```bash
  npx husky add .husky/pre-push "npm test"
  ```

* Run Lint-Staged manually anytime:

  ```bash
  npx lint-staged
  ```

* Make sure your **VS Code Prettier settings** align with your project’s `.prettierrc`
  to avoid inconsistent formatting.

---

## 📚 6️⃣ Useful Resources

* [🧹 Lint-Staged GitHub](https://github.com/okonet/lint-staged)
* [🐶 Husky + Lint-Staged Docs](https://typicode.github.io/husky/#/?id=lint-staged)
* [🧩 ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
* [🎨 Prettier Documentation](https://prettier.io/docs/en/index.html)

---

> 💡 **Pro Tip:**
> Combine **Lint-Staged + Husky + ESLint + Prettier** for an automated,
> reliable workflow that **keeps your commits clean and consistent**.

