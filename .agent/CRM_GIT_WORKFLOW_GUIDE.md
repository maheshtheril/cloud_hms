# CRM Git Workflow Guide

This guide outlines the Git workflow for managing trainee contributions to the CRM module.

---

## 🌳 Branching Strategy

We use a simplified **Git Flow** model:

```
main (production)
  └── develop (staging/integration)
      ├── feature/crm-add-lead-export (trainee feature)
      ├── feature/crm-activity-filters (trainee feature)
      └── bugfix/crm-contact-validation (trainee bugfix)
```

### Branch Types

| Branch Type | Naming Convention | Purpose | Created From |
|-------------|------------------|---------|--------------|
| `main` | `main` | Production code | - |
| `develop` | `develop` | Integration/staging | `main` |
| `feature/*` | `feature/crm-<description>` | New features | `develop` |
| `bugfix/*` | `bugfix/crm-<description>` | Bug fixes | `develop` |
| `hotfix/*` | `hotfix/crm-<description>` | Urgent production fixes | `main` |

---

## 🚀 Workflow Steps

### For Trainees

#### 1. Starting a New Task

```bash
# Switch to develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create feature branch
git checkout -b feature/crm-add-lead-export

# Start coding!
```

**Branch naming examples:**
- `feature/crm-add-lead-export`
- `feature/crm-contact-bulk-import`
- `bugfix/crm-deal-validation-error`
- `enhancement/crm-improved-dashboard`

#### 2. Making Commits

```bash
# Check what changed
git status

# Review changes
git diff

# Stage specific files
git add src/app/crm/leads/page.tsx
git add src/components/crm/lead-form.tsx

# Or stage all changes
git add .

# Commit with meaningful message
git commit -m "feat(crm): add CSV export functionality to leads page"
```

**Commit Message Format:**
```
<type>(<scope>): <short description>

<optional detailed description>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `style`: Formatting, missing semicolons
- `docs`: Documentation only
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
# Good commit messages
git commit -m "feat(crm): add export to CSV for leads list"
git commit -m "fix(crm): resolve contact phone validation issue"
git commit -m "refactor(crm): simplify deal pipeline logic"
git commit -m "docs(crm): update README with setup instructions"

# Bad commit messages
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

#### 3. Pushing Changes

```bash
# Push to remote
git push origin feature/crm-add-lead-export

# If branch doesn't exist remotely, Git will suggest:
git push --set-upstream origin feature/crm-add-lead-export
```

#### 4. Creating Pull Request

1. Go to GitHub/GitLab
2. Click **"New Pull Request"** or **"Create Merge Request"**
3. Fill in the template:

```markdown
## 📝 Description
Brief description of what this PR does

## 🎯 Related Issue
Closes #123 (if applicable)

## 🔄 Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation update

## ✅ Changes Made
- Added export button to leads page
- Created exportLeadsToCSV server action
- Added CSV generation utility function

## 🧪 Testing Done
- [x] Tested export with 100+ leads
- [x] Verified CSV format is correct
- [x] Checked tenant isolation
- [x] Tested on mobile and desktop
- [x] No console errors

## 📸 Screenshots (if applicable)
[Attach screenshots]

## 📚 Additional Notes
Any special deployment steps, migration requirements, etc.
```

5. Assign reviewer (your supervisor)
6. Wait for review

#### 5. Addressing Review Comments

If changes are requested:

```bash
# Make the requested changes
# ... edit files ...

# Commit the changes
git add .
git commit -m "fix(crm): address code review feedback"

# Push to same branch
git push origin feature/crm-add-lead-export
```

The PR will automatically update!

#### 6. After PR is Merged

```bash
# Switch back to develop
git checkout develop

# Pull latest (including your merged changes)
git pull origin develop

# Delete your local feature branch (optional but recommended)
git branch -d feature/crm-add-lead-export

# Delete remote branch (usually done automatically)
git push origin --delete feature/crm-add-lead-export
```

---

### For Supervisors

#### 1. Reviewing a Pull Request

**On GitHub/GitLab:**
1. Go to Pull Requests tab
2. Select the trainee's PR
3. Review the code:
   - Click "Files changed"
   - Add inline comments on specific lines
   - Use review checklist (see `CRM_CODE_REVIEW_CHECKLIST.md`)

**Providing Feedback:**
```markdown
<!-- Inline comment example -->
```typescript
// 📝 Consider extracting this into a separate utility function
// for better reusability. Also, add error handling for edge cases.

function exportToCSV(data: Lead[]) {
  // ...
}
```

**Overall Review:**
- ✅ **Approve** - If everything looks good
- 💬 **Comment** - If you have suggestions but no blocking issues
- ❌ **Request Changes** - If critical issues need to be fixed

#### 2. Testing the PR Locally

```bash
# Fetch all branches
git fetch origin

# Checkout the trainee's branch
git checkout feature/crm-add-lead-export

# Install dependencies (if needed)
npm install

# Run the app
npm run dev

# Test the feature thoroughly
```

#### 3. Merging the PR

**Option A: Merge via GitHub/GitLab (Recommended)**
1. Click "Merge Pull Request"
2. Choose merge strategy:
   - **Squash and Merge** (recommended for small features)
   - **Merge Commit** (for larger features)
   - **Rebase and Merge** (for clean history)
