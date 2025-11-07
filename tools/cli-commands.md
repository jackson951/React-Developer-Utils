### 📘 **File:** `notes/fundamentals/cli-commands.md`

# ⚙️ CLI Commands for React / Next.js / Vite Projects

> A quick reference guide for commonly used **CLI commands** across
> React, Next.js, Vite, Node.js, and Git development workflows.

---

## 🧩 1️⃣ Node & npm

### 🔍 Check Versions

```bash
node -v
npm -v
```

### 📦 Initialize a New Project

```bash
npm init -y
```

### 📥 Install Dependencies

```bash
npm install <package-name>
npm install --save-dev <dev-package-name>
```

### 🗑️ Remove a Package

```bash
npm uninstall <package-name>
```

### ▶️ Run Scripts from package.json

```bash
npm run <script-name>
```

---

## ⚡ 2️⃣ Vite Commands

### 🆕 Create a New Vite + React Project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

### 🚀 Start Development Server

```bash
npm run dev
```

### 🏗️ Build for Production

```bash
npm run build
```

### 👀 Preview Production Build

```bash
npm run preview
```

---

## 🌐 3️⃣ Next.js Commands

### 🆕 Create a New Next.js App

```bash
npx create-next-app@latest my-next-app
cd my-next-app
npm install
```

### 🚀 Run Development Server

```bash
npm run dev
```

### 🏗️ Build for Production

```bash
npm run build
```

### ▶️ Start Production Server

```bash
npm start
```

### 🧹 Lint Your Code

```bash
npm run lint
```

---

## 🔧 4️⃣ Git Commands

### 🏁 Initialize Repository

```bash
git init
```

### ➕ Add Files to Staging

```bash
git add .
```

### 💾 Commit Changes

```bash
git commit -m "Commit message"
```

### 🔎 Check Status

```bash
git status
```

### 📤 Push to Remote Repository

```bash
git push origin main
```

### 📥 Pull Latest Changes

```bash
git pull origin main
```

### 🌿 Branching

```bash
git branch           # list branches
git branch <name>    # create branch
git checkout <name>  # switch branch
git merge <name>     # merge branch
```

---

## ⚙️ 5️⃣ Running React Scripts

### 🚀 Start Development Server

```bash
npm start
```

### 🏗️ Build for Production

```bash
npm run build
```

### 🧪 Run Tests

```bash
npm test
```

---

## 🧰 6️⃣ Miscellaneous Useful CLI Commands

### 🧹 Clear npm Cache

```bash
npm cache clean --force
```

### 🔄 Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### 💻 Open VS Code in Current Folder

```bash
code .
```

### 📦 Check for Outdated Packages

```bash
npm outdated
```

### 🔧 Install Missing Peer Dependencies

```bash
npx install-peerdeps <package-name>
```

### ▶️ Run a Specific Script via npx

```bash
npx <script-name>
```

---

## 🧾 7️⃣ JSON & Environment Helpers

### ✅ Validate package.json (via lint)

```bash
npm run lint
```

### 🧠 Validate JSON File Syntax

```bash
jq . <filename>.json
```

### 🌱 Load Environment Variables

```bash
source .env
```

---

## 💡 8️⃣ Helpful Tips

* ✅ Use **tab completion** to avoid typing long paths
* ⚙️ Use `--save-dev` for **dev dependencies** (e.g., ESLint, Prettier)
* ⚡ Use **`npx`** to run CLI tools without global install
* 🛑 Press **Ctrl + C** to stop dev servers
* 📘 Keep this file handy — it’s your **daily CLI cheat sheet**

---

✅ **Summary**

> Mastering CLI commands boosts your **workflow efficiency**.
> From initializing projects to deployment, these commands cover the full **React, Next.js, and Vite** ecosystem.


