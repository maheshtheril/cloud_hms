---
description: Comprehensive guide on how to manage viewing permissions for any page in the ERP
---

# Managing Page Access Permissions

To control access to specific pages (e.g., restricting "Lab Results" to Doctors), follow this end-to-end process.

## 1. Register the Permission
First, the system needs to know the Permission exists.

1.  Open `src/app/actions/rbac.ts`.
2.  Find the `getAllPermissions` function.
3.  Add your new permission to the `standardPermissions` list:
    ```typescript
    { code: 'hms:lab_results:view', name: 'View Lab Results', module: 'HMS' },
    ```
4.  Save the file.

## 2. Protect the Page (Code)
Now, enforce this permission in the Page Component itself. This prevents direct access via URL.

1.  Open the page file (e.g., `src/app/hms/lab/results/page.tsx`).
2.  Add the check at the top:
    ```typescript
    import { checkPermission } from '@/app/actions/rbac';
    import { redirect } from 'next/navigation';

    export default async function LabResultsPage() {
        // ... auth check ...
        
        // Security Check
        if (!await checkPermission('hms:lab_results:view')) {
            redirect('/access-denied'); // or return <AccessDenied />
        }

        // ... rest of page ...
    }
    ```

## 3. Protect the Sidebar (Menu)
To hide the link from the Sidebar for unauthorized users:

1.  Open `src/lib/menu-seeder.ts`.
2.  Find the menu item definition (e.g., within `ensureHmsMenus`).
3.  Add or Update the `permission` field:
    ```typescript
    { key: 'hms-lab-results', label: 'Lab Results', ..., permission: 'hms:lab_results:view' }
    ```
4.  **Restart the App** or Login as Admin to trigger the Seeder update to the Database.

## 4. Assign Permission to Role
Finally, grant this permission to the relevant users.

1.  Go to **Settings -> Roles**.
2.  Edit the Role (e.g., "Doctor").
3.  Search for "View Lab Results".
4.  Check the box and Save.

## Summary
*   **rbac.ts**: Defines the Permission.
*   **page.tsx**: Enforces it on the content.
*   **menu-seeder.ts**: Hides it from navigation.
*   **Settings UI**: Grants it to users.
