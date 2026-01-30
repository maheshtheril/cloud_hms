'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

const dealSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Deal title is required'),
    value: z.coerce.number().min(0),
    currency: z.string().default('USD'),

    pipeline_id: z.string().optional(),
    stage_id: z.string().optional(),

    account_id: z.string().optional(),
    contact_id: z.string().optional(),

    expected_close_date: z.string().optional(),
    probability: z.coerce.number().min(0).max(100),
    status: z.string().default('open'),
})
// ...
export async function updateDeal(prevState: DealFormState, formData: FormData): Promise<DealFormState> {
    const session = await auth()
    const user = session?.user

    if (!user || !user.tenantId) {
        return { message: 'Unauthorized' }
    }

    const validatedFields = dealSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Deal.',
        }
    }

    const {
        id, title, value, currency,
        pipeline_id, stage_id,
        account_id, contact_id,
        expected_close_date, probability, status
    } = validatedFields.data

    if (!id) return { message: 'Missing Deal ID' }

    try {
        await prisma.crm_deals.update({
            where: { id, tenant_id: user.tenantId },
            data: {
                title,
                value,
                currency,
                pipeline_id: pipeline_id || undefined,
                stage_id: stage_id || undefined,
                account_id: account_id || undefined,
                contact_id: contact_id || undefined,
                expected_close_date: expected_close_date ? new Date(expected_close_date) : undefined,
                probability,
                status,
            },
        })
    } catch (error) {
        console.error('Database Error:', error)
        return {
            message: 'Database Error: Failed to Update Deal.',
        }
    }

    revalidatePath('/crm/deals')
    redirect('/crm/deals')
}

export type DealFormState = {
    errors?: {
        [K in keyof z.infer<typeof dealSchema>]?: string[]
    }
    message?: string
}

export async function createDeal(prevState: DealFormState, formData: FormData): Promise<DealFormState> {
    const session = await auth()
    const user = session?.user

    if (!user || !user.tenantId) {
        return { message: 'Unauthorized' }
    }

    const validatedFields = dealSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Deal.',
        }
    }

    const {
        title, value, currency,
        pipeline_id, stage_id,
        account_id, contact_id,
        expected_close_date, probability, status
    } = validatedFields.data

    try {
        await prisma.crm_deals.create({
            data: {
                tenant_id: user.tenantId,
                owner_id: user.id,
                title,
                value,
                currency,
                pipeline_id: pipeline_id || undefined,
                stage_id: stage_id || undefined,
                account_id: account_id || undefined,
                contact_id: contact_id || undefined,
                expected_close_date: expected_close_date ? new Date(expected_close_date) : undefined,
                probability,
                status,
            },
        })
    } catch (error) {
        console.error('Database Error:', error)
        return {
            message: 'Database Error: Failed to Create Deal.',
        }
    }

    revalidatePath('/crm/deals')
    redirect('/crm/deals')
}

export async function getDealsForPipeline(pipelineId: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    const deals = await prisma.crm_deals.findMany({
        where: {
            tenant_id: session.user.tenantId,
            pipeline_id: pipelineId,
            deleted_at: null
        },
        include: {
            account: { select: { name: true } },
            owner: { select: { name: true, image: true } },
            stage: true
        },
        orderBy: { updated_at: 'desc' }
    })

    return deals.map(d => ({
        ...d,
        value: Number(d.value),
        probability: d.probability ? Number(d.probability) : 0
    }))
}

export async function updateDealStageAction(dealId: string, stageId: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: 'Unauthorized' }

    try {
        await prisma.crm_deals.update({
            where: { id: dealId, tenant_id: session.user.tenantId },
            data: { stage_id: stageId, updated_at: new Date() }
        })
        revalidatePath('/crm/pipeline')
        revalidatePath('/crm/deals')
        return { success: true }
    } catch (error) {
        console.error('Failed to update stage:', error)
        return { error: 'Database error' }
    }
}
