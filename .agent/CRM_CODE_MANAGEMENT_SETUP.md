# CRM Project - Code Management & Repository Setup

This guide helps supervisors set up proper code management policies for trainee contributions.

---

## 🔒 Repository Protection Rules

### GitHub Branch Protection

**For `main` branch:**
1. Go to Repository Settings → Branches
2. Add branch protection rule for `main`:
   ```
   ✅ Require pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require status checks to pass before merging
      - Build/CI must pass
   ✅ Require branches to be up to date before merging
   ✅ Require conversation resolution before merging
   ✅ Do not allow bypassing the above settings
   ❌ Allow force pushes: Nobody
   ❌ Allow deletions: No
   ```

**For `develop` branch:**
1. Add branch protection rule for `develop`:
   ```
   ✅ Require pull request before merging
   ✅ Require approvals: 1
   ✅ Require status checks to pass
   ✅ Require branches to be up to date
   ❌ Allow force pushes: Nobody (except admins for rebasing)
   ```

### GitLab Protected Branches

1. Go to Settings → Repository → Protected Branches
2. Protect `main`:
   - Allowed to merge: Maintainers
   - Allowed to push: No one
   - Allowed to force push: No
3. Protect `develop`:
   - Allowed to merge: Maintainers + Developers (via MR)
   - Allowed to push: No one (only via MR)
   - Allowed to force push: No

---

## 👥 Team Roles & Permissions

### Role Definitions

| Role | Permissions | Who |
|------|------------|-----|
| **Admin/Owner** | Full access, can bypass protections | Lead Developer |
| **Maintainer** | Approve & merge PRs, manage branches | Supervisor |
| **Developer** | Create PRs, review code | Senior Developers |
| **Contributor** | Create PRs, cannot merge | Trainees |

### Setting Up Trainee Access

**GitHub:**
1. Go to Repository Settings → Collaborators
2. Click "Add people"
3. Add trainee with **Write** permission
4. They can push to feature branches but not `main` or `develop`

**GitLab:**
1. Go to Project Settings → Members
2. Add trainee as **Developer** role
3. They can create merge requests but need approval

---

## 🔍 Code Review Setup

### Required Reviewers (CODEOWNERS)

Create `.github/CODEOWNERS` or `CODEOWNERS` file:

```
# CRM Module Code Owners
/src/app/crm/**               @supervisor-username
/src/components/crm/**        @supervisor-username
/src/app/actions/crm/**       @supervisor-username
/prisma/seed-crm*.ts          @supervisor-username

# Require CRM team review for CRM changes
*.crm.*                       @supervisor-username @senior-dev-username
```

This ensures CRM changes always require specific approval.

### Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## 📋 Pull Request Checklist

### Description
<!-- Brief description of changes -->

### Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] ♻️ Code refactoring

### Related Issues
<!-- Link to related issues: Closes #123 -->

### Changes Made
<!-- List of key changes -->
- 
- 

### Testing Done
- [ ] Tested locally
- [ ] Tested with different tenants
- [ ] Tested on mobile/responsive
- [ ] No console errors
- [ ] Build passes (`npm run build`)
- [ ] Tenant isolation verified

### Security Checklist
- [ ] All database queries include `tenant_id` filter
- [ ] Input validation implemented
- [ ] No sensitive data exposed
- [ ] Authentication checks in place

### Screenshots (if applicable)
<!-- Add screenshots of UI changes -->

### Additional Notes
<!-- Any deployment steps, migration requirements, etc. -->

---

**Reviewer:** Please check against [Code Review Checklist](.agent/CRM_CODE_REVIEW_CHECKLIST.md)
```

---

## 🤖 Automated Checks (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/pr-checks.yml`:

```yaml
name: PR Checks

on:
  pull_request:
    branches: [develop, main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: TypeScript Check
        run: npx tsc --noEmit
      
      - name: Build
        run: npm run build
      
      - name: Check for console.logs
        run: |
          if grep -r "console.log" src/ --exclude-dir=node_modules; then
            echo "Found console.log statements. Please remove them."
            exit 1
          fi
  
  security-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for tenant_id filters
        run: |
          # Check that Prisma queries include tenant filtering
          if grep -r "findMany()" src/app/actions/crm/ | grep -v "tenant_id"; then
            echo "Warning: Possible missing tenant_id filter"
            # Note: This is a simple check, manual review still needed
          fi
      
      - name: Check for secrets
        run: |
          if grep -r "GEMINI_API_KEY\|DATABASE_URL\|CLERK_SECRET" src/ --exclude-dir=node_modules; then
            echo "Error: Hardcoded secrets found!"
            exit 1
          fi
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - lint
  - build
  - security

lint:
  stage: lint
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npx tsc --noEmit
  only:
    - merge_requests

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  only:
    - merge_requests

security-check:
  stage: security
  image: node:18
  script:
    - |
      # Check for common security issues
      if grep -r "console.log" src/; then
        echo "Warning: console.log found"
      fi
    - |
      # Check for hardcoded secrets
      if grep -rE "sk_|pk_test|GEMINI_API" src/; then
        echo "Error: Possible hardcoded secret"
        exit 1
      fi
  only:
    - merge_requests
```

---

## 📊 Monitoring Trainee Progress

