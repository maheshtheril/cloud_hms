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

## 3. (Optional) Custom Sender Email
By default, emails come from `onboarding@resend.dev` (only works for your own email if testing).
To send to *anyone*, you must verify a domain in Resend:
1. Verify your domain in Resend settings.
2. Add another variable in Render:
   - **Key:** `RESEND_FROM_EMAIL`
   - **Value:** `invites@yourdomain.com`

---

### ⚠️ Important Note
After saving the variables, Render will automatically restart your app. Email sending will start working immediately after the restart.
