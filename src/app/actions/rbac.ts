'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

/**
 * Seed default roles for the tenant
 * This creates standard RBAC roles with predefined permissions
 */
export async function seedRolesAndPermissions() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized: No active session" };
    }

    if (!session.user.tenantId) {
        return { error: "Unauthorized: No tenant ID found in session" };
    }

    try {
        const tenantId = session.user.tenantId;

        // Define standard roles with permissions
        const rolesData = [
            {
                key: 'super_admin',
                name: 'Super Administrator',
                permissions: ['*'] // All permissions
            },
            {
                key: 'admin',
                name: 'Administrator',
                permissions: [
                    'users:view', 'users:create', 'users:edit', 'users:delete',
                    'roles:view', 'roles:manage',
                    'settings:view', 'settings:edit',
                    'hms:admin', 'crm:admin', 'inventory:admin'
                ]
            },
            {
                key: 'hms_admin',
                name: 'HMS Administrator',
                permissions: [
                    'hms:view', 'hms:create', 'hms:edit', 'hms:delete',
                    'patients:view', 'patients:create', 'patients:edit',
                    'appointments:view', 'appointments:create', 'appointments:edit',
                    'billing:view', 'billing:create',
                    'pharmacy:view'
                ]
            },
            {
                key: 'doctor',
                name: 'Doctor',
                permissions: [
                    'patients:view', 'patients:edit',
                    'appointments:view', 'appointments:create',
                    'prescriptions:view', 'prescriptions:create', 'prescriptions:edit',
                    'hms:view'
                ]
            },
            {
                key: 'nurse',
                name: 'Nurse',
                permissions: [
                    'patients:view',
                    'appointments:view',
                    'vitals:view', 'vitals:create', 'vitals:edit',
                    'hms:view'
                ]
            },
            {
                key: 'pharmacist',
                name: 'Pharmacist',
                permissions: [
                    'pharmacy:view', 'pharmacy:create', 'pharmacy:edit',
                    'inventory:view', 'inventory:view',
                    'prescriptions:view',
                    'hms:view'
                ]
            },
            {
                key: 'receptionist',
                name: 'Receptionist',
                permissions: [
                    'patients:view', 'patients:create', 'patients:edit',
                    'appointments:view', 'appointments:create', 'appointments:edit',
                    'billing:view', 'billing:create',
                    'hms:view'
                ]
            },
            {
                key: 'crm_supervisor',
                name: 'CRM Supervisor',
                permissions: ['crm:admin', 'crm:view_all', 'crm:reports', 'leads:view', 'leads:edit', 'deals:view', 'deals:edit']
            },
            {
                key: 'crm_manager',
                name: 'CRM Manager',
                permissions: ['crm:view_team', 'crm:manage_deals', 'crm:assign_leads', 'leads:view', 'leads:edit', 'deals:view', 'deals:edit']
            },
            {
                key: 'sales_executive',
                name: 'Sales Executive',
                permissions: ['crm:view_own', 'crm:create_leads', 'crm:manage_own_deals', 'leads:view', 'leads:create', 'deals:view', 'deals:create']
            },
            {
                key: 'inventory_manager',
                name: 'Inventory Manager',
                permissions: [
                    'inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete',
                    'purchasing:view', 'purchasing:create', 'purchasing:edit',
                    'suppliers:view', 'suppliers:create', 'suppliers:edit'
                ]
            },
            {
                key: 'readonly',
                name: 'Read Only User',
                permissions: ['*.view'] // View-only access to all modules  
            }
        ];

        const results = [];

        for (const roleData of rolesData) {
            // Check if role exists
            const existing = await prisma.role.findFirst({
                where: {
                    tenant_id: tenantId,
                    key: roleData.key
                }
            });

            if (!existing) {
                // Create role
                const newRole = await prisma.role.create({
                    data: {
                        tenant_id: tenantId,
                        key: roleData.key,
                        name: roleData.name,
                        permissions: roleData.permissions
                    }
                });
                results.push({ action: 'created', role: newRole.name, key: newRole.key });
            } else {
                // Update permissions if role exists
                await prisma.role.update({
                    where: { id: existing.id },
                    data: { permissions: roleData.permissions }
                });
                results.push({ action: 'updated', role: existing.name, key: existing.key });
            }
        }

        revalidatePath('/settings/roles');

        return {
            success: true,
            message: `Successfully processed ${results.length} roles`,
            results
        };

    } catch (error) {
        console.error("Failed to seed roles:", error);
        return {
            error: `Failed to seed roles: ${(error as Error).message}`
        };
    }
}

