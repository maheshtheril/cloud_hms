'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getDepartments() {
    const session = await auth()
    const tid = session?.user?.tenantId
    if (!tid) return []

    // Fetch all departments for the tenant
    const departments = await prisma.hms_departments.findMany({
        where: {
            tenant_id: tid,
            deleted_at: null
        },
        orderBy: { name: 'asc' }
    })

    return departments
}

export async function upsertDepartment(data: {
    id?: string,
    name: string,
    code?: string,
    description?: string,
    parent_id?: string | null,
    is_active?: boolean
}) {
    const session = await auth()
    const tid = session?.user?.tenantId
    const cid = (session?.user as any)?.companyId || (await prisma.company.findFirst({ where: { tenant_id: tid } }))?.id;

    if (!tid || !cid) return { error: "Unauthorized or Company not found" }

    try {
        if (data.id) {
            await prisma.hms_departments.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    parent_id: data.parent_id || null,
                    is_active: data.is_active ?? true,
                    updated_at: new Date(),
                    updated_by: session.user.id
                }
            })
        } else {
            await prisma.hms_departments.create({
                data: {
                    tenant_id: tid,
                    company_id: cid,
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    parent_id: data.parent_id || null,
                    is_active: true,
                    created_by: session.user.id
                }
            })
        }
        revalidatePath('/crm/departments')
        revalidatePath('/crm/org-chart')
        return { success: true }
    } catch (e: any) {
        console.error(e)
        return { error: e.message || "Failed to save department" }
    }
}

export async function deleteDepartment(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Check if it has children
        const children = await prisma.hms_departments.count({
            where: { parent_id: id, deleted_at: null }
        })

        if (children > 0) {
            return { error: "Cannot delete department with sub-departments. Move or delete them first." }
        }

        await prisma.hms_departments.update({
            where: { id },
            data: { deleted_at: new Date() }
        })

        revalidatePath('/crm/departments')
        revalidatePath('/crm/org-chart')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete department" }
    }
}
