---
description: Explanation of how Modules are fetched and managed in the Permissions Page.
---

# Permissions Page Architecture

The Permissions Management Page (`/settings/permissions`) uses a **Dual-Sourcing Strategy** to determine the list of available modules.

## 1. Database Modules (Primary Source)
The system fetches the officially defined modules from the `modules` table in the database.
- **Source Code**: `src/app/actions/modules.ts`
- **Function**: `getActiveModules()`
- **Query**: `prisma.modules.findMany({ where: { is_active: true } })`
- **Normalization**: content is normalized (e.g. `hms` -> `HMS`) before display.

## 2. Usage-Based Discovery (Secondary Source)
The system also scans all existing permissions (both Standard and Custom) to find any categories that are currently in use, even if they aren't in the `modules` table.
- **Source Code**: `src/app/settings/permissions/page.tsx`
- **Logic**: `permissions.map(p => p.module)`

## 3. Core Defaults
A set of Core Modules (`HMS`, `CRM`, `Finance`, `Inventory`) is always ensured to exist to prevent empty states during initialization.

## Summary
The final list of "Module Categories" presented in the "Create Permission" dialog is a **Union** of:
`[Active Database Modules] + [Modules Used by Existing Permissions] + [Core Defaults]`

This ensures the system is fully **Data-Driven** and reflects the actual state of your ERP configuration.
