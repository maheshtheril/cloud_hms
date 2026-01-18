---
description: How to safely revert to Render hosting and backup data
---

# Reverting to Render & Backup Strategy

If you decide Vercel isn't right, here is how to revert to Render and manage your data.

## Part 1: How to Backup Render Data
Before leaving Render (or periodically), you should backup your PostgreSQL database.

### Option A: Via Render Dashboard (Easiest)
1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Go to your **PostgreSQL** service.
3.  Click on the **Backups** tab on the left.
4.  Click **Download** on the latest backup. This gives you a `.tar.gz` or `.sql` dump.

### Option B: Via CLI (If you have connection string)
If you have the `External Connection String` from Render (starts with `postgres://...`):
```powershell
pg_dump "postgres://user:pass@host/db" > render_backup_DATE.sql
```

## Part 2: Reverting Deployment to Render
Since you have `render.yaml`, reverting is simple.

1.  **Git Push**: Ensure your latest code is pushed to the `main` branch.
2.  **Render Dashboard**:
    - If you deleted the service: Create specific "Web Service" -> Connect Repo -> It will read `render.yaml`.
    - If you paused/suspended it: Just click **Resume**.
3.  **Environment Variables**:
    - Ensure `DATABASE_URL` points to the *Render* database (Internal URL is faster: `postgres://user:pass@render-postgres:5432/db`).
    - Ensure `NEXT_PUBLIC_APP_URL` is set to `https://cloud-hms.onrender.com` (or your custom domain).
4.  **Trigger Deploy**: Click **Manual Deploy** -> **Clear Build Cache & Deploy** to be safe.

## Troubleshooting Revert
- **"Protocol Error" / 431 Headers**: If you see these again on Render, it's often due to large cookies. Vercel handles these better, but on Render, ensure you aren't storing massive data in sessions.
- **Database Connectivity**: If the app starts but errors on login, check `DATABASE_URL`. Is it trying to connect to Neon?
    - **Fix**: Go to Render Dashboard -> Environment -> Update `DATABASE_URL` to the *Render* Internal DB URL.

## Hybrid Mode (common)
You can actually keep the **Database on Neon** (for speed/reliability) and the **App on Render**.
To do this:
1.  Keep the app on Render.
2.  Change Render's `DATABASE_URL` environment variable to the **Neon** connection string.
3.  This gives you a better database (Neon) even if you prefer Render's hosting.
