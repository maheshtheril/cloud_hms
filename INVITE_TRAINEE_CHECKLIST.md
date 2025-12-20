# ✅ QUICK CHECKLIST: Inviting Your Trainee

**Follow these steps in order:**

---

## BEFORE YOU INVITE (5 minutes)

- [ ] **Know your repository URL**
      Example: https://github.com/yourusername/SAAS_ERP
      
- [ ] **Prepare credentials document**
      Copy your .env file contents to a secure note
      
- [ ] **Choose secure sharing method**
      Options: 1Password, LastPass, Email encryption, Video call
      
- [ ] **Schedule kickoff meeting**
      Book 45 minutes in calendar
      
---

## STEP 1: GRANT REPOSITORY ACCESS (2 minutes)

### GitHub:
1. Go to: `https://github.com/YOUR_USERNAME/SAAS_ERP/settings/access`
2. Click "Collaborators" → "Add people"
3. Enter trainee's GitHub username or email
4. Select "Write" access
5. Click "Add [name] to this repository"

### GitLab:
1. Go to: Your Project → Settings → Members
2. Click "Invite members"
3. Enter email or username
4. Role: "Developer"
5. Click "Invite"

✅ **Done when:** Trainee receives invitation email

---

## STEP 2: SEND WELCOME EMAIL (3 minutes)

1. Open: `WELCOME_EMAIL_TEMPLATE.txt`
2. Replace placeholders:
   - `[Trainee Name]` → Actual name
   - `[INSERT_YOUR_REPO_URL]` → Your repo URL
   - `[INSERT_CHANNEL_LINK]` → Your Slack/Teams link
   - `[YOUR_EMAIL]` → Your email
   - `[INSERT_DATE]` → Kickoff meeting date
   - `[INSERT_TIME]` → Kickoff meeting time
   - `[INSERT_MEETING_LINK]` → Zoom/Teams link
   - `[Your Name]` → Your name
   
3. Copy entire text
4. Paste into email
5. Send!

✅ **Done when:** Email sent to trainee

---

## STEP 3: SHARE CREDENTIALS (5 minutes)

**⚠️ NEVER send via plain email!**

### Option A: 1Password/LastPass (Recommended)
1. Create new secure note/vault item
2. Title: "SAAS ERP - Dev Credentials"
3. Add your .env contents
4. Share with trainee's email
5. Send them the share link

### Option B: Encrypted File
1. Create text file with .env contents
2. Encrypt with 7zip/WinRAR (strong password)
3. Send encrypted file via email
4. Share password via SMS/phone call

### Option C: Video Call (Most Secure)
1. During kickoff meeting
2. Screen share .env file
3. Let them copy
4. Verify they have it

### What to share:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

✅ **Done when:** Trainee confirms they received credentials

---

## STEP 4: ADD TO COMMUNICATION (2 minutes)

- [ ] Add to Slack workspace
- [ ] Add to #crm-team channel (or create it)
- [ ] Send welcome message in channel
- [ ] Introduce them to team

**Welcome message:**
```
👋 Everyone, please welcome [Name] to the team! 
They'll be working on the CRM module with us.
[Name], feel free to ask questions anytime!
```

✅ **Done when:** Trainee is in communication channel

---

## STEP 5: FINAL CONFIRMATION (1 minute)

Send quick follow-up message:

**Via Email/Slack:**
```
Hey [Name],

Quick checklist for you:
✅ Accepted GitHub invitation?
✅ Received credentials?
✅ Joined Slack channel?
✅ Have meeting link for [DATE] at [TIME]?

Let me know if anything is missing!

- [Your Name]
```

✅ **Done when:** Trainee confirms all items

---

## TIMELINE

**Day 0 (Today):** Send invitations and welcome email
**Day 1:** Check if they accepted invite
**Day 2-3:** Kickoff meeting
**Week 1:** Daily check-ins on setup progress
**End Week 1:** Review first PR

---

## WHAT THEY'LL SEE

After accepting GitHub/GitLab invite, they'll:

1. Clone repository
2. Open `CRM_ONBOARDING_README.md` (this is their guide!)
3. Follow setup instructions
4. Create their first branch
5. Submit first PR by end of Week 1

---

## IF THEY GET STUCK

**Common Issue 1: Can't clone repo**
→ Check if they accepted GitHub invitation
→ Verify they have Git installed
→ Share exact clone command

**Common Issue 2: npm install fails**
→ Check Node.js version (needs v18+)
→ Try: `npm cache clean --force` then `npm install`

**Common Issue 3: Database connection error**
→ Verify DATABASE_URL is correct
→ Check if they're on VPN (if required)
→ Test connection from their machine

**Common Issue 4: "I don't know where to start"**
→ Point them to: `CRM_ONBOARDING_README.md`
→ Schedule screen share to walk through together

---

## YOUR FIRST MEETING AGENDA

**Duration:** 45 minutes

**5 min:** Introductions
- Your background
- Their background
- Team members

**10 min:** Project Demo
- Show live CRM module
- Explain what it does
- Show their future tasks

**10 min:** Architecture Overview
- Tech stack explanation
- How CRM fits in bigger system
- Database structure (high level)

**10 min:** Setup Check
- Do they have repo cloned?
- Credentials work?
- Any blockers?

**5 min:** Next Steps
- Day 1-2 task: Finish environment setup
- Day 3-4 task: Explore application
- Day 5 task: First bug fix
- When to check in next

**5 min:** Q&A
- Their questions
- Clarifications

---

## AFTER THE MEETING

- [ ] Send meeting summary via email
- [ ] Share any additional resources discussed
- [ ] Set reminder to check in tomorrow
- [ ] Wait for their first question (it will come!)

---

## CUSTOMIZE THESE:

Before sending email, update:

```
YOUR_REPO_URL = https://github.com/yourname/SAAS_ERP
YOUR_EMAIL = your.email@company.com
YOUR_PHONE = +91-XXXX-XXXX (optional)
SLACK_CHANNEL = #crm-team
MEETING_LINK = https://zoom.us/j/... or Teams link
MEETING_DATE = December 23, 2025
MEETING_TIME = 10:00 AM IST
SECURE_SHARE_METHOD = 1Password / LastPass / Other
```

---

## COPY-PASTE REPO INVITE LINK

**GitHub:**
https://github.com/YOUR_USERNAME/SAAS_ERP/settings/access

**GitLab:**
https://gitlab.com/YOUR_USERNAME/SAAS_ERP/-/project_members

---

## 🎉 YOU'RE READY!

**Total time to invite:** ~15 minutes
**Total time for kickoff:** 45 minutes
**Total time Week 1:** 2-3 hours (check-ins + PR review)

**This is a great investment for getting a productive team member!**

---

## QUESTIONS?

Check: `.agent/CRM_TRAINEE_INVITATION_GUIDE.md` for detailed guide

**Let's do this! 🚀**
