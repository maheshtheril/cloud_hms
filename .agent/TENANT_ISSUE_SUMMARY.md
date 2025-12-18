# Tenant Isolation Issue - Investigation & Fixes

## Issue Reported
New tenants are seeing purchase order data at `https://cloud-hms.onrender.com/hms/purchasing/orders` that shouldn't belong to them.

## Investigation Results

### ✅ What's Working
The main page code (`src/app/hms/purchasing/orders/page.tsx`) is **correctly filtering** by both:
- `tenant_id` 
- `company_id`

This means the filtering logic itself is fine.

### ⚠️ What Was Wrong
Found **missing tenant_id filters** in several action functions in `src/app/actions/purchase.ts`:

1. `getPurchaseOrders()` - Only filtered by company_id ✅ **FIXED**
2. `getSuppliers()` - Only filtered by company_id ✅ **FIXED**
3. `searchSuppliers()` - Only filtered by company_id ✅ **FIXED**
4. `searchProducts()` - Only filtered by company_id ✅ **FIXED**

### 🔍 Root Cause Analysis
Since the page code is correct but users still see data, the issue is likely:

**Primary Suspect: Shared Tenant ID**
- New signups are getting assigned the same `tenant_id` as existing data
- OR there's seed/test data with a tenant_id that matches new signups

**Secondary Issues:**
- Multiple query functions lacked tenant_id filters (now fixed)
- Other modules may have the same issue (see TENANT_AUDIT.md)

## Fixes Applied

### 1. Fixed Purchase Actions ✅
Updated `src/app/actions/purchase.ts` to add `tenant_id` filters to:
- getPurchaseOrders
- getSuppliers  
- searchSuppliers
- searchProducts

All now properly filter by both `tenant_id` AND `company_id`.

### 2. Created Debug Tools 🔧

**A. SQL Diagnostic Scripts:**
- `debug-po-tenant.sql` - Shows purchase orders grouped by tenant
- `diagnose-tenant-issue.sql` - Quick diagnostic queries

**B. Debug Page:**
- `/hms/debug/tenant-check` - Visual tenant isolation checker
- Shows your tenant_id, purchase orders, and tenant distribution

## Next Steps for YOU

### Step 1: Access the Debug Page 🎯
Visit: `https://cloud-hms.onrender.com/hms/debug/tenant-check`

This will show you:
- Your current tenant_id
- Which purchase orders you can see
- Whether those orders belong to your tenant
- Distribution of orders across tenants

### Step 2: Check Database (if you have access)
Run the diagnostic SQL:
```sql
-- See which tenants have purchase orders
SELECT 
    tenant_id,
    COUNT(*) as order_count
FROM hms_purchase_order
GROUP BY tenant_id;

-- Get the newest tenants
SELECT id, name, created_at 
FROM tenant 
ORDER BY created_at DESC 
LIMIT 5;
```

### Step 3: Verify Tenant Creation
Check your signup/registration code to ensure:
- Each new signup creates a **unique** tenant
- Users aren't being assigned to a "default" tenant
- tenant_id is properly set during user creation

### Step 4: Clean Up (if needed)
If you find orphaned test data:
```sql
-- BE CAREFUL! Only delete if you're sure it's test data
-- DELETE FROM hms_purchase_order WHERE tenant_id = '<test-tenant-id>';
```

## Files Modified
- ✅ `src/app/actions/purchase.ts` - Added tenant_id filters to 4 functions
- 📝 `.agent/TENANT_ISOLATION_FIX.md` - Detailed analysis
- 📝 `.agent/TENANT_AUDIT.md` - Full codebase audit results
- 🔧 `src/app/hms/debug/tenant-check/page.tsx` - Debug UI
- 🔧 `debug-po-tenant.sql` - SQL diagnostics
- 🔧 `diagnose-tenant-issue.sql` - Quick checks

## Other Files That May Need Fixes
See `.agent/TENANT_AUDIT.md` for a complete list of files with potential tenant isolation issues:
- `src/app/actions/inventory.ts` - Multiple queries
- `src/app/actions/receipt.ts`
- `src/app/actions/uom.ts`
- `src/app/actions/inventory-operations.ts`

## Testing Checklist
- [ ] Visit `/hms/debug/tenant-check` and review output
- [ ] Create a NEW test tenant account
- [ ] Verify new tenant sees NO purchase orders
- [ ] Create a test purchase order with new tenant
- [ ] Verify new tenant ONLY sees their own purchase order
- [ ] Verify old tenants still see their data correctly

## Questions to Answer
1. What tenant_id do new signups get assigned?
2. Is there a "default" or "global" tenant in the database?
3. Did someone run seed scripts on production?
4. Are there any purchase orders with NULL tenant_id?
