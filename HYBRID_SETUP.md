# Professional Hybrid HMS Infrastructure Guide

This setup takes your HMS from a "Web App" to a **"Distributed Edge System"**. It provides desktop-like speeds within the hospital while maintaining a real-time cloud backup.

## 1. Architecture Overview

### A. Code Sync (Git)
*   **Developer Machine:** Your local laptop (where you code). Pushes to GitHub.
*   **Hospital Server:** A dedicated PC (Edge Server) in the NICU/Office. Pulls from GitHub.
*   **Cloud (Vercel):** Automatically deploys from GitHub for remote access.

### B. Database Sync (Replication)
*   **Hospital DB (Primary):** The "Source of Truth." All patient registrations, bills, and prescriptions happen here first.
*   **Cloud DB (Replica):** Your Supabase/Hosted DB. It automatically stays in sync with the Hospital DB via **PostgreSQL Logical Replication**.

---

## 2. Hospital Server Requirements
*   **OS:** Ubuntu 22.04 LTS (Recommended) or Windows with Docker Desktop.
*   **Hardware:** 8GB+ RAM, 100GB+ SSD (NVMe preferred for speed).
*   **Network:** Static IP within the Hospital LAN (e.g., `192.168.1.50`).

---

## 3. Deployment Steps on Hospital Server

### Step 1: Install Docker
Ensure Docker and Docker Compose are installed on the Hospital machine.

### Step 2: Clone the Repository
```bash
git clone https://github.com/maheshtheril/cloud_hms.git
cd cloud_hms
```

### Step 3: Setup Environment Variables
Create a `.env` file in the root directory:
```env
DB_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_secret
LOCAL_URL=http://192.168.1.50  # The Hospital Server's IP
CLOUD_DATABASE_URL=postgres://user:pass@supabase-url.com:5432/postgres
```

### Step 4: Fire it up
```bash
docker compose up -d --build
```

---

## 4. Enabling Cloud Sync (The Sync)

Your local database is already configured (via `infra/init-db.sql`) to "Publish" changes. To start the sync, you need to "Subscribe" from your Cloud Database.

### On your Cloud DB (Supabase/Hosted Postgres):
Run this SQL command:
```sql
CREATE SUBSCRIPTION hms_cloud_subscription
CONNECTION 'host=your_hospital_public_ip_or_vpn_ip port=5432 user=hms_admin password=your_password dbname=hms_prod'
PUBLICATION hms_cloud_publication;
```

*Note: You will need to ensure the Hospital Server's port 5432 is accessible from the cloud, or use a VPN like Tailscale (Highly Recommended for Security).*

---

## 5. Daily Development Workflow

1.  **Code:** Edit code on your dev machine.
2.  **Test:** Use `npm run dev` locally.
3.  **Push:** `git commit -m "new feature" && git push`
4.  **Deploy to Hospital:**
    SSH into the hospital server and run:
    ```bash
    git pull origin main
    docker compose up -d --build
    ```
5.  **Deploy to Cloud:** Vercel handles this automatically on push.

## 6. Benefits of this "World Standard" Setup
1.  **Zero Latency:** $1ms$ response time. No loading spinners.
2.  **Offline Working:** If the internet dies, the hospital is unaffected.
3.  **Real-time Backup:** If the hospital server burns down, all data is safe in the cloud.
4.  **Remote Access:** Management can view reports from anywhere in the world.
