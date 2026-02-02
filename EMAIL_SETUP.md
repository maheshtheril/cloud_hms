# How to Set Up Automatic Emails (Resend)

To send real emails instead of just generating a link, you need to configure **Resend**.

## Step 1: Get an API Key
1. Go to [Resend.com](https://resend.com) and sign up.
2. on the dashboard, click **API Keys** on the left.
3. Click **Create API Key**.
4. Give it a name (e.g., "HMS Production") and choose "Full Access".
5. **Copy the Key** (it starts with `re_`).

## Step 2: Configure Production (Vercel/Render)
If your app is deployed on Vercel or Render:
1. Go to your project **Settings**.
2. Find the **Environment Variables** section.
3. Add a new variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `paste_your_key_here`
4. **Save** and **Redeploy** your application.

## Step 3: Configure Local Development
To test emails on your laptop:
1. Open the `.env` file in the root of your project (`c:\2035-HMS\SAAS_ERP\.env`).
2. Add the following line at the bottom:
   ```env
   RESEND_API_KEY="re_123456789..."
   ```
3. Restart your server (`npm run dev`).

## Important Note regarding "From" Email
By default, Resend only allows you to send emails to **your own email address** (the one you signed up with) until you verify a domain.
- **Testing:** You can only invite *yourself* (e.g., `yourname@gmail.com`).
- **Production:** To send emails to *anyone* (like `employee@company.com`), you must **verify your domain** (e.g., `seeakk.com`) in the Resend dashboard under "Domains".