3. Delete source branch after merge

**Option B: Merge via Command Line**
```bash
# Switch to develop
git checkout develop

# Pull latest
git pull origin develop

# Merge feature branch
git merge --no-ff feature/crm-add-lead-export

# Push to remote
git push origin develop

# Delete feature branch
git branch -d feature/crm-add-lead-export
git push origin --delete feature/crm-add-lead-export
```

---

## 🛠️ Common Scenarios

### Scenario 1: Keep Feature Branch Updated

If `develop` has new changes while you're working:

```bash
# On your feature branch
git checkout feature/crm-add-lead-export

# Fetch latest from develop
git fetch origin develop

# Rebase your changes on top of develop
git rebase origin/develop

# If conflicts occur, resolve them, then:
git add .
git rebase --continue

# Force push (only to YOUR feature branch!)
git push origin feature/crm-add-lead-export --force
```

**Alternative (safer for beginners):**
```bash
# Merge develop into your feature branch
git checkout feature/crm-add-lead-export
git merge origin/develop

# Resolve conflicts if any
git add .
git commit -m "merge: sync with develop"
git push origin feature/crm-add-lead-export
```

### Scenario 2: Accidentally Committed to Wrong Branch

```bash
# If you committed to develop instead of feature branch:
# First, create the feature branch (without switching)
git branch feature/crm-my-feature

# Reset develop to remote state
git checkout develop
git reset --hard origin/develop

# Switch to your feature branch
git checkout feature/crm-my-feature

# Your commits are now on the correct branch!
```

### Scenario 3: Need to Undo Last Commit

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes (CAREFUL!)
git reset --hard HEAD~1
```

### Scenario 4: Stash Work in Progress

```bash
# Save current changes without committing
git stash

# Do something else (e.g., switch branches)
git checkout develop

# Come back and restore your changes
git checkout feature/crm-my-feature
git stash pop
```

### Scenario 5: Resolve Merge Conflicts

When you see:
```
CONFLICT (content): Merge conflict in src/app/crm/leads/page.tsx
```

**Steps to resolve:**
1. Open the conflicting file
2. Look for conflict markers:
```typescript
<<<<<<< HEAD
// Your changes
const leads = await getLeads();
=======
// Changes from develop
const leads = await fetchAllLeads();
>>>>>>> develop
```

3. Edit to keep the correct version:
```typescript
// After resolving
const leads = await getLeads();
```

4. Mark as resolved:
```bash
git add src/app/crm/leads/page.tsx
git commit -m "merge: resolve conflict in leads page"
```

---

## 📋 Daily Workflow Checklist

### Morning Routine
```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Check your branches
git branch
```

### Before Starting Work
```bash
# Create or switch to feature branch
git checkout -b feature/crm-new-task
# or
git checkout feature/crm-existing-task

# Make sure it's up to date
git merge origin/develop
```

### Before Lunch/End of Day
```bash
# Commit your work (even if incomplete)
git add .
git commit -m "wip: implementing lead export (incomplete)"
git push origin feature/crm-lead-export
```

### Before Creating PR
```bash
# Make sure all changes are committed
git status

# Update from develop
git merge origin/develop

# Run tests/build
npm run build

# Create PR on GitHub/GitLab
```

---

## 🚨 Important Rules

### ✅ DO:
- Create feature branches from `develop`
- Commit frequently with clear messages
- Push your branches regularly (backup!)
- Keep commits small and focused
- Test before pushing
- Update from `develop` regularly

### ❌ DON'T:
- **Never commit directly to `main` or `develop`**
- Never force push to `main` or `develop`
- Never commit `.env` files or secrets
- Never commit `node_modules`
- Never rewrite history of shared branches
- Never merge your own PRs without approval

---

## 🔍 Useful Git Commands

### Information
```bash
# View commit history
git log --oneline --graph --all

# See what changed in last commit
git show

# See who changed what
git blame <file>

# See differences
git diff                    # unstaged changes
git diff --staged           # staged changes
git diff develop            # differences with develop branch
```

### Undoing Changes
```bash
# Discard changes in working directory
git checkout -- <file>

# Unstage a file
git reset HEAD <file>

# Amend last commit message
git commit --amend

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

### Branches
```bash
# List all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Rename current branch
git branch -m new-name
```

---

## 📞 Getting Help

### When You Have Git Issues

1. **Don't panic!** Git is designed to prevent data loss
2. **Don't force push** unless you know what you're doing
3. **Ask for help** before running destructive commands

### Useful Resources
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fixes for common mistakes
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

---

## 📊 Git Workflow Diagram

```
       main (production)
         |
         ├── develop (staging)
         |     |
         |     ├── feature/crm-lead-export (trainee 1)
         |     |     |
         |     |     ├── commit: feat: add export button
         |     |     ├── commit: feat: implement CSV generation
         |     |     └── PR → merge to develop ──┐
         |     |                                  |
         |     ├── feature/crm-activity-log (trainee 2)
         |     |     |
         |     |     ├── commit: feat: add activity timeline
         |     |     └── PR → merge to develop ──┐
         |     |                                  |
         |     ├──────────────────────────────────┴── merged
         |     |
         |     └── Once tested, merge to main ───────→ main (deployed)
         |
```

---

**Last Updated:** December 2025  
**Document Owner:** CRM Team Lead
