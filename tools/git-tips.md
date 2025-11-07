### 📘 **File:** `notes/fundamentals/git-tips-tricks.md`

# 🌿 Git Tips & Tricks for Developers

> Essential **Git commands, workflows, and best practices** for daily development.
> Perfect for projects built with **React**, **Next.js**, or **Vite**.

---

## 🧩 1️⃣ Basic Git Commands

### 🔹 Initialize a Repository

```bash
git init
```

### 🔹 Check Repository Status

```bash
git status
```

### 🔹 Add Files to Staging

```bash
git add .
git add <file-path>
```

### 🔹 Commit Changes

```bash
git commit -m "Your commit message"
```

### 🔹 Push to Remote Repository

```bash
git push origin main
```

### 🔹 Pull Latest Changes

```bash
git pull origin main
```

---

## 🌱 2️⃣ Branching & Merging

### 🔹 Create a New Branch

```bash
git branch <branch-name>
```

### 🔹 Switch to a Branch

```bash
git checkout <branch-name>
```

### 🔹 Create & Switch in One Command

```bash
git switch -c <branch-name>
```

### 🔹 Merge a Branch into Current

```bash
git merge <branch-name>
```

### 🔹 Delete a Branch

```bash
git branch -d <branch-name>
```

---

## 💾 3️⃣ Stashing Changes

Temporarily save uncommitted work:

```bash
git stash
```

### 🔹 Apply Latest Stash

```bash
git stash apply
```

### 🔹 List All Stashes

```bash
git stash list
```

### 🔹 Pop (Apply + Remove) Latest Stash

```bash
git stash pop
```

---

## 🧹 4️⃣ Undoing Changes

### 🔹 Unstage a File (keep changes)

```bash
git restore --staged <file-path>
```

### 🔹 Discard Local Changes

```bash
git restore <file-path>
```

### 🔹 Undo Last Commit but Keep Changes

```bash
git reset --soft HEAD~1
```

### ⚠️ Hard Reset to Specific Commit (irreversible)

```bash
git reset --hard <commit-hash>
```

---

## 🕓 5️⃣ Viewing History

### 🔹 View Commit History

```bash
git log
```

### 🔹 Compact One-Line Log

```bash
git log --oneline
```

### 🔹 Show Differences Between Commits

```bash
git diff
```

### 🔹 Show Differences for a Specific File

```bash
git diff <file-path>
```

---

## 🤝 6️⃣ Collaborating with GitHub / GitLab

### 🔹 Clone a Repository

```bash
git clone <repo-url>
```

### 🔹 Add a Remote

```bash
git remote add origin <repo-url>
```

### 🔹 View Remotes

```bash
git remote -v
```

### 🔹 Fetch Remote Changes (without merging)

```bash
git fetch
```

---

## 💡 7️⃣ Best Practices & Pro Tips

* 🧠 Write **clear, descriptive commit messages**
  Example:

  ```bash
  feat: add login functionality
  fix: correct API endpoint path
  ```
* 🌿 Use **feature branches** for new development
* 🔄 Always **pull latest changes** before pushing
* 🚫 Avoid committing `node_modules` or large binary files
* 🧱 Use `.gitignore` to exclude unnecessary files
* 🕵️ Check changes with `git diff` before committing
* 🏷️ Tag releases for version tracking:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 🧭 8️⃣ GUI Tools for Git

| Tool                                                                        | Description                               |
| --------------------------------------------------------------------------- | ----------------------------------------- |
| [**GitKraken**](https://www.gitkraken.com/)                                 | Modern Git GUI with visual commit history |
| [**SourceTree**](https://www.sourcetreeapp.com/)                            | Free Git GUI from Atlassian               |
| [**GitHub Desktop**](https://desktop.github.com/)                           | Official GitHub GUI client                |
| [**VS Code Git**](https://code.visualstudio.com/docs/editor/versioncontrol) | Built-in Git integration                  |

---

## 🔗 9️⃣ Learning Resources

* [📘 Official Git Documentation](https://git-scm.com/doc)
* [🐙 GitHub Docs](https://docs.github.com/en)
* [📄 Git Cheat Sheet (PDF)](https://education.github.com/git-cheat-sheet-education.pdf)
* [🏗️ Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
* [📚 Pro Git Book (Free)](https://git-scm.com/book/en/v2)

---

✅ **Summary**

> Git is the backbone of version control.
> Mastering commands like **branching**, **merging**, **stashing**, and **resetting**
> will streamline your workflow and keep your project history clean and professional.


