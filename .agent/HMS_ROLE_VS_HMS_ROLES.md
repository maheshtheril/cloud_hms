# HMS ROLES vs HMS_ROLE - EXPLAINED

## The Two Tables Serve DIFFERENT Purposes ✅

### 1. `hms_role` - **USER/PERMISSION ROLES**

**Purpose:** Application access control and permissions

**Used For:**
- User authentication and authorization
- Permission management
- Signup/login system
- Role-based access control (RBAC)

**Schema:**
```sql
model hms_role {
  id                   String  @id
  tenant_id            String
  name                 String  -- "Admin", "Doctor User", "Nurse User", "Receptionist"
  description          String?
  hms_role_permissions hms_role_permissions[]  -- What they can DO in the app
  hms_user_roles       hms_user_roles[]        -- Which users have this role
}
```

**Examples:**
- Admin
- Doctor User (can access patient records)
- Nurse User (can view schedules)
- Receptionist (can book appointments)
- Billing User (can create invoices)

---

### 2. `hms_roles` - **CLINICAL JOB POSITIONS**

**Purpose:** Medical staff job titles and positions

**Used For:**
- Defining what TYPE of medical professional
- Staff directory
- Organizational structure
- Clinical workforce management

**Schema:**
```sql
model hms_roles {
  id             String  @id
  tenant_id      String
  company_id     String?
  name           String  -- "Physician", "Nurse", "Lab Tech"
  code           String? -- "MD", "RN", "MLT"
  description    String?
  is_clinical    Boolean -- TRUE for clinical roles
  is_active      Boolean
  hms_clinicians hms_clinicians[]  -- Staff with this position
}
```

**Examples:**
- Physician (MD)
- Registered Nurse (RN)
- Lab Technician (MLT)
- Pharmacist (RPH)
- Radiographer (RAD-TECH)

---

## How They Work Together

### Example: Dr. Sarah Johnson

**Clinical Position** (`hms_roles`):
- Role: "Physician" (what she IS professionally)
- Specialization: "Cardiology"
- Department: "Cardiology Department"

**System Permissions** (`hms_role`):
- Role: "Doctor User"
- Can: View all patients, create prescriptions, access labs

---

## Migration Decision: ✅ KEEP BOTH TABLES

**Why?**
1. **Different purposes** - one for app permissions, one for job positions
2. **Already in use** - `hms_role` used in signup/auth
3. **Different relations** - `hms_roles` → `hms_clinicians`, `hms_role` → `hms_user_roles`
4. **Standard practice** - Separating RBAC from organizational structure

---

## What to Seed

### ✅ Seed `hms_roles` (Clinical Positions)
Use: `.agent/seed_roles.sql`

This populates job titles for medical staff.

### ✅ Keep `hms_role` (Already Seeded)
Your existing `hms_role` table already has permission roles from signup.

---

## Database Structure

```
app_user
  ↓
hms_user_roles  →  hms_role  (Permission: "Can I edit patients?")
  
hms_clinicians  →  hms_roles (Position: "I'm a Nurse")
  ↓                   ↓
  ↓              hms_specializations (Specialty: "Cardiology")
  ↓
hms_departments (Location: "Emergency Dept")
```

---

## Action Required: NONE

Your current implementation is **CORRECT**! 

- ✅ We're using `hms_roles` for clinicians (line 1015 in schema)
- ✅ `hms_role` is separate for  permissions
- ✅ Seed file uses `hms_roles` (clinical positions)
- ✅ No conflicts

---

## Summary

| Table | Purpose | Used By | Examples |
|-------|---------|---------|----------|
| `hms_role` | App permissions | Auth system | "Admin", "Doctor User", "Receptionist" |
| `hms_roles` | Job positions | Clinical staff | "Physician", "Nurse", "Pharmacist" |

**Both are needed and serve different purposes.** ✅

---

**Status:** ✅ NO CHANGES NEEDED
**Last Updated:** 2025-12-20
