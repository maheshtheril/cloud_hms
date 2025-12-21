
---
description: How to Add New Permissions and Roles for a New Feature/Form
---

# Workflow: Adding RBAC for a New Feature (e.g., Leads)

If you have created a new Form or Page (like "Leads") and want to secure it with Permissions and Roles, follow these steps.

## Step 1: Define Permissions in Code
In this system, Permission Definitions are **Hardcoded** in `src/app/actions/rbac.ts`. You cannot create them via UI; they must exist in the code first.

1.  Open `src/app/actions/rbac.ts`.
2.  Locate `getAllPermissions()` function.
3.  Add your new permissions to the `permissions` array:
    ```typescript
    { code: 'leads:view', name: 'View Leads', module: 'CRM' },
    { code: 'leads:create', name: 'Create Leads', module: 'CRM' },
    { code: 'leads:edit', name: 'Edit Leads', module: 'CRM' },
    { code: 'leads:delete', name: 'Delete Leads', module: 'CRM' },
    ```
4.  Save the file.

## Step 2: Create/Update a Role in UI
Now that the permissions exist, they will appear in the Role Editor.

1.  Navigate to **Settings -> Roles**.
2.  Click **Create Role** (to make a new one) or **Edit** (pencil icon) on an existing role.
3.  Enter Role Name (e.g., "Leads Manager").
4.  In the Permissions Grid, you will see your new module (e.g., "CRM").
5.  **Select** the checkboxes for your new permissions (`leads:view`, etc.).
6.  Click **Create Role** or **Save Changes**.

## Step 3: Assign Role to User
1.  Navigate to **User Management** (or Settings -> Users).
2.  Find the user you want to assign functionality to.
3.  Click **Edit** or **Manage Roles**.
4.  Select the **"Leads Manager"** role.
5.  Save.

## Step 4: Enforce in Frontend Code
To actually protect your new page, use the permission check helper in your Page Component.


## Best Practices: Mapping Pages to Permissions

When you create a new page (e.g., `src/app/crm/reports/leads/page.tsx`), you need to decide on a **Permission Code**.

1.  **Naming Convention:** Use `module:feature:action`.
    *   Example: `crm:leads_report:view`
2.  **Granularity:**
    *   If the page is simple, just one permission: `crm:leads_report:view`
    *   If the page has actions (Export, Print), add more: `crm:leads_report:export`

### Example
If you create a **"Leads Report"** page:

1.  **Code Registration:** Add `{ code: 'crm:leads_report:view', name: 'View Leads Report', module: 'CRM' }` to `rbac.ts`.
2.  **UI Assignment:** Go to Roles UI, you will see "View Leads Report". Check it for the Manager role.
3.  **Page Protection:**
    ```tsx
    // src/app/crm/reports/leads/page.tsx
    if (!await checkPermission('crm:leads_report:view')) return <AccessDenied />;
    ```
