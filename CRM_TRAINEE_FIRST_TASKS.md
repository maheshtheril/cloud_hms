# CRM Trainee - First Tasks & Project Introduction

Welcome! This document contains your initial learning path and first assignments.

---

## 🎯 Week 1: Orientation & Setup

### Day 1: Environment Setup ✅

**Goal:** Get the project running locally

**Tasks:**
1. [ ] Install required software (Node.js, Git, VS Code)
2. [ ] Clone the repository
3. [ ] Set up `.env.local` file (ask supervisor for credentials)
4. [ ] Install dependencies: `npm install`
5. [ ] Generate Prisma client: `npx prisma generate`
6. [ ] Run development server: `npm run dev`
7. [ ] Successfully access the app at `http://localhost:3000`

**Deliverable:** Screenshot of working local app

---

### Day 2: Explore the Application 🔍

**Goal:** Understand what the CRM module does

**Tasks:**
1. [ ] Sign up as a new user
2. [ ] Navigate to CRM section
3. [ ] Explore each menu item:
   - [ ] Dashboard
   - [ ] Leads
   - [ ] Accounts
   - [ ] Contacts
   - [ ] Deals
   - [ ] Activities
   - [ ] Scheduler
   - [ ] Targets
   - [ ] Reports
4. [ ] Create sample data:
   - [ ] Create 3 leads
   - [ ] Create 2 accounts
   - [ ] Create 4 contacts
   - [ ] Create 2 deals
   - [ ] Create 3 activities

**Deliverable:** Written notes documenting what each section does

---

### Day 3: Code Exploration 📚

**Goal:** Understand the codebase structure

**Tasks:**
1. [ ] Read the main README: `README.md`
2. [ ] Read onboarding guide: `.agent/CRM_TRAINEE_ONBOARDING.md`
3. [ ] Explore project structure:
   ```
   src/
   ├── app/crm/          # CRM pages
   ├── components/crm/   # CRM components
   └── app/actions/crm/  # Server actions
   ```
4. [ ] Read and understand these files:
   - [ ] `src/app/crm/layout.tsx` - CRM layout
   - [ ] `src/app/crm/leads/page.tsx` - Leads listing
   - [ ] `src/components/crm/lead-form.tsx` - Lead form
   - [ ] `src/app/actions/crm/leads.ts` - Lead server actions

**Deliverable:** 
- List 5 things you learned about the code structure
- List 3 questions you have

---

### Day 4: Database Schema 🗄️

**Goal:** Understand the database structure

**Tasks:**
1. [ ] Open `prisma/schema.prisma`
2. [ ] Find and document these models:
   - [ ] `crm_leads`
   - [ ] `crm_accounts`
   - [ ] `crm_contacts`
   - [ ] `crm_deals`
   - [ ] `crm_activities`
3. [ ] Open Prisma Studio: `npx prisma studio`
4. [ ] Explore the data you created on Day 2
5. [ ] Understand relationships:
   - How are leads connected to accounts?
   - How are contacts connected to accounts?
   - How are deals connected to accounts/contacts?

**Deliverable:** 
- Diagram showing how CRM tables are related
- Document the key fields in each table

---

### Day 5: First Bug Fix 🐛

**Goal:** Make your first code contribution

**Assignment: Fix Lead Status Filter**

**Background:**
The leads page has a status filter, but it's not working correctly when you select "Converted" status.

**Tasks:**
1. [ ] Create a feature branch: `bugfix/crm-lead-status-filter`
2. [ ] Navigate to: `src/app/crm/leads/page.tsx`
3. [ ] Find the filter logic (around line 50-60)
4. [ ] Identify why "Converted" status filter doesn't work
5. [ ] Fix the issue
6. [ ] Test: Apply filter and verify results
7. [ ] Commit: `git commit -m "fix(crm): resolve lead status filter for converted leads"`
8. [ ] Push and create PR

**Hint:** Check if the status value matches the database enum exactly.

