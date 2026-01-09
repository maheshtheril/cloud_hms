---
description: Comprehensive guide on how to manage permissions for Pages, Forms, and Actions.
---

# Managing Permissions in the ERP

This guide explains how to secure Pages (View access) and Forms/Actions (Write access) using the Permission System.

## 1. Define the Permission
You can define permissions in two ways:
*   **Via Code (Recommended for Core Features):** Add to `src/app/actions/rbac.ts`.
*   **Via UI (For Dynamic Features):** Go to `Settings -> Permissions` and click "Create Permission".

Example Code:
```typescript
// defined in rbac.ts or via UI
code: 'hms:patients:create'
name: 'Create New Patient'
module: 'HMS'
```

## 2. Protect a Page (View Access)
To prevent a user from even SEEING a page:

**File:** `src/app/hms/patients/create/page.tsx`
```typescript
import { checkPermission } from '@/app/actions/rbac';
import { redirect } from 'next/navigation';

export default async function CreatePatientPage() {
    // Check permission at the very top
    if (!await checkPermission('hms:patients:create')) {
        redirect('/access-denied');
    }

    return <Form />;
}
```

## 3. Protect a Form/Button (Write Access)
To prevent the content from being submitted (Server Action Security):

**File:** `src/app/actions/patients.ts`
```typescript
'use server'
import { checkPermission } from '@/app/actions/rbac';

export async function createPatientAction(data: FormData) {
    // 1. Security Check
    const allowed = await checkPermission('hms:patients:create');
    if (!allowed) {
        return { error: "Permission Denied: You cannot create patients." };
    }

    // 2. Business Logic
    await prisma.patient.create({ ... });
    return { success: true };
}
```

## 4. Hide Sidebar Links
To hide the link in the sidebar menu:

**File:** `src/lib/menu-seeder.ts`
```typescript
{ 
  key: 'hms-patient-create', 
  label: 'New Patient', 
  url: '/hms/patients/create', 
  permission: 'hms:patients:create' // <--- Add this!
}
```
*Note: After changing `menu-seeder.ts`, an Admin must login to apply changes.*

## 5. Assign to Role
Finally, give the permission to the users:
1.  Go to `Settings -> Roles`.
2.  Edit the Role (e.g. "Receptionist").
3.  Search for "Create New Patient".
4.  Check and Save.
