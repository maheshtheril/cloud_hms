# PRODUCTION-READY HMS SETUP GUIDE

## Updated: 2025-12-20

This document provides a comprehensive checklist for deploying the HMS module in production.

---

## 1. DATABASE SETUP

### Required Tables (Already in Schema)
✅ **Core HMS Tables:**
- `hms_clinicians` - All clinical staff (doctors, nurses, therapists, etc.)
- `hms_roles` - Staff roles (Doctor, Nurse, Lab Tech, etc.)
- `hms_specializations` - Medical specializations (Cardiology, Neurology, etc.)
- `hms_patient` - Patient records
- `hms_appointments` - Appointment scheduling
- `hms_product` - Medicines & medical supplies
- `hms_prescriptions` - Prescription management
- `hms_prescription_items` - Prescribed medicines

✅ **Billing & Financial:**
- `invoice` - Main invoice/bill table
- `invoice_item` - Line items
- `invoice_payment` - Payment records
- `chart_of_accounts` - Financial accounts
- `journal_entry` - Accounting transactions

### Menu Update (Run This SQL)

```sql
-- Update menu from "Doctors" to "Clinicians"
UPDATE menu_items
SET 
    label = 'Clinicians',
    key = 'hms-clinicians'
WHERE key = 'hms-doctors' OR url = '/hms/doctors';
```

**Run this on your production database:**
```bash
psql $DATABASE_URL < .agent/update_menu_clinicians.sql
```

---

## 2. CHART OF ACCOUNTS - PRODUCTION READY

### Essential Accounts for HMS

Run this SQL to create production-ready chart of accounts:

```sql
-- ASSETS
INSERT INTO chart_of_accounts (tenant_id, company_id, code, name, account_type, is_active)
VALUES
-- Cash & Bank
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1000', 'Cash on Hand', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1010', 'Bank Account - Operating', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1020', 'Bank Account - Savings', 'asset', true),

-- Accounts Receivable
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1100', 'Accounts Receivable - Patients', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1110', 'Accounts Receivable - Insurance', 'asset', true),

-- Inventory
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1200', 'Inventory - Medicines', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1210', 'Inventory - Medical Supplies', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1220', 'Inventory - Lab Supplies', 'asset', true),

-- Fixed Assets
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1500', 'Medical Equipment', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1510', 'Furniture & Fixtures', 'asset', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '1520', 'Accumulated Depreciation', 'asset', true);

-- LIABILITIES
INSERT INTO chart_of_accounts (tenant_id, company_id, code, name, account_type, is_active)
VALUES
-- Current Liabilities
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '2000', 'Accounts Payable - Suppliers', 'liability', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '2010', 'Salaries Payable', 'liability', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '2020', 'Tax Payable', 'liability', true),

-- Long-term Liabilities
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '2500', 'Long-term Loans', 'liability', true);

-- EQUITY
INSERT INTO chart_of_accounts (tenant_id, company_id, code, name, account_type, is_active)
VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '3000', 'Owner Equity', 'equity', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '3100', 'Retained Earnings', 'equity', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '3200', 'Current Year Profit/Loss', 'equity', true);

-- REVENUE
INSERT INTO chart_of_accounts (tenant_id, company_id, code, name, account_type, is_active)
VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '4000', 'Consultation Revenue', 'revenue', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '4010', 'Lab Test Revenue', 'revenue', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '4020', 'Pharmacy Sales', 'revenue', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '4030', 'Procedure Revenue', 'revenue', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '4040', 'Room Charges', 'revenue', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '4050', 'Other Medical Services', 'revenue', true);

-- EXPENSES
INSERT INTO chart_of_accounts (tenant_id, company_id, code, name, account_type, is_active)
VALUES
-- Cost of Goods Sold
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '5000', 'COGS - Medicines', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '5010', 'COGS - Medical Supplies', 'expense', true),

-- Operating Expenses
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6000', 'Salaries - Doctors', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6010', 'Salaries - Nurses', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6020', 'Salaries - Admin Staff', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6100', 'Rent Expense', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6110', 'Utilities', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6120', 'Medical License Fees', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6130', 'Insurance Expense', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6140', 'Maintenance & Repairs', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6150', 'Marketing & Advertising', 'expense', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', '6200', 'Depreciation Expense', 'expense', true);
```

