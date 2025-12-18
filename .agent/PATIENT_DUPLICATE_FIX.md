# Fix: Duplicate Patients Showing After Tenant Signup

## Problem
When creating a new tenant using signup, two patients were appearing in the patients list even though no patients were created during signup.

## Root Causes

### 1. Seed Data in Database
The `schema.sql` file contains hardcoded patient records (lines 11620-11621):
- **Patient 1**: ID `9c23da47-b7c4-48cf-99e1-f00aeb81fd4d` - "Patient1 ppp"
- **Patient 2**: ID `959f2ae6-c68f-4501-84e3-5f4d944fcf9f` - "mah esh"

Both patients are associated with tenant ID: `b69b3952-f737-4295-80de-f1dd3c275020`

### 2. Missing Tenant Filtering
The patients listing page (`src/app/hms/patients/page.tsx`) was fetching ALL patients from the database without filtering by the current user's tenant_id, causing cross-tenant data leakage.

## Solutions Implemented

### 1. Added Tenant Filtering to Patients List (CRITICAL)
**File**: `src/app/hms/patients/page.tsx`

**Changes**:
- Added `import { auth } from "@/auth"` to get the current session
- Retrieve `tenantId` from the authenticated session
- Filter patient queries by `tenant_id: tenantId`
- Added error handling for missing tenant

**Impact**: Now only patients belonging to the current user's tenant will be displayed, ensuring proper multi-tenancy isolation.

### 2. Updated Patient Creation Logic
**File**: `src/app/actions/patient.ts`

**Changes**:
- Replaced `prisma.tenant.findFirst()` with session-based tenant retrieval
- Use `session?.user?.tenantId` and `session?.user?.companyId` from authenticated user
- Added `created_by` and `updated_by` fields with userId from session

**Impact**: Patients are now created under the correct tenant and company from the logged-in user's session.

### 3. SQL Script to Remove Seed Data
**File**: `remove_seed_patients.sql`

**Purpose**: Provides SQL commands to delete the hardcoded seed patients from the database.

**Usage**:
```bash
# Run against your database
psql -h <host> -U <user> -d <database> -f remove_seed_patients.sql
```

## Testing Steps

1. **Remove seed data** (run the SQL script):
   ```sql
   DELETE FROM public.hms_patient 
   WHERE id IN (
       '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
       '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
   );
   ```

2. **Create a new tenant** via signup

3. **Navigate to patients list** - should show "No patients found" message

4. **Create a new patient** - should only show that patient

5. **Create another tenant** (different user) - patients list should be empty for that tenant

## Important Notes

- **Security Fix**: This fix prevents cross-tenant data leakage, which is a critical security issue in SaaS applications
- **Data Isolation**: Each tenant now has proper data isolation
- **Session Required**: Users must be logged in to view or create patients

## Future Improvements

Consider implementing:
1. Database-level Row-Level Security (RLS) policies for additional protection
2. Automated tests for tenant isolation
3. Remove seed data from schema.sql to prevent this issue in fresh deployments