/**
 * Create a new role
 */
export async function createRole(data: { key: string; name: string; permissions: string[] }) {
    const session = await auth();

    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const tenantId = session.user.tenantId;

        // Check if role key already exists for this tenant
        const existing = await prisma.role.findFirst({
            where: {
                tenant_id: tenantId,
                key: data.key
            }
        });

        if (existing) {
            return { error: "A role with this key already exists" };
        }

        const role = await prisma.role.create({
            data: {
                tenant_id: tenantId,
                key: data.key,
                name: data.name,
                permissions: data.permissions
            }
        });

        revalidatePath('/settings/roles');

        return { success: true, data: role };
    } catch (error) {
        console.error("Failed to create role:", error);
        return { error: `Failed to create role: ${(error as Error).message}` };
    }
}

/**
 * Update an existing role
 */
export async function updateRole(roleId: string, data: { name: string; permissions: string[] }) {
    const session = await auth();

    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const tenantId = session.user.tenantId;

        // Verify the role belongs to this tenant
        const existing = await prisma.role.findFirst({
            where: {
                id: roleId,
                tenant_id: tenantId
            }
        });

        if (!existing) {
            return { error: "Role not found or access denied" };
        }

        const role = await prisma.role.update({
            where: { id: roleId },
            data: {
                name: data.name,
                permissions: data.permissions
            }
        });

        revalidatePath('/settings/roles');

        return { success: true, data: role };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { error: `Failed to update role: ${(error as Error).message}` };
    }
}

/**
 * Delete a role
 */
export async function deleteRole(roleId: string) {
    const session = await auth();

    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const tenantId = session.user.tenantId;

        // Verify the role belongs to this tenant
        const existing = await prisma.role.findFirst({
            where: {
                id: roleId,
                tenant_id: tenantId
            }
        });

        if (!existing) {
            return { error: "Role not found or access denied" };
        }

        // Check if any users are assigned this role
        const usersWithRole = await prisma.user_role.count({
            where: { role_id: roleId }
        });

        if (usersWithRole > 0) {
            return { error: `Cannot delete role. ${usersWithRole} user(s) are assigned this role.` };
        }

        await prisma.role.delete({
            where: { id: roleId }
        });

        revalidatePath('/settings/roles');

        return { success: true, message: "Role deleted successfully" };
    } catch (error) {
        console.error("Failed to delete role:", error);
        return { error: `Failed to delete role: ${(error as Error).message}` };
    }
}

/**
 * Get all permissions defined in the system
 */
