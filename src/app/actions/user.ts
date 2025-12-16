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
    return await prisma.hms_roles.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
    })
}

export async function updateUserHMSRoles(userId: string, roleIds: string[]) {
    // Transaction to safely update roles
    await prisma.$transaction(async (tx) => {
        // 1. Remove existing roles
        await tx.hms_user_roles.deleteMany({
            where: { user_id: userId }
        })

        // 2. Add new roles
        if (roleIds.length > 0) {
            await tx.hms_user_roles.createMany({
                data: roleIds.map(roleId => ({
                    user_id: userId,
                    role_id: roleId
                }))
            })
        }
    })

    revalidatePath(`/settings/users/${userId}`)
}
