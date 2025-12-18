# Tenant Data Isolation Issue - Purchase Orders

## Problem
Newly signed-up tenants are seeing purchase order data that doesn't belong to them when accessing `/hms/purchasing/orders`.

## Root Cause Analysis

The page itself (src/app/hms/purchasing/orders/page.tsx) **correctly filters** by both `tenant_id` and `company_id` (lines 16-20):

```typescript
const orders = await prisma.hms_purchase_order.findMany({
    where: {
        tenant_id: tenantId,
        company_id: companyId
    },
    // ...
})
```

This means the issue is **NOT in the filtering logic**, but rather one of the following:

### Possible Causes

1. **Shared Tenant ID**: Multiple users/tenants are being assigned the same `tenant_id` during signup
   - Check the signup/registration flow
   - Verify tenant creation logic

2. **Global Seed Data**: There's seed data in the database with a `tenant_id` that matches what new tenants get
   - Check if there are any seed scripts that create purchase orders
   - Look for hardcoded tenant_ids in seed data

3. **NULL Tenant ID**: Some purchase orders have `NULL` tenant_id and the query matches them unexpectedly
   - Database constraint should prevent this, but worth checking

4. **Cached Data**: Frontend is showing cached data from a previous session
   - Less likely given server-side rendering

## Diagnostic Steps

### Step 1: Run the diagnostic SQL
Execute the SQL in `diagnose-tenant-issue.sql` to identify:
- Any NULL tenant_ids
- Which tenant_id has the most purchase orders
- The newest tenants created

### Step 2: Check Signup Flow
Review how `tenant_id` is assigned during user registration:
- Look at signup actions/API routes
- Verify unique tenant_id generation

### Step 3: Check for Seed Data
Search for any seed scripts that might be creating purchase orders:
```bash
# Already checked - no seed scripts create purchase orders
# But verify in database directly
```

## Immediate Fix Options

### Option 1: Delete Orphaned Purchase Orders
If there's seed/test data that shouldn't be there:

```sql
-- First, identify the problematic tenant_id
SELECT tenant_id, COUNT(*) FROM hms_purchase_order GROUP BY tenant_id;

-- Then delete if it's test data (BE CAREFUL!)
-- DELETE FROM hms_purchase_order WHERE tenant_id = 'THE_PROBLEMATIC_TENANT_ID';
```

### Option 2: Add Additional Validation
Add logging to the page to see what tenant_id is being used:

```typescript
// In page.tsx, add logging
console.log('Current user tenantId:', tenantId)
console.log('Found orders:', orders.length)
console.log('Orders tenant_ids:', orders.map(o => o.tenant_id))
```

### Option 3: Fix Tenant Assignment
If the issue is in signup, ensure each new signup gets a unique tenant:

```typescript
// In signup action
const newTenant = await prisma.tenant.create({
    data: {
        name: companyName,
        // Ensure unique tenant creation
    }
})
```

## Additional Issues Found

In `src/app/actions/purchase.ts`, the `getPurchaseOrders` function (line 27) **ONLY filters by company_id**:

```typescript
const where: any = {
    company_id: session.user.companyId,
    // MISSING: tenant_id filter!
}
```

This should be fixed to:

```typescript
const where: any = {
    tenant_id: session.user.tenantId,
    company_id: session.user.companyId,
}
```

## Recommended Actions

1. **Run the diagnostic SQL** to identify the root cause
2. **Fix the `getPurchaseOrders` function** to include tenant_id filter (even though the page doesn't use it)
3. **Verify tenant creation** during signup
4. **Add logging** temporarily to see what's happening
5. **Clean up any test/seed data** from the production database

## Files to Check

- `src/app/actions/purchase.ts` - getPurchaseOrders function needs tenant_id filter
- Signup/registration actions - verify unique tenant creation
- Database - check for duplicate tenant_ids or test data
