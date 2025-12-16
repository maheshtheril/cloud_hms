'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth' // Fixed import
import { processCustomFields } from './custom-fields'

const leadSchema = z.object({
    name: z.string().min(1, 'Lead name is required'),
    company_name: z.string().optional(),
    company_id: z.string().optional(), // Internal Company/Branch
    contact_name: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),

    pipeline_id: z.string().optional(),
    stage_id: z.string().optional(),
    source_id: z.string().optional(),

    estimated_value: z.coerce.number().optional(),
    probability: z.coerce.number().optional(),
    status: z.string().default('new'),

    // Futuristic Fields
    lead_score: z.coerce.number().optional(),
    ai_summary: z.string().optional(),
    is_hot: z.boolean().optional(),

    next_followup_date: z.string().optional(), // Date string from form
})

export type LeadFormState = {
    errors?: {
        [K in keyof z.infer<typeof leadSchema>]?: string[]
    }
    message?: string
}

export async function createLead(prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
    const session = await auth()
    const user = session?.user

    // Ensure consistency with masters.ts (tenantId vs tenant_id). Using tenantId based on masters.ts
    // Check if user object has tenantId or tenant_id. NextAuth usually puts it in user.
    // If previous code in this file used user.tenant_id, and masters used tenantId...
    // I will use session.user.tenantId as per masters.ts which I believe is more recent/correct for this project 
    // or type check user.
    const tenantId = user?.tenantId || (user as any)?.tenant_id

    if (!user || !tenantId) {
        return { message: 'Unauthorized' }
    }

    const validatedFields = leadSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Lead.',
        }
    }

    const {
        name, company_name, company_id, contact_name, email, phone,
        pipeline_id, stage_id, source_id,
        estimated_value, probability, status,
        lead_score, ai_summary, is_hot,
        next_followup_date
    } = validatedFields.data

    try {
        // Auto-calculate score if not provided (Fake AI for now)
        const calculatedScore = lead_score || (estimated_value && estimated_value > 10000 ? 80 : 40)
        const autoSummary = ai_summary || `AI: Lead created manually. High value prospect.`
        const hotStatus = is_hot || (calculatedScore > 75)

        const newLead = await prisma.crm_leads.create({
            data: {
                tenant_id: tenantId,
                company_id: company_id || null, // Create relation if company_id provided
                owner_id: user.id, // Assign to creator by default
                name,
                company_name,
                contact_name,
                email: email || null,
                phone,
                pipeline_id: pipeline_id || undefined,
                stage_id: stage_id || undefined,
                source_id: source_id || undefined,
                estimated_value: estimated_value || 0,
                probability: probability || 0,
                status,
                lead_score: calculatedScore,
                ai_summary: autoSummary,
                is_hot: hotStatus,
                next_followup_date: next_followup_date ? new Date(next_followup_date) : undefined
            },
        })

        // Process Custom Fields
        await processCustomFields(formData, user.tenant_id, newLead.id, 'lead')

    } catch (error) {
        console.error('Database Error:', error)
        return {
            message: 'Database Error: Failed to Create Lead.',
        }
    }

    revalidatePath('/crm/leads')
    redirect('/crm/leads')
}
