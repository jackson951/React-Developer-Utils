# CLI Commands for React / Next.js / Vite Projects

This guide provides commonly used command-line interface (CLI) commands for React, Next.js, Vite, Git, Node.js, and general development workflows.

---

## 1️⃣ Node & npm

### Check Node.js version

```bash
node -v
```
````

### Check npm version

```bash
npm -v
```

### Initialize a new project

```bash
npm init -y
```

### Install dependencies

```bash
npm install <package-name>
npm install --save-dev <dev-package-name>
```

### Remove a package

```bash
npm uninstall <package-name>
```

### Run scripts from package.json

```bash
npm run <script-name>
```

---

## 2️⃣ Vite Commands

### Create a new Vite + React project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 3️⃣ Next.js Commands

### Create a new Next.js app

```bash
npx create-next-app@latest my-next-app
cd my-next-app
npm install
```

### Run development server

```bash
npm run dev
```

### Build production version

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Lint code

```bash
npm run lint
```

---

## 4️⃣ Git Commands

### Initialize repository

```bash
git init
```

### Add files to staging

```bash
git add .
```

### Commit changes

```bash
git commit -m "Commit message"
```

### Check status

```bash
git status
```

### Push to remote repository

```bash
git push origin main
```

### Pull latest changes

```bash
git pull origin main
```

### Branching

```bash
git branch          # list branches
git branch <name>   # create branch
git checkout <name> # switch branch
git merge <name>    # merge branch
```

---

## 5️⃣ Running React Scripts

- **Start development server**

```bash
npm start
```

- **Build for production**

```bash
npm run build
```

- **Run tests**

```bash
npm test
```

---

## 6️⃣ Misc Useful CLI Commands

### Clear npm cache

```bash
npm cache clean --force
```

### Remove node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

### Open VS Code in current folder

```bash
code .
```

### Check for outdated packages

```bash
npm outdated
```

### Install missing peer dependencies

```bash
npx install-peerdeps <package-name>
```

### Run a specific script

```bash
npx <script-name>
```

---

## 7️⃣ JSON & Environment Helpers

### Validate package.json

```bash
npm run lint
```

### Validate JSON file syntax

```bash
jq . <filename>.json
```

### Load environment variables

```bash
source .env
```

---

## 8️⃣ Helpful Tips

- Use **tab completion** to avoid typing long paths.
- Use **`--save-dev`** for dev dependencies (e.g., ESLint, Prettier).
- Use **`npx`** to run CLI tools without installing globally.
- Use **`Ctrl+C`** to stop running dev servers.

---

> Keep this file handy! It’s your quick reference for day-to-day React/Next/Vite CLI commands.