### Weekly Review Template

```markdown
# Weekly Review - [Trainee Name] - Week [X]

## Completed Tasks
- [ ] Task 1: [Brief description] - PR #123
- [ ] Task 2: [Brief description] - PR #124

## Code Quality Metrics
- PRs submitted: X
- PRs merged: Y
- Revision rounds: Z (target: ≤2 per PR)
- Average PR size: XXX lines changed

## Strengths
- 
- 

## Areas for Improvement
- 
- 

## Learnings This Week
- 
- 

## Next Week Goals
- 
- 

## Supervisor Notes
- 
```

### Progress Tracking Spreadsheet

| Week | Tasks Assigned | Tasks Completed | PRs Merged | Code Quality (1-5) | Notes |
|------|---------------|-----------------|------------|-------------------|-------|
| 1    | Setup + Explore | ✅ | 0 | - | Completed setup |
| 2    | Bug fix | ✅ | 1 | 4 | Good first PR |
| 3    | Lead source | ✅ | 1 | 5 | Excellent work |
| 4    | Phone validation | 🔄 | 0 | - | In progress |

---

## 🎓 Gradual Responsibility Increase

### Phase 1: Supervised (Weeks 1-4)
- **Tasks:** Small bug fixes, simple features
- **Review:** Detailed line-by-line review
- **Approval:** Always required before merge
- **Pairing:** Pair program on complex parts

### Phase 2: Guided (Weeks 5-8)
- **Tasks:** Medium features, some design decisions
- **Review:** Focus on architecture and security
- **Approval:** Required, but faster turnaround
- **Independence:** More autonomous coding

### Phase 3: Independent (Weeks 9-12)
- **Tasks:** Full features, can break down requirements
- **Review:** High-level review, trust in code quality
- **Approval:** Required but primarily for verification
- **Mentoring:** They start helping newer trainees

### Phase 4: Semi-Senior (Weeks 13+)
- **Tasks:** Complex features, can review others' code
- **Review:** Peer review acceptable
- **Approval:** Can approve junior trainee PRs
- **Leadership:** Lead small sub-projects

---

## 🚨 Red Flags to Watch For

### Code Quality Red Flags
- ❌ Multiple revision rounds (>3) on simple PRs
- ❌ Recurring same mistakes
- ❌ Copy-pasting without understanding
- ❌ Not testing before submitting
- ❌ Ignoring review feedback

### Behavioral Red Flags
- ❌ Not asking questions when stuck
- ❌ Pushing changes without PRs
- ❌ Missing deadlines without communication
- ❌ Defensive about feedback
- ❌ Not following coding standards

**Action:** Address immediately with one-on-one discussion

---

## 📋 Onboarding Checklist (For Supervisor)

### Before Trainee Starts
- [ ] Repository access granted
- [ ] Added to team communication channels
- [ ] Development database/tenant created
- [ ] Environment variables shared securely
- [ ] Welcome email sent with resources

### Day 1
- [ ] Kick-off meeting held
- [ ] Expectations discussed
- [ ] Onboarding docs shared
- [ ] Assigned mentor/buddy
- [ ] First task assigned (environment setup)

### Week 1
- [ ] Daily check-ins scheduled
- [ ] Environment setup verified
- [ ] Git workflow explained
- [ ] First PR submitted and reviewed
- [ ] Introduced to team

### Month 1
- [ ] First feature merged
- [ ] Code review feedback incorporated
- [ ] Understanding of architecture demonstrated
- [ ] Month 1 review meeting
- [ ] Goals set for Month 2

---

## 🛠️ Tools & Setup

### Recommended VS Code Extensions

Share this list with trainee:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

Save as `.vscode/extensions.json`

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 📞 Communication Protocol

### Daily Standups (Async or Sync)
**Format:**
- Yesterday: What I completed
- Today: What I'm working on
- Blockers: What's blocking me

### Weekly 1-on-1s
**Agenda:**
- Review completed work
- Discuss challenges
- Set goals for next week
- Career development discussion
- Q&A

### PR Review SLA
- **Simple PRs** (<100 lines): 4 hours
- **Medium PRs** (100-300 lines): 1 day
- **Complex PRs** (>300 lines): 2 days

### Emergency Contact
- Critical bugs: Immediate notification
- Blocked on work: Within 2 hours
- General questions: Daily standup or Slack

---

## 📚 Additional Resources

### Internal Wiki
Create wiki pages for:
- Common errors and solutions
- Debugging techniques
- CRM business logic documentation
- Database schema explanation
- Deployment process

### Learning Path
- **Week 1-2:** React & TypeScript basics
- **Week 3-4:** Next.js App Router
- **Week 5-6:** Prisma & Database
- **Week 7-8:** Advanced patterns
- **Week 9+:** Architecture & design

---

## ✅ Success Metrics

### For Trainee
- Merged 10+ PRs in first month
- Can independently fix bugs by month 2
- Can build features with minimal guidance by month 3
- Code quality consistently good by month 3

### For Supervisor
- Clear documentation provided
- Regular feedback given
- Trainee feels supported
- Team velocity maintained or increased

---

**This is a living document. Update as you learn what works best for your team!**

---

**Last Updated:** December 2025  
**Document Owner:** CRM Team Lead
