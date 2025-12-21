# 📧 Setting up Email Invitations (Resend)

To make user invitations work, you need to configure the **Resend API Key**.

## 1. Get the Key
1. Go to [Resend.com](https://resend.com) and Sign Up/Login.
2. Click **"API Keys"** on the left sidebar.
3. Click **"Create API Key"**.
4. Name it "Cloud HMS" and give it "Full Access" or "Sending Access".
5. Copy the key (it starts with `re_...`).

## 2. Add to Render
1. Go to your **Render Dashboard**.
2. Select your Web Service (e.g., `cloud-hms-app`).
3. Click the **"Environment"** tab.
4. Click **"Add Environment Variable"**.
5. Enter the details:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_123456...` (Paste your actual key)
6. Click **"Save Changes"**.

## 3. Use Your Own Domain (`zaayasoft.com`)
Yes, you can absolutely use `mahesh@zaayasoft.com`! Here is how:

### A. Verify Your Domain in Resend
1. Go to the **Domains** tab in Resend Dashboard.
2. Click **"Add Domain"**.
3. Enter `zaayasoft.com` (Select specific region if creating new, usually 'us-east-1').
4. Resend will show you a list of **DNS Records** (TXT, MX, CNAME).

### B. Add DNS Records in GrabWeb
1. Log in to your **GrabWeb** control panel (or wherever you manage DNS).
2. Find the **DNS Manager** or **Zone Editor**.
3. **Copy/Paste** the records from Resend into GrabWeb one by one.
   - **Type:** (e.g., TXT / MX)
   - **Name:** (e.g., `bounces` or `default._domainkey`)
   - **Value:** (The long string Resend gives you)
4. Wait for them to propagate (can take 10 mins to 24 hours, usually fast).
5. In Resend, click **"Verify"**. Once it says "Verified", you are ready!

### C. Update Render Environment
1. Go back to Render Dashboard.
2. Add/Edit the Environment Variable:
   - **Key:** `RESEND_FROM_EMAIL`
   - **Value:** `mahesh@zaayasoft.com` OR `"Cloud HMS" <mahesh@zaayasoft.com>`
3. **Save Changes**.

Now emails will come from **you**!

---

### 🛡️ Safety Check (Read Before Changing DNS)
Since you have existing apps running on `zaayasoft.com`:
1. **It is Safe:** Adding these records will **NOT** affect your website or existing apps. They act as "additional permissions" for email.
2. **Do NOT Delete:** Never delete your existing records. Only **ADD** the new ones Resend gives you.
3. **SPF Record:** If you already have a TXT record for `@` that starts with `v=spf1...`:
   - Do **NOT** add a second one.
   - Instead, **Edit** the existing one and add `include:resend.com` inside it.
   - *Example:* `v=spf1 include:_spf.google.com include:resend.com ~all`


---

### ⚠️ Important Note
After saving the variables, Render will automatically restart your app. Email sending will start working immediately after the restart.
