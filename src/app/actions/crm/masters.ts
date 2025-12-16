'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// --- COMPANIES ---

export async function getCompanies() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    return prisma.company.findMany({
        where: { tenant_id: session.user.tenantId, enabled: true },
        include: { countries: true },
        orderBy: { created_at: 'asc' }
    })
}

// --- PIPELINES ---

export async function getPipelines(includeStages = false) {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    const pipelines = await prisma.crm_pipelines.findMany({
        where: { tenant_id: session.user.tenantId, deleted_at: null },
        include: {
            stages: includeStages ? {
                orderBy: { sort_order: 'asc' },
                where: { deleted_at: null }
            } : false
        },
        orderBy: { created_at: 'asc' }
    })

    // Serialize Decimals for Client Components
    return pipelines.map(p => ({
        ...p,
        stages: p.stages?.map(s => ({
            ...s,
            probability: s.probability ? Number(s.probability) : 0
        })) || []
    }))
}

export async function upsertPipeline(data: { id?: string, name: string, is_default?: boolean }) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        if (data.id) {
            await prisma.crm_pipelines.update({
                where: { id: data.id, tenant_id: session.user.tenantId },
                data: { name: data.name, is_default: data.is_default }
            })
        } else {
            await prisma.crm_pipelines.create({
                data: {
                    tenant_id: session.user.tenantId,
                    name: data.name,
                    is_default: data.is_default
                }
            })
        }
        revalidatePath('/settings/crm')
        revalidatePath('/crm/leads/new')
        return { success: true }
    } catch (e) {
        return { error: "Failed to save pipeline" }
    }
}

export async function deletePipeline(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        await prisma.crm_pipelines.update({
            where: { id, tenant_id: session.user.tenantId },
            data: { deleted_at: new Date() }
        })
        revalidatePath('/settings/crm')
        revalidatePath('/crm/leads/new')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete" }
    }
}

// --- STAGES ---

export async function upsertStage(data: { id?: string, pipeline_id: string, name: string, type: string, probability?: number, sort_order: number }) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        if (data.id) {
            await prisma.crm_stages.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    type: data.type,
                    probability: data.probability,
                    sort_order: data.sort_order
                }
            })
        } else {
            await prisma.crm_stages.create({
                data: {
                    pipeline_id: data.pipeline_id,
                    name: data.name,
                    type: data.type,
                    probability: data.probability || 0,
                    sort_order: data.sort_order
                }
            })
        }
        revalidatePath('/settings/crm')
        revalidatePath('/crm/leads/new')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to save stage" }
    }
}

export async function deleteStage(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        await prisma.crm_stages.update({
            where: { id },
            data: { deleted_at: new Date() }
        })
        revalidatePath('/settings/crm')
        revalidatePath('/crm/leads/new')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete stage" }
    }
}

// --- SOURCES ---

export async function getSources() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    return prisma.crm_sources.findMany({
        where: { tenant_id: session.user.tenantId, deleted_at: null },
        orderBy: { name: 'asc' }
    })
}

export async function upsertSource(data: { id?: string, name: string }) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        if (data.id) {
            await prisma.crm_sources.update({
                where: { id: data.id, tenant_id: session.user.tenantId },
                data: { name: data.name }
            })
        } else {
            await prisma.crm_sources.create({
                data: {
                    tenant_id: session.user.tenantId,
                    name: data.name
                }
            })
        }
        revalidatePath('/settings/crm')
        revalidatePath('/crm/leads/new')
        return { success: true }
    } catch (e) {
        return { error: "Failed to save source" }
    }
}

export async function deleteSource(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        await prisma.crm_sources.update({
            where: { id, tenant_id: session.user.tenantId },
            data: { deleted_at: new Date() }
        })
        revalidatePath('/settings/crm')
        revalidatePath('/crm/leads/new')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete source" }
    }
}
