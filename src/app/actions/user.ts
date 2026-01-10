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
    return user
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

export async function getHMSRoles() {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) {
        return []
    }

    const roles = await prisma.hms_role.findMany({
        where: {
            tenant_id: session.user.tenantId
        },
        orderBy: { name: 'asc' }
    })

    if (roles.length === 0) {
        // Auto-seed default roles for better onboarding experience
        const defaultRoles = [
            { name: 'Doctor', description: 'Clinical Practitioner' },
            { name: 'Nurse', description: 'Nursing Staff' },
            { name: 'Receptionist', description: 'Front Desk & Appointments' },
            { name: 'Pharmacist', description: 'Pharmacy Management' },
            { name: 'Lab Technician', description: 'Laboratory Services' },
            { name: 'Accountant', description: 'Billing & Finance' },
        ]

        await prisma.hms_role.createMany({
            data: defaultRoles.map(r => ({
                tenant_id: session.user.tenantId!,
                name: r.name,
                description: r.description
            })),
            skipDuplicates: true
        })

        return await prisma.hms_role.findMany({
            where: { tenant_id: session.user.tenantId },
            orderBy: { name: 'asc' }
        })
    }

    return roles
}

export async function updateUserHMSRoles(userId: string, roleIds: string[]) {
    const session = await auth()
    if (!session?.user?.id || !session.user.tenantId) return

    // Transaction to safely update roles
    await prisma.$transaction(async (tx) => {
        // 1. HMS ROLES (UI/Display)
        // Remove existing HMS roles
        await tx.hms_user_roles.deleteMany({
            where: { user_id: userId }
        })

        // Add new HMS roles
        if (roleIds.length > 0) {
            await tx.hms_user_roles.createMany({
                data: roleIds.map(roleId => ({
                    user_id: userId,
                    role_id: roleId
                }))
            })
        }

        // 2. CORE RBAC ROLES (Permissions)
        // Sync HMS roles to Core RBAC roles to ensuring actual permissions are granted.

        // A. Clear current user_role assignments (for equality)
        await tx.user_role.deleteMany({
            where: { user_id: userId, tenant_id: session.user.tenantId }
        })

        if (roleIds.length > 0) {
            // Fetch names of selected HMS Roles
            const hmsRoles = await tx.hms_role.findMany({
                where: { id: { in: roleIds } }
            })

            for (const hmsRole of hmsRoles) {
                // Find matching Core Role (e.g. "Receptionist" -> "receptionist")
                // DYNAMIC MATCHING: Normalize name to key format (e.g. "Lab Technician" -> "labtechnician")
                const normalizedKey = hmsRole.name.toLowerCase().replace(/[^a-z0-9]/g, '');

                const coreRole = await tx.role.findFirst({
                    where: {
                        tenant_id: session.user.tenantId,
                        OR: [
                            { key: normalizedKey }, // Exact key match (e.g. 'receptionist')
                            { key: hmsRole.name.toLowerCase() }, // Direct name-as-key match
                            { name: { equals: hmsRole.name, mode: 'insensitive' } } // Role Name match
                        ]
                    }
                })

                if (coreRole) {
                    // Create Link
                    await tx.user_role.create({
                        data: {
                            user_id: userId,
                            role_id: coreRole.id,
                            tenant_id: session.user.tenantId!
                        }
                    })

                    // Legacy string fallback update (Dynamic)
                    if (['receptionist', 'admin'].includes(normalizedKey)) {
                        await tx.app_user.update({
                            where: { id: userId },
                            data: { role: normalizedKey }
                        })
                    }
                }
            }
        }
    })

    revalidatePath(`/settings/users/${userId}`)
}
