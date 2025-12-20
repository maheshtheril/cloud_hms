# CRM Code Review Checklist

Use this checklist when reviewing trainee code submissions or conducting self-reviews before submitting PRs.

---

## 📋 Pre-Submission Checklist (For Trainee)

Before creating a PR, verify:

### ✅ Functionality
- [ ] Feature works as expected in all scenarios
- [ ] Tested with different user roles (if applicable)
- [ ] Tested with different tenant accounts
- [ ] Edge cases handled (empty states, large datasets, etc.)
- [ ] Error cases handled gracefully

### ✅ Code Quality
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No console errors in browser
- [ ] No unused imports or variables
- [ ] Code follows existing patterns in the project
- [ ] Functions are small and focused (< 50 lines ideally)
- [ ] Meaningful variable and function names

### ✅ Security & Data Isolation
- [ ] **CRITICAL:** All database queries filter by `tenant_id`
- [ ] User input is validated
- [ ] No sensitive data exposed in console/errors
- [ ] Authentication checks in place

### ✅ UI/UX
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states implemented
- [ ] Success/error messages shown to user
- [ ] Consistent with existing UI design
- [ ] Accessible (keyboard navigation, screen readers)

### ✅ Database
- [ ] Database migrations created (if schema changed)
- [ ] Migrations tested locally
- [ ] No direct SQL queries (use Prisma)
- [ ] Indexes added for performance (if needed)

### ✅ Documentation
- [ ] Complex logic has comments
- [ ] PR description is clear and complete
- [ ] Updated relevant documentation (if needed)

### ✅ Git Hygiene
- [ ] Meaningful commit messages
- [ ] No unnecessary files committed (.env, node_modules, etc.)
- [ ] Branch created from latest `develop`
- [ ] No merge conflicts

---

## 👀 Code Review Checklist (For Supervisor)

### 1. Architecture & Design
- [ ] Solution follows established patterns
- [ ] Appropriate use of server actions vs. API routes
- [ ] Component structure is logical
- [ ] No over-engineering or premature optimization
- [ ] Reuses existing components where possible

### 2. Code Quality
**TypeScript:**
- [ ] Proper types defined (no `any`)
- [ ] Interfaces/types properly exported and reused
- [ ] Type safety maintained throughout

**React Best Practices:**
- [ ] Client/server components used appropriately
- [ ] No unnecessary re-renders
- [ ] State management is clean
- [ ] Effect hooks used correctly
- [ ] No memory leaks

**Prisma/Database:**
- [ ] Queries are efficient (no N+1 problems)
- [ ] Proper use of `include`, `select`
- [ ] Transactions used where needed
- [ ] Indexes support query patterns

### 3. Security
**Critical Security Checks:**
- [ ] **Multi-tenancy:** ALL queries filter by `tenant_id`
- [ ] **Authentication:** Protected routes have auth checks
- [ ] **Authorization:** User permissions validated
- [ ] **Input Validation:** All user input sanitized
- [ ] **SQL Injection:** No raw SQL (Prisma only)
- [ ] **XSS Prevention:** User content properly escaped

### 4. Performance
- [ ] Database queries optimized
- [ ] Large lists paginated
- [ ] Images optimized
- [ ] No blocking operations on main thread
- [ ] Appropriate caching strategies

### 5. Error Handling
- [ ] Try-catch blocks in async operations
- [ ] Error messages are user-friendly
- [ ] Errors logged for debugging
- [ ] Graceful degradation
- [ ] No unhandled promise rejections

### 6. Testing
- [ ] Manually tested all user flows
- [ ] Tested with realistic data volumes
- [ ] Tested error scenarios
- [ ] Cross-browser tested (if UI changes)
- [ ] Mobile responsiveness verified

### 7. UI/UX
- [ ] Follows design system
- [ ] Intuitive user flows
- [ ] Loading indicators for async operations
- [ ] Form validation with clear error messages
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Dark mode compatible (if applicable)

### 8. Documentation
- [ ] Code is self-documenting
- [ ] Complex algorithms explained
- [ ] API contracts documented
- [ ] PR has clear description
- [ ] Breaking changes highlighted

