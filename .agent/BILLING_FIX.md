# 🔧 Billing Page Fix - Items Not Listing

## 🐛 **Root Cause:**

The billing page query filters products by `is_service: true`:

```typescript
where: {
    is_service: true,  // ← Only shows service items!
    is_active: true
}
```

**Problem:** You probably don't have any products marked as `is_service = true`.

---

## ✅ **Solution Options:**

### **Option 1: Add Service Products (Recommended)**

Create billable service items:
```sql
INSERT INTO hms_product (
    tenant_id, company_id, 
    name, is_service, is_active, price
) VALUES
    (..., 'Consultation Fee', TRUE, TRUE, 500),
    (..., 'X-Ray', TRUE, TRUE, 300),
    (..., 'Blood Test', TRUE, TRUE, 150);
```

### **Option 2: Show ALL Products in Billing**

Change the query to include all products:

**File:** `src/app/actions/billing.ts`

**Change from:**
```typescript
where: {
    tenant_id: session.user.tenantId,
    company_id: session.user.companyId,
    is_service: true,  // Remove this!
    is_active: true
}
```

**To:**
```typescript
where: {
    tenant_id: session.user.tenantId,
    company_id: session.user.companyId,
    is_active: true
    // Removed is_service filter - show all products
}
```

### **Option 3: Hybrid Approach**

Show both products AND services:
```typescript
where: {
    tenant_id: session.user.tenantId,
    company_id: session.user.companyId,
    is_active: true,
    OR: [
        { is_service: true },
        { sellable: true }  // If you have this field
    ]
}
```

---

## 🎯 **Quick Fix (Option 2 - Show All Products):**

This will make billing work immediately with your existing pharmacy products.

**File to edit:** `src/app/actions/billing.ts`  
**Line:** ~14

Just remove the `is_service: true,` line.

---

## 💡 **Best Practice (Option 1):**

**For a proper HMS:**
- Pharmacy products (`is_service: false`) - For pharmacy sales
- Medical services (`is_service: true`) - For consultations, procedures
- Both can be billed

**Create service items via:**
1. Products master → Add new
2. Check "Is Service" checkbox
3. Enter price

---

## 🔍 **Debug Query:**

Check what you have:
```sql
SELECT 
    name, 
    is_service, 
    is_active,
    price 
FROM hms_product 
WHERE tenant_id = '...' 
LIMIT 10;
```

---

## ⚡ **Which Option Do You Want?**

**Tell me:**
1. Show all products (quick fix)
2. Create service items (proper way)
3. Something else

I'll implement it immediately!
