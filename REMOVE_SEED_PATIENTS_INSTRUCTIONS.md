# Instructions to Remove Seed Patient Data

## Issue
Two seed patients are appearing for all new tenants because they exist in the database dump.

## Option 1: Using psql (Direct Database Access)

If you have `psql` installed and can connect to your database:

```bash
# Connect to your database
psql -h <your-host> -U <your-username> -d <your-database>

# Run this SQL command
DELETE FROM public.hms_patient 
WHERE id IN (
    '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
    '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
);

# Verify deletion
SELECT COUNT(*) FROM public.hms_patient 
WHERE id IN (
    '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
    '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
);
-- Should return 0
```

## Option 2: Using Database GUI (pgAdmin, DBeaver, etc.)

1. Open your database management tool
2. Connect to your database
3. Execute the SQL from `remove_seed_patients.sql` file

## Option 3: Using Prisma Studio

```bash
# Start Prisma Studio
npm run prisma studio
# or
npx prisma studio

# Navigate to hms_patient table
# Find and delete these two records:
# - ID: 9c23da47-b7c4-48cf-99e1-f00aeb81fd4d
# - ID: 959f2ae6-c68f-4501-84e3-5f4d944fcf9f
```

## Option 4: Using Node Script (if database is accessible)

```bash
# Make sure DATABASE_URL is set in .env file
# Then run:
node remove-seed-patients.mjs
```

## Option 5: Create an Admin Page

We can create a database admin page in your application that allows you to delete these records through the UI.

---

## Important Note

**The code fixes have already been applied**, so even if these seed records exist, they will NOT show up for new tenants anymore due to the tenant filtering we implemented.

However, it's still recommended to remove them to keep the database clean.

## What Was Fixed (Already Applied ✅)

1. ✅ **Patients List** - Now filters by `tenant_id`
2. ✅ **Patient Creation** - Uses session-based tenant isolation
3. ✅ **Security** - Prevented cross-tenant data leakage

## Test Without Removing Seed Data

You can test right now:
1. Create a new tenant
2. Go to patients list
3. You should see "No patients found" (even though seed data exists in DB)
4. Create a patient
5. You should only see YOUR patient (not the seed patients)

The tenant filtering ensures you never see patients from other tenants! 🎉
