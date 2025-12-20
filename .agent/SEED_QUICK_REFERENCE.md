# QUICK REFERENCE: Seed HMS Data

## How to Use

### Step 1: Get Your IDs

Run this query to get your tenant_id and company_id:

```sql
SELECT id as tenant_id FROM tenant WHERE name = 'YOUR_HOSPITAL_NAME';
SELECT id as company_id, name FROM company WHERE tenant_id = 'YOUR_TENANT_ID';
```

### Step 2: Update SQL Files

Replace in BOTH files:
- `YOUR_TENANT_ID` → your actual tenant UUID
- `YOUR_COMPANY_ID` → your actual company UUID

### Step 3: Run the Seeds

```bash
# On Render or your PostgreSQL server
psql $DATABASE_URL -f .agent/seed_specializations.sql
psql $DATABASE_URL -f .agent/seed_roles.sql
```

---

## What You Get

### 📋 Specializations (70+)
Organized by category:
- **Primary Care**: General Practice, Internal Medicine, Family Medicine
- **Surgical**: General Surgery, Orthopedic Surgery, Neurosurgery
- **Cardiac**: Cardiology, Cardiothoracic Surgery
- **Cancer**: Medical Oncology, Radiation Oncology
- **Diagnostic**: Radiology, Pathology
- **Emergency**: Emergency Medicine, Critical Care
- **ENT**: Ophthalmology, Otolaryngology
- **And 10+ more categories!**

### 👥 Roles (60+)
Organized by category:
- **Physicians**: Physician, Surgeon, Consultant, Resident
- **Nursing**: RN, NP, CNS, ICU Nurse, ER Nurse
- **Therapy**: Physiotherapist, Occupational Therapist
- **Pharmacy**: Pharmacist, Pharmacy Technician
- **Lab**: Lab Technologist, Pathologist
- **Imaging**: Radiologist, MRI Technician
- **Dental**: Dentist, Orthodontist
- **And 10+ more categories!**

---

## Quick Seed (Testing)

If you just want to test with a few items:

```sql
-- Quick test: 10 specializations
INSERT INTO hms_specializations (tenant_id, company_id, name, is_active) VALUES
('YOUR_TENANT', 'YOUR_COMPANY', 'General Practice', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Cardiology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Neurology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pediatrics', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Orthopedics', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Emergency Medicine', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Radiology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pathology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Anesthesiology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Dermatology', true);

-- Quick test: 10 roles
INSERT INTO hms_roles (tenant_id, company_id, name, code, is_clinical, is_active) VALUES
('YOUR_TENANT', 'YOUR_COMPANY', 'Physician', 'MD', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Surgeon', 'SURG', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Registered Nurse', 'RN', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Nurse Practitioner', 'NP', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pharmacist', 'RPH', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Lab Technician', 'MLT', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Radiographer', 'RAD-TECH', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Physiotherapist', 'PT', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Dentist', 'DDS', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Psychologist', 'PSYCH', true, true);
```

---

## Verification

After seeding, verify:

```sql
-- Check specializations
SELECT COUNT(*) FROM hms_specializations WHERE tenant_id = 'YOUR_TENANT';

-- Check roles  
SELECT COUNT(*) FROM hms_roles WHERE tenant_id = 'YOUR_TENANT' AND is_clinical = true;

-- View all specializations
SELECT name, description FROM hms_specializations 
WHERE tenant_id = 'YOUR_TENANT' 
ORDER BY name;

-- View all roles
SELECT name, code, description FROM hms_roles 
WHERE tenant_id = 'YOUR_TENANT' AND is_clinical = true 
ORDER BY name;
```

---

## Files

- **`.agent/seed_specializations.sql`** - 70+ medical specializations
- **`.agent/seed_roles.sql`** - 60+ clinical roles
- **`.agent/DEPARTMENTS_ROLES_SPECIALIZATIONS.md`** - Full documentation

---

## After Seeding

1. Go to `/hms/doctors`
2. Click "Add Staff Member"
3. Dropdowns will now show all the data!

---

**Status:** ✅ READY TO SEED
