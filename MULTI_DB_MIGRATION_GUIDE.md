# Applying Migration to Multiple Databases

## ✅ Current Database (Neon - hms-erp.vercel.app)
**Status:** Migration applied successfully ✓

## 🔄 seeakk.com Database
**Status:** Needs migration

### How to Apply to seeakk.com Database

You have **two options**:

#### Option 1: Using Prisma Migrate (Recommended)
If seeakk.com uses the same codebase:

1. Update the `.env` file to point to seeakk.com database:
   ```bash
   DATABASE_URL="postgresql://[seeakk_credentials]"
   ```

2. Run the migration:
   ```bash
   npx prisma migrate deploy
   ```

3. Switch back to the original database URL

#### Option 2: Manual SQL Execution (Safer for Production)
1. Go to seeakk.com database console (wherever it's hosted)
2. Copy the entire migration file:
   `prisma/migrations/20260209_final_schema_cleanup/migration.sql`
3. Execute it in the SQL editor

### ⚠️ Important Notes

1. **Same Schema Issue**: If seeakk.com database was created from the same Prisma schema, it likely has the **same phantom array columns** and will experience the **same "malformed array literal" error**.

2. **Backup First**: Before applying to production (seeakk.com), ensure you have a backup.

3. **Timing**: Apply during low-traffic period if possible.

4. **Verification**: After applying, run the verification script:
   ```bash
   node scripts/verify_migration_success.js
   ```

### 🎯 Why You Need This on Both Databases

- Both databases were likely created from the same Prisma schema
- Both have the same phantom array columns causing errors
- Both need the cleanup to be production-ready
- The migration is **idempotent** (safe to run multiple times)

### 📋 Quick Checklist

- [x] Applied to Neon database (hms-erp.vercel.app)
- [ ] Apply to seeakk.com database
- [ ] Verify both databases are clean
- [ ] Test invoice creation on both systems
