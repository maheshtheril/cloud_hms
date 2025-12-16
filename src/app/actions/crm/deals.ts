'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

const dealSchema = z.object({
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
