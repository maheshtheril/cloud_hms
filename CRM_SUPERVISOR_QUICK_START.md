# CRM Trainee Onboarding - Quick Start Summary

**A condensed guide for the supervisor to quickly onboard a trainee to the CRM project.**

---

## 📥 Quick Onboarding Steps

### 1. Grant Access (Day 0)
```bash
# Add trainee to repository
# - GitHub: Settings → Collaborators → Add with Write access
# - GitLab: Settings → Members → Add as Developer

# Share credentials securely
# - Database URL
# - Clerk API keys
# - Gemini API key
```

### 2. Share Documentation (Day 1 Morning)
Send these files to trainee:
- ✅ `CRM_TRAINEE_ONBOARDING.md` - Complete onboarding guide
- ✅ `CRM_TRAINEE_FIRST_TASKS.md` - Specific tasks and assignments
- ✅ `CRM_GIT_WORKFLOW_GUIDE.md` - Git workflow
- ✅ `CRM_CODE_REVIEW_CHECKLIST.md` - What to check before submitting

### 3. First Meeting (Day 1)
**Agenda:**
- Welcome and team introductions
- Project overview (what we're building)
- CRM module walkthrough (show the live app)
- Expectations discussion
- Q&A
- Assign: Environment setup task

### 4. Week 1 Goals
- [ ] Local environment working
- [ ] Can run and navigate the app
- [ ] Understands project structure
- [ ] First bug fix PR submitted

### 5. Review Cadence
- **Daily:** Quick async check-in (Slack/Teams)
- **Weekly:** 30-minute 1-on-1 meeting
- **PRs:** Review within 24 hours

---

## 🎯 First 4 Weeks Plan

### Week 1: Setup & Exploration
- Day 1-2: Environment setup
- Day 3-4: Code exploration
- Day 5: First bug fix

### Week 2: Simple Features
- Lead source field addition
- Activity type icons
- Phone number validation

### Week 3: Medium Feature
- CSV export functionality
- OR
- Email template editor

### Week 4: Complex Feature
- Deal pipeline Kanban board
- OR
- Advanced filtering system

---

## ✅ Supervisor Checklist

### Before They Start
- [ ] Repository access granted
- [ ] Environment credentials prepared
- [ ] Development tenant created in database
- [ ] Documentation links ready
- [ ] Welcome email sent
- [ ] First meeting scheduled

### Week 1
- [ ] Kickoff meeting completed
- [ ] Environment setup verified (ask for screenshot)
- [ ] Introduced to team (if remote, via Slack)
- [ ] Assigned first bug fix
- [ ] Daily check-ins happening

### Week 2
- [ ] First PR reviewed and merged
- [ ] Provided constructive feedback
- [ ] Assigned first feature
- [ ] Confirming understanding of Git workflow

### Month 1
- [ ] 3-5 PRs merged
- [ ] Monthly review meeting held
- [ ] Feedback given (strengths + improvements)
- [ ] Goals set for Month 2
- [ ] Gauging independence level

---

## 🚀 Quick Reference: Managing Trainee PRs

### When PR is Submitted

**1. Quick Scan (2 minutes):**
- Does it build? (`npm run build`)
- Any obvious security issues?
- Is tenant_id filtering present?

**2. Detailed Review (10-20 minutes):**
- Use `CRM_CODE_REVIEW_CHECKLIST.md` as guide
- Leave inline comments
- Test locally if UI changes

**3. Provide Feedback:**
- Start with positive feedback
- Be specific about issues
- Explain _why_ changes are needed
- Provide code examples

**4. Approval or Request Changes:**
- If minor issues: Approve with comments
- If significant issues: Request changes

**5. After Merge:**
- Acknowledge good work
- Suggest next task
- Document any learnings

---

## 💡 Pro Tips

### Do's ✅
- **Be patient** - They're learning
- **Explain why** - Don't just say "change this"
- **Pair program** on complex features
- **Celebrate wins** - First PR merged is a big deal!
- **Encourage questions** - "No stupid questions"
- **Give autonomy** - Let them figure things out (within reason)

### Don'ts ❌
- **Don't** fix their code for them (guide instead)
- **Don't** assume they know stuff (explain basics)
- **Don't** let them struggle for days (check in daily)
- **Don't** merge without review (even if rushed)
- **Don't** skip the "why" (they need context)
- **Don't** forget positive feedback (not just critique)

---

## 🔥 Common First-Week Issues

### "npm install failed"
→ Check Node.js version, clear cache, delete node_modules and retry

### "Database connection error"
→ Verify DATABASE_URL in .env.local, check VPN/network

### "Clerk authentication not working"
→ Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY format

### "I don't see CRM menu"
→ Check if user has correct tenant, verify menu permissions

### "Git push rejected"
→ Probably pushing to main/develop directly, guide to feature branch

---

## 📞 Emergency Contacts

**Trainee Stuck on Setup (Day 1-2):**
- Schedule immediate call
- Screen share session
- Don't let them struggle alone

**Trainee Missing Deadlines:**
- Check-in to identify blockers
- Adjust expectations if needed
- Provide more guidance

**Trainee Making No Progress:**
- Daily check-ins
- Pair programming sessions
- Re-evaluate task complexity

---

## 📊 Quick Progress Assessment

### After Week 1
**Green:** Environment works, understands basic flow, asked good questions  
**Yellow:** Setup issues but working through them, seems confused  
**Red:** Can't get environment running, not responding to messages

**Action:** Adjust Week 2 plan based on color

### After Week 2
**Green:** First PR merged cleanly, good code quality, following standards  
**Yellow:** PRs need multiple revisions, struggling with concepts  
**Red:** No PRs submitted, or code has major issues

**Action:** Consider 1-on-1 to address gaps

### After Month 1
**Green:** 3+ PRs merged, increasing independence, good code quality  
**Yellow:** Only 1-2 PRs, needs lots of hand-holding  
**Red:** No merged PRs, fundamental misunderstanding

**Action:** Evaluate if role is right fit, provide intensive support

---

## 🎓 Handoff Checklist

### When Moving from Supervised → Independent

After ~2 months, when trainee demonstrates:
- [ ] Consistent code quality
- [ ] Understands architecture
- [ ] Follows Git workflow without reminders
- [ ] Tests thoroughly before submitting
- [ ] Handles review feedback well
- [ ] Asks questions when needed

**Then:**
- [ ] Grant more autonomy
- [ ] Assign larger features
- [ ] Reduce review detail level
- [ ] Let them review junior trainees

---

## 📝 Templates

### Welcome Email Template

```
Subject: Welcome to the CRM Team!

Hi [Trainee Name],

Welcome aboard! We're excited to have you working on our CRM module.

To get started:

1. Repository Access: [GitHub/GitLab link]
2. Environment Setup: Check CRM_TRAINEE_ONBOARDING.md in the .agent folder
3. First Tasks: See CRM_TRAINEE_FIRST_TASKS.md
4. Credentials: [Share securely via 1Password/LastPass/separate email]

Our first meeting is scheduled for [Date/Time]. We'll:
- Give you a project overview
- Walk through the CRM module
- Answer your questions
- Get you set up

In the meantime, please:
- Clone the repository
- Read the onboarding documentation
- Set up your development environment

If you hit any blockers, reach out on [Slack/Teams channel] or email me directly.

Looking forward to working with you!

Best,
[Your Name]
CRM Team Lead
```

### Weekly Check-in Template

```
# Weekly Check-in - [Name] - [Date]

## This Week
- What did you complete?
- What's in progress?
- Any blockers?

## Next Week
- What will you work on?
- Any concerns?

## Questions/Discussion
- 

## Action Items
- [ ] 
- [ ] 
```

---

## 🎯 Success = Happy, Learning, Contributing Trainee

**You know it's going well when:**
- They're asking thoughtful questions
- Code quality improves each PR
- They're excited about their work
- Small features completed independently
- Positive team dynamic

---

**Remember: Investing time now in good onboarding pays off with a productive team member later! 🚀**

---

**Quick Links:**
- Full Onboarding: `.agent/CRM_TRAINEE_ONBOARDING.md`
- First Tasks: `CRM_TRAINEE_FIRST_TASKS.md`
- Git Workflow: `.agent/CRM_GIT_WORKFLOW_GUIDE.md`
- Code Review: `.agent/CRM_CODE_REVIEW_CHECKLIST.md`
- Setup Guide: `.agent/CRM_CODE_MANAGEMENT_SETUP.md`