**Deliverable:** Pull Request for review

---

## 🎯 Week 2: Feature Development

### Task 1: Add Lead Source Field 📝

**Difficulty:** Easy  
**Estimated Time:** 3-4 hours

**Goal:** Add a "Source" field to lead creation form

**Requirements:**
- Add dropdown to lead form with options:
  - Website
  - Referral
  - Social Media
  - Cold Call
  - Trade Show
  - Other
- Save source to database
- Display source in lead list table
- Add source filter to leads page

**Steps:**
1. [ ] Check database: Does `crm_leads` table have `source` field?
   - If no, create a migration
2. [ ] Update lead form component: `src/components/crm/lead-form.tsx`
   - Add source dropdown using Shadcn Select component
3. [ ] Update server action: `src/app/actions/crm/leads.ts`
   - Include source in create/update logic
4. [ ] Update leads listing: `src/app/crm/leads/page.tsx`
   - Add source column to table
   - Add source filter
5. [ ] Test thoroughly
6. [ ] Create PR

**Deliverable:** Pull Request with source field implementation

---

### Task 2: Activity Type Icons 🎨

**Difficulty:** Easy  
**Estimated Time:** 2-3 hours

**Goal:** Add icons to activity types for better visual recognition

**Requirements:**
- Meeting → Calendar icon
- Call → Phone icon
- Email → Mail icon
- Task → CheckSquare icon
- Note → FileText icon

**Use:** Lucide React icons

**Files to modify:**
- `src/components/crm/activity-form.tsx`
- `src/app/crm/activities/page.tsx`

**Deliverable:** Pull Request with activity icons

---

### Task 3: Contact Phone Number Validation 📞

**Difficulty:** Medium  
**Estimated Time:** 4-5 hours

**Goal:** Add proper phone number validation and formatting

**Requirements:**
- Validate phone number format on contact form
- Show error for invalid format
- Auto-format phone number as user types
- Support multiple phone number formats:
  - (123) 456-7890
  - 123-456-7890
  - 1234567890
- Display formatted in contact list

**Libraries to use:**
- `react-phone-number-input` or
- Custom validation with regex

**Files to modify:**
- `src/components/crm/contacts/contact-form.tsx`
- `src/app/actions/crm/contacts.ts`

**Deliverable:** Pull Request with phone validation

---

### Task 4: Lead Export to CSV 📊

**Difficulty:** Medium  
**Estimated Time:** 5-6 hours

**Goal:** Allow users to export leads to CSV file

**Requirements:**
- Add "Export to CSV" button on leads page
- Export visible/filtered leads only
- Include columns: Name, Email, Phone, Status, Source, Created Date
- Filename: `leads_export_YYYY-MM-DD.csv`
- Show success toast after export

**Implementation:**
1. [ ] Create export server action in `src/app/actions/crm/leads.ts`
2. [ ] Add CSV generation logic
3. [ ] Add export button to `src/app/crm/leads/page.tsx`
4. [ ] Handle loading state during export
5. [ ] Test with large datasets (100+ leads)

**Bonus:** 
- Add option to export all fields vs. selected fields
- Add loading spinner during export

**Deliverable:** Pull Request with CSV export feature

---

## 🎯 Week 3: Larger Feature

### Project: Deal Pipeline Board 🎪

**Difficulty:** Advanced  
**Estimated Time:** 2-3 days

**Goal:** Create a Kanban-style board for deal pipeline management

**Requirements:**

**Visual Design:**
- Column-based layout (similar to Trello)
- Columns for each deal stage:
  - Qualification
  - Proposal
  - Negotiation
  - Closed Won
  - Closed Lost
- Drag-and-drop between stages
- Deal cards showing:
  - Company name
  - Deal value
  - Expected close date
  - Assigned user

**Functionality:**
- Drag deal card to different stage → updates in database
- Click card → open deal details modal
- Add new deal → quick create form
- Filter by assigned user
- Show total value per stage

**Technical Implementation:**

