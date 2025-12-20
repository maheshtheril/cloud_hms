# HOW TO SEED DEPARTMENTS

## Quick Guide

Departments are **tenant-specific** (each hospital has different ones).

---

## **Option 1: Quick Seed (15 Standard Departments)**

### Step 1: Get Your IDs

```sql
SELECT id as tenant_id FROM tenant LIMIT 1;
SELECT id as company_id FROM company LIMIT 1;
```

### Step 2: Update & Run

1. Open `.agent/seed_departments.sql`
2. Replace `YOUR_TENANT_ID` and `YOUR_COMPANY_ID`
3. Run:

```bash
psql $DATABASE_URL -f .agent/seed_departments.sql
```

### You'll Get:
- ✅ Emergency Department
- ✅ ICU
- ✅ Operating Theatre
- ✅ OPD / IPD
- ✅ Cardiology, Neurology, Pediatrics
- ✅ Radiology, Pathology, Pharmacy
- ✅ And 5 more!

---

## **Option 2: Already Have Departments?**

Check if you already have them:

```sql
SELECT id, name, code FROM hms_departments 
WHERE tenant_id = 'YOUR_TENANT_ID'
ORDER BY name;
```

If you see departments listed, the form should show them!

---

## **If Departments Still Don't Show:**

### 1. Check Data Exists
```sql
SELECT COUNT(*) FROM hms_departments WHERE is_active = true;
```

### 2. Check Tenant ID Matches
```sql
-- Your session tenant
SELECT tenant_id FROM tenant LIMIT 1;

-- Your departments tenant
SELECT DISTINCT tenant_id FROM hms_departments;
```

### 3. Reload Page
After seeding, hard refresh the page (Ctrl+F5)

---

## **Quick 5 Essential Departments**

Minimal setup (copy-paste, replace IDs):

```sql
INSERT INTO hms_departments (tenant_id, company_id, name, code, is_active) VALUES
('TENANT', 'COMPANY', 'Emergency Department', 'ED', true),
('TENANT', 'COMPANY', 'Out Patient Department', 'OPD', true),
('TENANT', 'COMPANY', 'Radiology', 'RAD', true),
('TENANT', 'COMPANY', 'Pathology', 'PATH', true),
('TENANT', 'COMPANY', 'Pharmacy', 'PHAR', true);
```

---

## Files

- `.agent/seed_departments.sql` - Full 15+ departments
- This guide

---

**Status:** ✅ Ready to seed