export async function getAllPermissions() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Define all available permissions in the system
        const permissions = [
            // User Management
            { code: 'users:view', name: 'View Users', module: 'User Management' },
            { code: 'users:create', name: 'Create Users', module: 'User Management' },
            { code: 'users:edit', name: 'Edit Users', module: 'User Management' },
            { code: 'users:delete', name: 'Delete Users', module: 'User Management' },

            // Role Management
            { code: 'roles:view', name: 'View Roles', module: 'Role Management' },
            { code: 'roles:manage', name: 'Manage Roles', module: 'Role Management' },

            // Settings
            { code: 'settings:view', name: 'View Settings', module: 'Settings' },
            { code: 'settings:edit', name: 'Edit Settings', module: 'Settings' },

            // HMS
            { code: 'hms:view', name: 'View HMS', module: 'HMS' },
            { code: 'hms:admin', name: 'HMS Administrator', module: 'HMS' },
            { code: 'hms:create', name: 'Create HMS Records', module: 'HMS' },
            { code: 'hms:edit', name: 'Edit HMS Records', module: 'HMS' },
            { code: 'hms:delete', name: 'Delete HMS Records', module: 'HMS' },
            { code: 'patients:view', name: 'View Patients', module: 'HMS' },
            { code: 'patients:create', name: 'Create Patients', module: 'HMS' },
            { code: 'patients:edit', name: 'Edit Patients', module: 'HMS' },
            { code: 'appointments:view', name: 'View Appointments', module: 'HMS' },
            { code: 'appointments:create', name: 'Create Appointments', module: 'HMS' },
            { code: 'appointments:edit', name: 'Edit Appointments', module: 'HMS' },
            { code: 'prescriptions:view', name: 'View Prescriptions', module: 'HMS' },
            { code: 'prescriptions:create', name: 'Create Prescriptions', module: 'HMS' },
            { code: 'prescriptions:edit', name: 'Edit Prescriptions', module: 'HMS' },
            { code: 'vitals:view', name: 'View Vitals', module: 'HMS' },
            { code: 'vitals:create', name: 'Create Vitals', module: 'HMS' },
            { code: 'vitals:edit', name: 'Edit Vitals', module: 'HMS' },
            { code: 'billing:view', name: 'View Billing', module: 'HMS' },
            { code: 'billing:create', name: 'Create Bills', module: 'HMS' },

            // Pharmacy
            { code: 'pharmacy:view', name: 'View Pharmacy', module: 'Pharmacy' },
            { code: 'pharmacy:create', name: 'Create Pharmacy Records', module: 'Pharmacy' },
            { code: 'pharmacy:edit', name: 'Edit Pharmacy Records', module: 'Pharmacy' },

            // CRM
            { code: 'crm:view', name: 'View CRM', module: 'CRM' },
            { code: 'crm:admin', name: 'CRM Administrator', module: 'CRM' },
            { code: 'crm:view_all', name: 'View All CRM Records', module: 'CRM' },
            { code: 'crm:view_team', name: 'View Team CRM Records', module: 'CRM' },
            { code: 'crm:view_own', name: 'View Own CRM Records', module: 'CRM' },
            { code: 'crm:reports', name: 'View CRM Reports', module: 'CRM' },
            { code: 'crm:create_leads', name: 'Create Leads', module: 'CRM' },
            { code: 'crm:manage_deals', name: 'Manage Deals', module: 'CRM' },
            { code: 'crm:assign_leads', name: 'Assign Leads', module: 'CRM' },
            { code: 'crm:manage_own_deals', name: 'Manage Own Deals', module: 'CRM' },
            { code: 'leads:view', name: 'View Leads', module: 'CRM' },
            { code: 'leads:create', name: 'Create Leads', module: 'CRM' },
            { code: 'leads:edit', name: 'Edit Leads', module: 'CRM' },
            { code: 'deals:view', name: 'View Deals', module: 'CRM' },
            { code: 'deals:create', name: 'Create Deals', module: 'CRM' },
            { code: 'deals:edit', name: 'Edit Deals', module: 'CRM' },

            // Inventory
            { code: 'inventory:view', name: 'View Inventory', module: 'Inventory' },
            { code: 'inventory:create', name: 'Create Inventory', module: 'Inventory' },
            { code: 'inventory:edit', name: 'Edit Inventory', module: 'Inventory' },
            { code: 'inventory:delete', name: 'Delete Inventory', module: 'Inventory' },
            { code: 'inventory:admin', name: 'Inventory Administrator', module: 'Inventory' },

            // Purchasing
            { code: 'purchasing:view', name: 'View Purchase Orders', module: 'Purchasing' },
            { code: 'purchasing:create', name: 'Create Purchase Orders', module: 'Purchasing' },
            { code: 'purchasing:edit', name: 'Edit Purchase Orders', module: 'Purchasing' },
            { code: 'suppliers:view', name: 'View Suppliers', module: 'Purchasing' },
            { code: 'suppliers:create', name: 'Create Suppliers', module: 'Purchasing' },
            { code: 'suppliers:edit', name: 'Edit Suppliers', module: 'Purchasing' }
        ];

        return { success: true, data: permissions };
    } catch (error) {
        console.error("Failed to fetch permissions:", error);
        return { error: "Failed to fetch permissions" };
    }
}
