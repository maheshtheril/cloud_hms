# HMS DEPARTMENTS, ROLES, AND SPECIALIZATIONS EXPLAINED

## Updated: 2025-12-20

### The 3 Key Tables

Your HMS schema has **3 separate tables** for organizing clinical staff:

---

## 1. **`hms_departments`** - Organizational Units

**Purpose:** Physical/organizational divisions of the hospital

**Examples:**
- Emergency Department
- Cardiology Department  
- Pediatrics Department
- Radiology Department
- Laboratory Department
- Pharmacy Department
- Surgical Department
- Outpatient Department (OPD)

**Schema:**
```sql
model hms_departments {
  id          String   @id @default(uuid)
  tenant_id   String
  company_id  String
  name        String   -- "Cardiology Department"
  code        String?  -- "CARD-DEPT"
  description String?
  parent_id   String?  -- For sub-departments
  is_active   Boolean  @default(true)
}
```

**Use Case:** Assign staff to physical locations. "Dr. Smith works in the Cardiology Department"

---

## 2. **`hms_roles`** - Job Functions/Positions

**Purpose:** Job title or position type

**Examples:**
- Doctor / Physician
- Nurse
- Nurse Practitioner
- Clinical Nurse Specialist
- Physician Assistant
- Physiotherapist
- Psychologist
- Dentist
- Pharmacist
- Lab Technician
- Radiographer
- Anesthesiologist
- Surgeon
- Midwife
- Medical Assistant

**Schema:**
```sql
model hms_roles {
  id          String   @id @default(uuid)
  tenant_id   String
  company_id  String?
  name        String   -- "Doctor", "Nurse", etc.
  code        String?  -- "DOC", "RN", etc.
  description String?
  is_clinical Boolean  @default(false)  -- TRUE for clinical roles
  is_active   Boolean  @default(true)
}
```

**Use Case:** Define what type of healthcare worker. "Dr. Smith's role is Doctor"

---

## 3. **`hms_specializations`** - Medical Specialties

**Purpose:** Medical specialty or area of expertise

**Examples:**
- Cardiology
- Neurology
- Pediatrics
- Orthopedics
- General Practice
- Emergency Medicine
- Internal Medicine
- Oncology
- Radiology
- Anesthesiology
- Dermatology
- Psychiatry
- Obstetrics & Gynecology

**Schema:**
```sql
model hms_specializations {
  id          String   @id @default(uuid)
  tenant_id   String
  company_id  String?
  name        String   -- "Cardiology", "Neurology", etc.
  description String?
  is_active   Boolean  @default(true)
}
```

**Use Case:** Define medical expertise area. "Dr. Smith specializes in Cardiology"

---

## How They Work Together

### Example 1: Cardiologist
```
Name: Dr. Sarah Johnson
Department: Cardiology Department (physical location)
Role: Doctor (job function)
Specialization: Cardiology (medical expertise)
```

### Example 2: Cardiac Nurse
```
Name: Emily Davis, RN
Department: Cardiology Department (same location)
Role: Nurse (different job function)
Specialization: Cardiology (same expertise area)
```

### Example 3: Lab Technician
```
Name: Mike Chen  
Department: Laboratory Department (different location)
Role: Lab Technician (job function)
Specialization: NULL (may not have one)
```

---

## Current Implementation

### ✅ What's Implemented:

1. **All 3 tables exist** in your Prisma schema
2. **Form now uses real database data** - no more hardcoded dropdowns
3. **Dropdown cascades properly:**
   - Select Department → Select Role → Select Specialization (optional)
4. **Tenant-scoped** - each tenant sees only their data
5. **Active filtering** - only shows active departments/roles/specializations

### 📋 Form Fields (in order):

1. **Department** (Required) - Where do they work?
2. **Role** (Required) - What's their job?
3. **Specialization** (Optional) - What's their expertise?

---

## Setting Up Your Data

### Step 1: Create Departments

```sql
INSERT INTO hms_departments (tenant_id, company_id, name, code, is_active)
VALUES
('YOUR_TENANT', 'YOUR_COMPANY', 'Emergency Department', 'ED', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Cardiology Department', 'CARD', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pediatrics Department', 'PED', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Laboratory Department', 'LAB', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pharmacy Department', 'PHARM', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Radiology Department', 'RAD', true);
```

### Step 2: Create Roles

```sql
INSERT INTO hms_roles (tenant_id, company_id, name, code, is_clinical, is_active)
VALUES
('YOUR_TENANT', 'YOUR_COMPANY', 'Doctor', 'DOC', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Nurse', 'RN', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Nurse Practitioner', 'NP', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Physiotherapist', 'PT', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Lab Technician', 'LAB-TECH', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pharmacist', 'PHARM', true, true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Radiographer', 'RAD-TECH', true, true);
```

### Step 3: Create Specializations

```sql
INSERT INTO hms_specializations (tenant_id, company_id,name, is_active)
VALUES
('YOUR_TENANT', 'YOUR_COMPANY', 'Cardiology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Neurology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Pediatrics', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Orthopedics', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'General Practice', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Emergency Medicine', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Radiology', true),
('YOUR_TENANT', 'YOUR_COMPANY', 'Anesthesiology', true);
```

---

## Why This Approach?

### ✅ Benefits:

1. **Flexible** - Add new departments/roles/specializations anytime
2. **Scalable** - Works for small clinics to large hospitals
3. **Multi-tenant** - Each hospital has their own setup
4. **Realistic** - Mirrors real-world hospital structure
5. **Filterable** - Can filter staff by department, role, or specialty
6. **Reportable** - Easy to generate reports by any dimension

### 🎯 Use Cases:

- **Scheduling**: "Show all doctors in Emergency Department"
- **Reporting**: "How many nurses do we have?"
- **Billing**: "Charge rates by specialization"
- **Capacity Planning**: "We need more cardiologists"

---

## Next Steps

1. **Seed your database** with departments, roles, and specializations
2. **Add staff members** using the new form at `/hms/doctors`
3. **Verify data** - check that dropdowns show your entries
4. **Build reports** - use the 3 dimensions for analytics

---

## Questions Answered

**Q: Why not just use specializations for everything?**
A: Because a "Cardiology Nurse" and a "Cardiologist" both work in cardiology but have different roles.

**Q: Can someone have multiple specializations?**
A: Currently no, but you can extend the schema with a junction table if needed.

**Q: What if a lab tech doesn't have a specialization?**
A: That's fine! Specialization is optional.

**Q: Can departments have sub-departments?**
A: Yes! Use the `parent_id` field for hierarchical departments.

---

**Status:** ✅ PRODUCTION READY
**Last Updated:** 2025-12-20
