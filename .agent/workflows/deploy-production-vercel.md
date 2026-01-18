---
description: How to deploy the SaaS ERP to Vercel + Neon for Production (Kerala/India)
---

# Production Deployment (Vercel + Neon)

This workflow guides you through deploying the application to Vercel (Web) and Neon (Database) for maximum performance in India.

## Prerequisites
- GitHub Account (connected to this repository)
- Vercel Account
- Neon.tech Account

## Step 1: Database Setup (Neon)
1.  Log in to [Neon.tech](https://neon.tech).
2.  Create a **New Project**.
3.  **Name**: `saas-erp-prod-india` (or similar).
4.  **Region**: Select **Asia Pacific (Mumbai) - aws-ap-south-1**. This is CRITICAL for speed.
5.  **Compute**: Start with a shared compute (0.25 - 1 CU) which autoscales.
6.  Neon will show you a connection string like: `postgres://neondb_owner:AbCdEf12@ep-round...`
    - Copy this as your **Pooled Connection String** (it usually ends with `-pooler` or you select "Pooled").
    - **Note**: For Prisma, it is best to use the pooled connection string for `DATABASE_URL`.

## Step 2: Environment Variables
Prepare these values for Vercel:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...` | Your Neon connection string |
| `AUTH_SECRET` | `[random string]` | Run `npx auth secret` locally to generate one spread |
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` | (Update this AFTER deployment created) |
| `RESEND_API_KEY` | `re_...` | For emails (keep existing) |
| `WHATSAPP_TOKEN` | `...` | For WhatsApp (keep existing) |

## Step 3: Vercel Deployment
1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import the `SAAS_ERP` repository.
4.  **Configure Project**:
    - **Framework Preset**: Next.js (Auto-detected).
    - **Root Directory**: `.` (Default).
    - **Build Command**: `prisma generate && next build` (Default is usually just `next build`, ensure `prisma generate` is there).
      - *Actually, your package.json has "build": "prisma generate && next build", so default is perfect.*
5.  **Environment Variables**:
    - Add all variables from Step 2.
6.  **Project Settings (Region)**:
    - Before clicking Deploy (or immediately after in Settings -> Functions -> Region), ensure the Function Region is set to **Mumbai, India (bom1)**.
7.  Click **Deploy**.

## Step 4: Post-Deployment
1.  Once deployed, Vercel will give you a domain (e.g., `saas-erp.vercel.app`).
2.  Go to **Settings** -> **Environment Variables**.
3.  Add/Update `NEXT_PUBLIC_APP_URL` with this real domain.
4.  Redeploy (or specific "Redeploy" from deployment dashboard) to bake in the new public URL.

## Step 5: Database Push
Vercel builds will generate the client, but might not *push* the schema if the DB is empty.
On your local machine, run this to push the schema to the NEW production DB:
```bash
# In your local terminal
$env:DATABASE_URL="postgres://neondb..." # Your NEON URL
npx prisma db push
```
*Note: Be careful not to overwrite your local DB. It is safer to use the Vercel Integration or do this via a temporary .env.production file.*

DONE! Your app is now running on Edge Network in Mumbai.
