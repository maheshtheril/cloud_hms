'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"

export async function getUsers() {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) {
        return []
    }

    const users = await prisma.app_user.findMany({
        where: {
            tenant_id: session.user.tenantId
        },
        select: {
            id: true,
            email: true,
            name: true,
            full_name: true,
            role: true, // System Role (user/admin)
            is_active: true,
            hms_user_roles: {
                include: {
                    hms_role: true
                }
            }
        },
        orderBy: { created_at: 'desc' }
    })
    return users
}

// ... existing imports

export async function getUser(id: string) {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) {
        return null
    }

    const user = await prisma.app_user.findUnique({
        where: {
            id,
            tenant_id: session.user.tenantId
        },
        select: {
            id: true,
            email: true,
            name: true,
            full_name: true,
            role: true,
            is_active: true,
            hms_user_roles: {
                include: {
                    hms_role: true
                }
            }
        }
    })

    if (!user) return null;

    // Fetch Core Permissions manually since relation is missing in schema
    const coreUserRolesRaw = await prisma.user_role.findMany({
        where: { user_id: id, tenant_id: session.user.tenantId }
    })

    const roleIds = coreUserRolesRaw.map(ur => ur.role_id)
    const roles = await prisma.role.findMany({
        where: { id: { in: roleIds } }
    })

    const userRoles = coreUserRolesRaw.map(ur => ({
        ...ur,
        role: roles.find(r => r.id === ur.role_id) || null
    }))

    return {
        ...user,
        user_roles: userRoles
    }
}

// ... existing code ...

// Replaced logic to use CORE RBAC Roles
export async function getHMSRoles() {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) {
        return []
    }

    // Fetch from Core 'role' table
    const roles = await prisma.role.findMany({
        where: {
            tenant_id: session.user.tenantId
        },
        orderBy: { name: 'asc' }
    })

    return roles.map(r => ({
        id: r.id,
        name: r.name,
        description: r.name // Fallback: Description column does not exist on role table
    }))
}

export async function updateUserHMSRoles(userId: string, roleIds: string[]) {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) return

    // Transaction to safely update roles
    await prisma.$transaction(async (tx) => {
        // Update CORE RBAC Roles (Single Source of Truth)

        // 1. Remove existing roles
        await tx.user_role.deleteMany({
            where: { user_id: userId, tenant_id: session.user.tenantId }
        })

        // 2. Add new roles
        if (roleIds.length > 0) {
            await tx.user_role.createMany({
                data: roleIds.map(roleId => ({
                    user_id: userId,
                    role_id: roleId,
                    tenant_id: session.user.tenantId!
                }))
            })

            // 3. Update Legacy String Column (One-way sync for optimization)
            // If specific roles are present, set the legacy column for quick access
            // We verify the KEYS of the added roles
            const addedRoles = await tx.role.findMany({
                where: { id: { in: roleIds } }
            })

            const keys = new Set(addedRoles.map(r => r.key));
            let newLegacyRole = 'user'; // Default
            if (keys.has('admin') || keys.has('super_admin')) newLegacyRole = 'admin';
            else if (keys.has('receptionist')) newLegacyRole = 'receptionist';
            else if (keys.has('doctor')) newLegacyRole = 'doctor';
            else if (keys.has('nurse')) newLegacyRole = 'nurse';

            if (newLegacyRole !== 'user') {
                await tx.app_user.update({
                    where: { id: userId },
                    data: { role: newLegacyRole }
                })
            }
        }
    })

    revalidatePath(`/settings/users/${userId}`)
}
export async function updateUserSystemRole(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) return

    const userId = formData.get("user_id") as string
    const role = formData.get("role") as string

    // Verify user belongs to tenant
    const count = await prisma.app_user.count({
        where: { id: userId, tenant_id: session.user.tenantId }
    })

    if (count === 0) return

    await prisma.app_user.update({
        where: { id: userId },
        data: { role }
    })

    revalidatePath(`/settings/users/${userId}`)
    revalidatePath("/settings/users")
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) return

    // Verify user belongs to tenant
    const count = await prisma.app_user.count({
        where: { id: userId, tenant_id: session.user.tenantId }
    })

    if (count === 0) return

    await prisma.app_user.update({
        where: { id: userId },
        data: { is_active: !currentStatus }
    })
    revalidatePath("/settings/users")
}

