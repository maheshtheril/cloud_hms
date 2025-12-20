# CRM Module - Trainee Onboarding Guide

**Welcome to the HMS/ERP CRM Module Development Team!**

This guide will help you get started with the CRM module of our SaaS ERP system.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [CRM Module Architecture](#crm-module-architecture)
4. [Getting Started - First Tasks](#getting-started---first-tasks)
5. [Code Management Workflow](#code-management-workflow)
6. [Development Best Practices](#development-best-practices)
7. [Resources & Documentation](#resources--documentation)
8. [Getting Help](#getting-help)

---

## 🎯 Project Overview

### What is this project?

This is a **multi-tenant SaaS ERP system** with multiple modules:
- **HMS (Hospital Management System)** - Main module
- **CRM (Customer Relationship Management)** - Your focus area
- **Inventory Management**
- **Billing & Invoicing**
- **Purchasing**

### What is the CRM Module?

The CRM module helps businesses manage:
- **Leads** - Potential customers
- **Accounts** - Companies/Organizations
- **Contacts** - Individual people
- **Deals** - Sales opportunities
- **Activities** - Tasks, calls, meetings, emails
- **Scheduler** - Calendar and event management
- **Targets** - Sales goals and tracking
- **Reports** - Analytics and insights
- **Attendance** - Employee attendance tracking

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL with Prisma ORM |
| **UI Components** | Shadcn/ui, Tailwind CSS |
| **Authentication** | Clerk |
| **Deployment** | Render.com |

---

## 🛠️ Development Environment Setup

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **VS Code** (recommended) or any code editor
- **PostgreSQL** (for local development) or access to dev database

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd SAAS_ERP

# Install dependencies
npm install
```

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Gemini API (for AI features)
GEMINI_API_KEY=...

# URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Note:** Ask your supervisor for the actual credentials.

### Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if needed)
npx prisma migrate dev

# Seed CRM data (optional - for testing)
npx ts-node prisma/seed-crm-masters.ts
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Verify CRM Access

1. Sign up / Log in to the application
2. Navigate to **CRM** section from the sidebar
3. You should see: Dashboard, Leads, Accounts, Contacts, Deals, etc.

---

## 🏗️ CRM Module Architecture

### Directory Structure

```
SAAS_ERP/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed-crm.ts            # CRM seed data
│   └── seed-crm-masters.ts    # CRM master data
│
├── src/
│   ├── app/
│   │   ├── crm/               # CRM Pages (App Router)
│   │   │   ├── layout.tsx               # CRM layout with sidebar
│   │   │   ├── dashboard/              # CRM Dashboard
│   │   │   ├── leads/                  # Lead management
│   │   │   ├── accounts/               # Account management
│   │   │   ├── contacts/               # Contact management
│   │   │   ├── deals/                  # Deal/Opportunity management
│   │   │   ├── activities/             # Activity tracking
│   │   │   ├── scheduler/              # Calendar/Scheduler
│   │   │   ├── targets/                # Sales targets
│   │   │   ├── reports/                # Reports & Analytics
│   │   │   └── attendance/             # Attendance tracking
│   │   │
│   │   ├── actions/crm/        # Server Actions for CRM
│   │   │   ├── leads.ts
│   │   │   ├── accounts.ts
│   │   │   ├── contacts.ts
│   │   │   ├── deals.ts
│   │   │   ├── activities.ts
│   │   │   └── ...
│   │   │
│   │   └── api/                # API Routes (if needed)
│   │
│   └── components/
│       └── crm/                # CRM React Components
│           ├── lead-form.tsx
│           ├── deal-form.tsx
│           ├── activity-form.tsx
│           ├── accounts/
│           ├── contacts/
│           └── ...
│
└── .agent/                     # Documentation & guides
    ├── CRM_TRAINEE_ONBOARDING.md
    └── CRM_DEVELOPMENT_WORKFLOW.md
```

### Key Concepts

#### 1. **Multi-Tenancy**
- Each organization (tenant) has isolated data
- Always filter queries by `tenant_id`
- Use `await getCurrentTenantId()` in server actions

#### 2. **Server Actions**
- Located in `src/app/actions/crm/`
- Handle database operations
- Called from client components using `"use server"`

#### 3. **Database Models**
Key CRM tables in Prisma schema:
- `crm_leads`
- `crm_accounts`
- `crm_contacts`
- `crm_deals`
- `crm_activities`
- `crm_targets`
- `crm_attendance`

---

## 🚀 Getting Started - First Tasks

### Week 1: Familiarization

**Day 1-2: Explore the Application**
- [ ] Set up your development environment
- [ ] Run the application locally
- [ ] Navigate through all CRM sections
- [ ] Create test data: leads, accounts, contacts, deals
- [ ] Review the database schema (`prisma/schema.prisma`)

**Day 3-4: Code Reading**
- [ ] Read `src/app/crm/layout.tsx` - understand CRM navigation
- [ ] Read `src/app/crm/leads/page.tsx` - understand listing pages
- [ ] Read `src/components/crm/lead-form.tsx` - understand forms
- [ ] Read `src/app/actions/crm/leads.ts` - understand server actions

**Day 5: First Bug Fix**
- [ ] Your supervisor will assign a small bug fix
- [ ] Create a feature branch
- [ ] Fix the bug
- [ ] Test thoroughly
- [ ] Submit a pull request

### Week 2: Feature Development

You'll be assigned small features to build. Examples:
- Add a new field to lead form
- Create a filter for the contacts page
- Add export functionality to reports
- Improve UI/UX of a specific page

---

## 🔄 Code Management Workflow

### Git Branching Strategy

We use **Git Flow** with feature branches:

```
main (production)
  └── develop (staging)
      └── feature/crm-your-feature-name (your work)
```

### Step-by-Step Workflow

#### 1. **Start a New Feature**

```bash
# Make sure you're on develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create a new feature branch
git checkout -b feature/crm-add-lead-export

# Branch naming convention:
# feature/crm-<brief-description>
# bugfix/crm-<issue-description>
# enhancement/crm-<improvement-description>
```

#### 2. **Make Your Changes**

```bash
# Make code changes
# Test your changes locally

# Check what files changed
git status

# Add files to staging
git add .

# Commit with a clear message
git commit -m "feat(crm): add export to CSV functionality for leads"
```

**Commit Message Format:**
```
<type>(<module>): <brief description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- docs: Documentation changes
- style: Formatting changes
- test: Adding tests
- chore: Maintenance tasks
```

#### 3. **Push Your Changes**

```bash
# Push your feature branch to remote
git push origin feature/crm-add-lead-export
```

#### 4. **Create a Pull Request (PR)**

1. Go to GitHub/GitLab repository
2. Click **"New Pull Request"**
3. Set:
   - **Base branch:** `develop`
   - **Compare branch:** `feature/crm-add-lead-export`
4. Fill in PR template:
   ```markdown
   ## Description
   Added CSV export functionality to the leads page
   
   ## Changes Made
   - Added export button to leads listing
   - Created export server action
   - Added CSV generation utility
   
   ## Testing Done
   - Tested export with 100+ leads
   - Verified CSV format
   - Checked tenant isolation
   
   ## Screenshots
   [Attach screenshots if UI changes]
   ```
5. Request review from your supervisor
6. **Wait for approval** - Do not merge yourself

#### 5. **Code Review Process**

Your supervisor will:
- Review your code
- Test functionality
- Provide feedback/request changes

If changes are requested:
```bash
# Make the requested changes
# Commit and push again
git add .
git commit -m "fix(crm): address review comments"
git push origin feature/crm-add-lead-export
```

The PR will automatically update.

#### 6. **After Approval**

Your supervisor will merge the PR. Then:

```bash
# Switch back to develop
git checkout develop

# Pull the latest changes (including your merged code)
git pull origin develop

# Delete your local feature branch (optional)
git branch -d feature/crm-add-lead-export
```

---

## ✅ Development Best Practices

### 1. **Code Quality**

#### TypeScript Best Practices
- Always use TypeScript types
- Avoid `any` type
- Define interfaces for data structures

```typescript
// ✅ Good
interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  tenant_id: string;
}

// ❌ Bad
const lead: any = {
  id: "123",
  name: "John",
};
```

#### Component Structure
```typescript
// ✅ Good component structure
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LeadCardProps {
  lead: Lead;
  onUpdate: (id: string) => void;
}

export function LeadCard({ lead, onUpdate }: LeadCardProps) {
  const [loading, setLoading] = useState(false);
  
  // Component logic here
  
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  );
}
```

### 2. **Tenant Isolation**

**CRITICAL:** Always filter by tenant_id!

```typescript
// ✅ Good - Always filter by tenant
export async function getLeads() {
  "use server";
  const tenantId = await getCurrentTenantId();
  
  const leads = await prisma.crm_leads.findMany({
    where: {
      tenant_id: tenantId, // ALWAYS include this
    },
  });
  
  return leads;
}

// ❌ Bad - Missing tenant filter (security risk!)
export async function getLeads() {
  const leads = await prisma.crm_leads.findMany(); // Wrong!
  return leads;
}
```

### 3. **Error Handling**

```typescript
// ✅ Good error handling
export async function createLead(data: LeadInput) {
  "use server";
  
  try {
    const tenantId = await getCurrentTenantId();
    
    const lead = await prisma.crm_leads.create({
      data: {
        ...data,
        tenant_id: tenantId,
      },
    });
    
    return { success: true, data: lead };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { 
      success: false, 
      error: "Failed to create lead. Please try again." 
    };
  }
}
```

### 4. **UI/UX Standards**

- Use Shadcn/ui components consistently
- Follow existing design patterns
- Ensure responsive design (mobile, tablet, desktop)
- Add loading states
- Show error messages clearly
- Provide user feedback

```typescript
// ✅ Good - Shows loading state and handles errors
const handleSubmit = async (data: LeadInput) => {
  setLoading(true);
  setError(null);
  
  const result = await createLead(data);
  
  if (result.success) {
    toast.success("Lead created successfully!");
    router.push("/crm/leads");
  } else {
    setError(result.error);
    toast.error(result.error);
  }
  
  setLoading(false);
};
```

### 5. **Testing**

Before submitting a PR, test:
- ✅ Primary functionality works
- ✅ Error cases handled gracefully
- ✅ Responsive on mobile/tablet
- ✅ No console errors
- ✅ Tenant isolation (create test under different tenants)
- ✅ Database changes applied correctly

### 6. **Documentation**

Add comments for complex logic:

```typescript
// Calculate lead score based on engagement
// Score ranges: 0-100
// Factors: email opens (30%), website visits (40%), form submissions (30%)
function calculateLeadScore(engagement: Engagement): number {
  const emailScore = engagement.emailOpens * 30;
  const visitScore = engagement.visits * 40;
  const formScore = engagement.submissions * 30;
  
  return Math.min(emailScore + visitScore + formScore, 100);
}
```

---

## 📚 Resources & Documentation

### Internal Documentation
- **Project README:** `README.md`
- **Database Schema:** `prisma/schema.prisma`
- **Agent Documentation:** `.agent/` folder

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Useful VS Code Extensions
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Prisma** - Schema highlighting
- **Tailwind CSS IntelliSense** - CSS suggestions
- **GitLens** - Git history viewer

---

## 🆘 Getting Help

### When You're Stuck

1. **Try to solve it yourself** (15-30 minutes)
   - Read error messages carefully
   - Check documentation
   - Search online (Stack Overflow, GitHub Issues)

2. **Ask for help** if still stuck
   - Prepare your question clearly
   - Share what you've tried
   - Include error messages/screenshots

### Communication Channels

- **Daily Standup:** Share progress and blockers
- **Code Reviews:** Learn from feedback
- **Pair Programming:** Request help on complex features
- **Slack/Teams:** Quick questions
- **Documentation:** Check `.agent/` folder first

### Questions to Ask Your Supervisor

✅ Good questions:
- "I'm trying to implement X, I've tried Y and Z, but getting error E. What am I missing?"
- "Should I use server action or API route for this feature?"
- "What's the best way to handle this edge case?"

❌ Avoid:
- "This doesn't work" (without details)
- "Can you do this for me?"
- Asking without trying first

---

## 🎯 Success Metrics

You're doing well when:
- ✅ PRs submitted with minimal revision requests
- ✅ Code follows project standards
- ✅ Features are well-tested before submission
- ✅ You understand the CRM workflow
- ✅ You can work independently on small features
- ✅ You ask good questions when stuck

---

## 📝 Quick Reference

### Common Commands

```bash
# Start development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio

# Check for TypeScript errors
npm run build

# Format code
npm run format
```

### Common File Locations

| Task | Location |
|------|----------|
| Add new CRM page | `src/app/crm/<page-name>/page.tsx` |
| Add server action | `src/app/actions/crm/<action-name>.ts` |
| Add component | `src/components/crm/<component-name>.tsx` |
| Update database | `prisma/schema.prisma` |
| Add UI component | `src/components/ui/` |

---

**Welcome aboard! We're excited to have you on the team. Don't hesitate to ask questions and learn. Every expert was once a beginner. 🚀**

---

**Last Updated:** December 2025  
**Document Owner:** CRM Team Lead
