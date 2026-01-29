---
description: Deploy SaaS ERP to Vercel + Neon (Free Tier)
---

# Deploy to Vercel + Neon (Free Stack)

This guide takes you from "Expensive Render" to "Free Vercel + Neon" in ~15 minutes.

## Phase 1: Create Free Database (Neon)

1.  **Sign Up**: Go to [https://neon.tech](https://neon.tech) and sign up/login.
2.  **Create Project**: Click "New Project".
    *   **Name**: `cloud-hms-db`
    *   **Postgres Version**: 15 or 16 (default is fine).
    *   **Region**: Choose the one closest to `India` (e.g., Singapore) for best speed.
3.  **Get Connection String**:
    *   Once created, you will see a connection string like: `postgres://neondb_owner:AbC123...@ep-solitary-....aws.neon.tech/neondb?sslmode=require`
    *   **Copy this string**.
4.  **Update Local Config**:
    *   Open your local `.env` file.
    *   Replace the `DATABASE_URL` value with this new Neon string.
    
    ```bash
    # Example .env update
    DATABASE_URL="postgres://neondb_owner:..."
    ```

5.  **Push Schema**:
    *   Run this command in your VS Code terminal to set up the tables in the new DB:
    ```powershell
    npx prisma db push
    ```
    *(If it says "success", your database is ready!)*

6.  **Seed Data** (Optional but recommended):
    *   Run the seed script to create the initial admin account:
    ```powershell
    npx tsx prisma/seed.ts
    ```

---

## Phase 2: Deploy App (Vercel)

1.  **Sign Up**: Go to [https://vercel.com](https://vercel.com) and sign up with GitHub/GitLab (wherever your code is).
2.  **Import Project**:
    *   Click "Add New..." -> "Project".
    *   Select your `SAAS_ERP` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (Auto-detected).
    *   **Root Directory**: `.` (Default).
4.  **Environment Variables** (CRITICAL):
    *   Expand the "Environment Variables" section.
    *   Add the following (Copy values from your local `.env`):
        *   `DATABASE_URL`: *(The Neon URL you just got)*
        *   `AUTH_SECRET`: *(Copy from local .env or generate a new random string)*
        *   `NEXT_PUBLIC_APP_URL`: `https://your-project-name.vercel.app` (You can update this after deployment if the URL changes).
5.  **Deploy**:
    *   Click **Deploy**.
    *   Wait ~2 minutes. You will see confetti! 🎉

## Phase 3: Update Branding (Post-Deploy)

1.  Visit your new Vercel URL (e.g., `https://saas-erp.vercel.app`).
2.  Log in with your seed credentials.
3.  The branding might be default initially. To fix:
    *   Go to Global Settings.
    *   Update Logo/Name.
    *   Or use the `?org=slug` trick we added!

---

**Troubleshooting:**
*   **Authentication Error?** Ensure `AUTH_SECRET` is set in Vercel settings.
*   **Database Error?** Ensure `npx prisma db push` worked locally (verifying the connection string).
