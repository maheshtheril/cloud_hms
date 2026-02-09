# =====================================================
# PRODUCTION DATABASE CLEANUP - MANUAL INSTRUCTIONS
# =====================================================
#
# Due to DNS connectivity issues, please apply this migration manually
# using one of the following methods:
#
# METHOD 1: Using Prisma CLI (Recommended)
# -----------------------------------------
npx prisma migrate deploy

# METHOD 2: Using psql directly
# ------------------------------
psql $DATABASE_URL -f prisma/migrations/20260209_final_schema_cleanup/migration.sql

# METHOD 3: Using Neon Console
# -----------------------------
# 1. Go to https://console.neon.tech
# 2. Select your project
# 3. Go to SQL Editor
# 4. Copy and paste the contents of:
#    prisma/migrations/20260209_final_schema_cleanup/migration.sql
# 5. Execute the SQL

# METHOD 4: Using Node.js when connectivity is stable
# ----------------------------------------------------
node scripts/apply_final_migration.js

# =====================================================
# WHAT THIS MIGRATION DOES
# =====================================================
#
# This migration will:
# 1. Fix hms_invoice.line_items (convert from jsonb[] to jsonb)
# 2. Remove 216 phantom array columns that are causing errors
# 3. Preserve 2 legitimate arrays:
#    - hms_clinicians.working_days
#    - role.permissions
# 4. Recreate necessary views
# 5. Verify the cleanup was successful
#
# After running this migration, the "malformed array literal" error
# will be permanently resolved.
#
# =====================================================
# VERIFICATION
# =====================================================
#
# After applying the migration, verify it worked:
#
# Run this SQL query:
SELECT COUNT(*) as phantom_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND (data_type = 'ARRAY' OR udt_name LIKE '_%')
AND NOT (
    (table_name = 'hms_clinicians' AND column_name = 'working_days') OR
    (table_name = 'role' AND column_name = 'permissions')
);

# Expected result: phantom_count = 0
#
# If phantom_count = 0, the migration was successful!
# =====================================================