### 9. Git & Version Control
- [ ] Clean commit history
- [ ] No sensitive data in commits
- [ ] Appropriate branch name
- [ ] PR targets correct branch

---

## 🚫 Common Issues to Watch For

### Anti-Patterns
```typescript
// ❌ Missing tenant filter
const leads = await prisma.crm_leads.findMany();

// ✅ Correct
const leads = await prisma.crm_leads.findMany({
  where: { tenant_id: tenantId }
});
```

```typescript
// ❌ Using 'any' type
const data: any = formData;

// ✅ Correct
interface FormData {
  name: string;
  email: string;
}
const data: FormData = formData;
```

```typescript
// ❌ No error handling
const lead = await createLead(data);

// ✅ Correct
try {
  const result = await createLead(data);
  if (result.success) {
    // handle success
  } else {
    // handle error
  }
} catch (error) {
  console.error(error);
  // show user-friendly error
}
```

```typescript
// ❌ Hardcoded values
if (status === "active") { ... }

// ✅ Correct - use constants
const LeadStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

if (status === LeadStatus.ACTIVE) { ... }
```

### Performance Issues
```typescript
// ❌ N+1 query problem
const leads = await prisma.crm_leads.findMany();
for (const lead of leads) {
  lead.account = await prisma.crm_accounts.findUnique({
    where: { id: lead.account_id }
  });
}

// ✅ Correct - use include
const leads = await prisma.crm_leads.findMany({
  include: {
    account: true
  }
});
```

### Security Issues
```typescript
// ❌ No input validation
export async function updateLead(id: string, data: any) {
  return await prisma.crm_leads.update({
    where: { id },
    data
  });
}

// ✅ Correct - validate input
export async function updateLead(id: string, data: LeadUpdateInput) {
  const tenantId = await getCurrentTenantId();
  
  // Verify ownership
  const existing = await prisma.crm_leads.findFirst({
    where: { id, tenant_id: tenantId }
  });
  
  if (!existing) {
    throw new Error("Lead not found");
  }
  
  // Validate data
  const validated = leadUpdateSchema.parse(data);
  
  return await prisma.crm_leads.update({
    where: { id },
    data: validated
  });
}
```

---

## 💬 Providing Feedback

### Feedback Guidelines

**Be Constructive:**
- ✅ "Consider using a constant instead of hardcoding this value for better maintainability"
- ❌ "This is wrong"

**Be Specific:**
- ✅ "The query on line 45 is missing the tenant_id filter, which could expose data across tenants"
- ❌ "Security issue"

**Explain Why:**
- ✅ "Let's extract this into a separate function to improve testability and reusability"
- ❌ "Extract this"

**Acknowledge Good Work:**
- ✅ "Great job handling the edge cases here!"
- ✅ "I like how you structured this component"

### Review Comment Template

```markdown
**Issue:** [Describe the problem]
**Why it matters:** [Explain the impact]
**Suggestion:** [Provide solution or alternative]
**Priority:** [Critical / Important / Nice-to-have]

Example code:
```typescript
// Suggested fix here
```
```

---

## ✅ Approval Criteria

Approve PR when:
1. All checklist items pass
2. Code quality meets standards
3. Testing is comprehensive
4. No security vulnerabilities
5. Documentation is adequate
6. Follows project conventions

Request changes when:
1. Security issues present
2. Bugs discovered during testing
3. Code quality significantly below standards
4. Missing critical tests
5. Breaking changes without discussion

---

## 📊 Review Priority Levels

**P0 - Critical (Must Fix):**
- Security vulnerabilities
- Data corruption risks
- Breaking changes
- Missing tenant isolation

**P1 - Important (Should Fix):**
- Performance issues
- Poor error handling
- Accessibility problems
- Maintainability concerns

**P2 - Nice-to-have (Consider):**
- Code style improvements
- Minor optimizations
- Additional edge cases
- Documentation enhancements

---

**Last Updated:** December 2025  
**Document Owner:** CRM Team Lead