**Libraries:**
- `@dnd-kit/core` for drag-and-drop
- Shadcn Dialog for deal details modal

**Files Structure:**
```
src/
├── app/crm/deals/board/
│   └── page.tsx                    # Main board page
├── components/crm/deals/
│   ├── pipeline-board.tsx          # Board component
│   ├── pipeline-column.tsx         # Column component
│   ├── deal-card.tsx               # Card component
│   └── deal-quick-create.tsx       # Quick create form
└── app/actions/crm/
    └── deals.ts                    # Add updateDealStage action
```

**Steps:**
1. [ ] Design the UI (sketch or wireframe)
2. [ ] Get supervisor approval on design
3. [ ] Create page structure
4. [ ] Implement static columns
5. [ ] Add deal cards
6. [ ] Implement drag-and-drop
7. [ ] Add database update on drop
8. [ ] Add quick create form
9. [ ] Add filters
10. [ ] Style and polish
11. [ ] Test thoroughly
12. [ ] Create PR

**Deliverable:** 
- Pull Request with pipeline board
- Demo video/screenshots

---

## 📝 Learning Resources

### Must Read
- [ ] [React Documentation](https://react.dev/learn)
- [ ] [Next.js App Router](https://nextjs.org/docs/app)
- [ ] [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ ] [Prisma Guide](https://www.prisma.io/docs/getting-started)

### Recommended Tutorials
- [ ] [Next.js Tutorial](https://nextjs.org/learn) - 2 hours
- [ ] [TypeScript for Beginners](https://www.youtube.com/watch?v=BwuLxPH8IDs) - 50 min
- [ ] [Tailwind CSS Crash Course](https://www.youtube.com/watch?v=UBOj6rqRUME) - 90 min

### Project-Specific
- [ ] Read: `.agent/CRM_TRAINEE_ONBOARDING.md`
- [ ] Read: `.agent/CRM_CODE_REVIEW_CHECKLIST.md`
- [ ] Read: `.agent/CRM_GIT_WORKFLOW_GUIDE.md`

---

## ✅ Progress Tracking

### Week 1 Checklist
- [ ] Environment setup complete
- [ ] Application explored
- [ ] Code structure understood
- [ ] Database schema documented
- [ ] First bug fix merged

### Week 2 Checklist
- [ ] Lead source field added
- [ ] Activity icons implemented
- [ ] Phone validation working
- [ ] CSV export functional

### Week 3 Checklist
- [ ] Pipeline board designed
- [ ] Drag-and-drop working
- [ ] Database updates correct
- [ ] UI polished and responsive

---

## 🎓 Evaluation Criteria

You'll be evaluated on:

**Code Quality (30%)**
- Clean, readable code
- Proper TypeScript usage
- Following project conventions
- Good error handling

**Functionality (30%)**
- Features work as specified
- Edge cases handled
- No bugs introduced
- Tenant isolation maintained

**Best Practices (20%)**
- Git workflow followed
- Good commit messages
- PR descriptions clear
- Code tested before submission

**Learning & Growth (20%)**
- Asks good questions
- Learns from feedback
- Improves over time
- Proactive problem-solving

---

## 🆘 Getting Help

**When stuck:**
1. Try to debug for 15-30 minutes
2. Search online (Stack Overflow, docs)
3. Check project documentation
4. Ask your supervisor

**How to ask:**
- Describe what you're trying to do
- Show what you've tried
- Share error messages/screenshots
- Be specific about where you're stuck

**Daily Check-ins:**
- Morning: What you'll work on today
- Evening: Progress update + blockers

---

## 🎉 Success!

Once you complete these tasks, you'll:
- ✅ Understand the CRM codebase
- ✅ Know the development workflow
- ✅ Have made multiple code contributions
- ✅ Be ready for independent feature development

**Good luck, and welcome to the team! 🚀**

---

**Last Updated:** December 2025  
**Supervisor:** [Your Name]  
**Trainee:** [Trainee Name]
