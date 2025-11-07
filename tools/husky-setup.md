
### 📘 **File:** `notes/fundamentals/husky-setup.md`

# 🐶 Husky Setup for Git Hooks

> **Husky** lets you automatically run scripts on Git hooks — such as `pre-commit` or `pre-push`.
> It’s ideal for ensuring **linting, formatting, and testing** happen before code is committed.

---

## ⚙️ 1️⃣ Install Husky

```bash
npm install --save-dev husky
```

---

## 🚀 2️⃣ Initialize Husky

```bash
npx husky install
```

> This command creates a `.husky/` directory in your project root.

### 🧩 Optional: Auto-install Husky

Add this to your `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

> 💡 This ensures Husky is set up automatically after `npm install`.

---

## 🧹 3️⃣ Add a Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npm run lint:fix"
```

* Runs ESLint with auto-fix before every commit.
* Make the hook executable (especially on Unix/macOS):

```bash
chmod +x .husky/pre-commit
```

---

## 🧪 4️⃣ Add a Pre-Push Hook (Optional)

```bash
npx husky add .husky/pre-push "npm test"
```

* Ensures all tests pass **before pushing to remote**.

---

## 🪄 5️⃣ Integrating with Lint-Staged

> **Lint-Staged** allows you to run scripts only on **staged files**,
> which makes commits faster and more efficient.

### 🔧 Install Lint-Staged

```bash
npm install --save-dev lint-staged
```

### 📦 Add Configuration to `package.json`

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

### 🧩 Update the Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

Now, only staged files will be linted and formatted automatically.

---

## 🔁 6️⃣ Example Workflow

1. Developer edits files
2. Runs `git add .`
3. On commit, Husky triggers `pre-commit`
4. Lint-Staged runs ESLint + Prettier on staged files
5. Commit completes **only if all checks pass**

✅ **Result:**
Clean, consistent code — no broken commits on main.

---

## 📚 7️⃣ Useful Resources

* [🐶 Husky Official Docs](https://typicode.github.io/husky/#/)
* [🧹 Lint-Staged GitHub](https://github.com/okonet/lint-staged)
* [🧩 Integrating Husky with ESLint & Prettier](https://dev.to/namirsab/comment/2c60)

---

> 💡 **Pro Tip:**
> Combining **Husky + Lint-Staged + ESLint + Prettier** creates a seamless
> workflow that **prevents bad commits** and **keeps your codebase clean**.