---

## 3. CLINICIANS SETUP

### Navigate to: `/hms/doctors`

The page now supports ALL clinical staff types:

#### Available Roles:
1. 👨‍⚕️ **Doctor / Physician**
2. 👩‍⚕️ **Nurse**
3. 🩺 **Nurse Practitioner**
4. 💉 **Clinical Nurse Specialist**
5. 🧑‍⚕️ **Physician Assistant**
6. 🧘 **Physiotherapist**
7. 🧠 **Psychologist / Therapist**
8. 🦷 **Dentist**
9. 👓 **Optometrist**
10. 💊 **Pharmacist**
11. 🔬 **Lab Technician**
12. 📸 **Radiographer**
13. 🩻 **Anesthesiologist**
14. 🏥 **Surgeon**
15. 👶 **Midwife**
16. 🧑‍🔬 **Medical Assistant**

### Action Items:
1. ✅ Click "Add Staff Member"
2. ✅ Select Role (Doctor, Nurse, etc.)
3. ✅ Select Specialization (if applicable)
4. ✅ Fill License Number
5. ✅ Add Qualification & Experience

---

## 4. PRODUCTION CHECKLIST

### A. Database
- [ ] Run menu update SQL
- [ ] Run chart of accounts SQL (update tenant_id and company_id)
- [ ] Verify all HMS tables exist
- [ ] Set up database backups

### B. Application
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Authentication working
- [ ] Multi-tenancy working

### C. HMS Module
- [ ] Add clinicians (doctors, nurses, etc.)
- [ ] Add specializations
- [ ] Add patient records
- [ ] Configure billing accounts
- [ ] Test appointment booking
- [ ] Test prescription workflow
- [ ] Test billing & payments

### D. Financial Setup
- [ ] Chart of accounts configured
- [ ] Journal entries enabled
- [ ] Invoice numbering configured
- [ ] Tax settings configured
- [ ] Payment methods configured

### E. Security
- [ ] Role-based access control tested
- [ ] Tenant isolation verified
- [ ] Data encryption enabled
- [ ] Audit logs enabled
- [ ] Backup strategy in place

---

## 5. QUICK START WORKFLOW

### Step 1: Update Menu (ONE TIME)
```bash
# Connect to database and run:
psql $DATABASE_URL < .agent/update_menu_clinicians.sql
```

### Step 2: Create Chart of Accounts (ONE TIME)
```bash
# Update the SQL with your tenant_id and company_id
# Then run the chart of accounts SQL above
```

### Step 3: Add Clinical Staff
1. Go to `/hms/doctors`
2. Click "Add Staff Member"
3. Add all your medical team

### Step 4: Start Using
1. Book appointments
2. Create prescriptions
3. Generate bills
4. Process payments

---

## 6. SCHEMA VERIFICATION

Run this query to verify your setup:

```sql
-- Check clinicians
SELECT COUNT(*) as total_staff, 
       COUNT(CASE WHEN is_active = true THEN 1 END) as active_staff
FROM hms_clinicians;

-- Check roles
SELECT COUNT(*) FROM hms_roles;

-- Check chart of accounts
SELECT account_type, COUNT(*) 
FROM chart_of_accounts 
GROUP BY account_type;

-- Check menu
SELECT key, label, url FROM menu_items WHERE url LIKE '%/hms/%';
```

---

## 7. SUPPORT CONTACTS

For production issues:
- **Database Issues**: Check Render logs
- **Application Issues**: Check Next.js error logs
- **Billing Issues**: Verify chart of accounts setup

---

## LAST UPDATED
- Date: 2025-12-20
- Version: 1.0
- Status: PRODUCTION READY ✅
