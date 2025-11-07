````markdown
# Git Tips & Tricks for Developers

This guide provides essential **Git commands, workflows, and best practices** for day-to-day development. Perfect for React, Next.js, or Vite projects.

---

## 1️⃣ Basic Git Commands

### Initialize a repository

```bash
git init
```
````

### Check repository status

```bash
git status
```

### Add files to staging

```bash
git add .
git add <file-path>
```

### Commit changes

```bash
git commit -m "Your commit message"
```

### Push to remote repository

```bash
git push origin main
```

### Pull latest changes

```bash
git pull origin main
```

---

## 2️⃣ Branching & Merging

### Create a new branch

```bash
git branch <branch-name>
```

### Switch to a branch

```bash
git checkout <branch-name>
```

### Create and switch in one command

```bash
git switch -c <branch-name>
```

### Merge a branch into current

```bash
git merge <branch-name>
```

### Delete a branch

```bash
git branch -d <branch-name>
```

---

## 3️⃣ Stashing Changes

Temporarily save uncommitted changes:

```bash
git stash
```

Apply latest stash:

```bash
git stash apply
```

List all stashes:

```bash
git stash list
```

Pop (apply and remove) latest stash:

```bash
git stash pop
```

---

## 4️⃣ Undo Changes

### Unstage a file

```bash
git restore --staged <file-path>
```

### Discard changes in working directory

```bash
git restore <file-path>
```

### Reset last commit but keep changes

```bash
git reset --soft HEAD~1
```

### Hard reset to a specific commit (WARNING: loses changes)

```bash
git reset --hard <commit-hash>
```

---

## 5️⃣ Viewing History

### Show commit history

```bash
git log
```

### Short one-line log

```bash
git log --oneline
```

### Show differences between commits

```bash
git diff
```

### Show differences for a specific file

```bash
git diff <file-path>
```

---

## 6️⃣ Collaborating with GitHub / GitLab

### Clone a repository

```bash
git clone <repo-url>
```

### Add a remote

```bash
git remote add origin <repo-url>
```

### Show remote repositories

```bash
git remote -v
```

### Fetch remote changes without merging

```bash
git fetch
```

---

## 7️⃣ Useful Tips & Best Practices

- Write **clear commit messages**: `feat: add login button` or `fix: correct date formatting`
- Use **feature branches** for new features
- Regularly **pull changes** before starting work
- Avoid committing **node_modules** and large files
- Use `.gitignore` to exclude unnecessary files
- Combine `git diff` + `git log` to understand changes before pushing
- Tag releases for version control:

  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

---

## 8️⃣ GUI Tools for Git

- [GitKraken](https://www.gitkraken.com/) – modern Git GUI
- [SourceTree](https://www.sourcetreeapp.com/) – free Git GUI
- [GitHub Desktop](https://desktop.github.com/) – GitHub integration
- [VS Code Git Extension](https://code.visualstudio.com/docs/editor/versioncontrol) – built-in Git support

---

## 9️⃣ Learning Resources & References

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/en)
- [Git Cheatsheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Pro Git Book (free)](https://git-scm.com/book/en/v2)

---

> Git is a powerful tool — mastering it improves your workflow, reduces errors, and makes collaboration much smoother.
