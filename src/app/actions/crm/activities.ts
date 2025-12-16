'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

const activitySchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    type: z.string().default('call'), // call, meeting, email, note, task
    description: z.string().optional(),

    due_date: z.string().optional(),

    related_to_type: z.string().default('lead'), // lead, deal, contact
    related_to_id: z.string().optional(), // In MVP, might just be text or selected from dropdown

    status: z.string().default('pending'),

    // Futuristic
    sentiment_score: z.coerce.number().optional(),
    location_lat: z.coerce.number().optional(),
    location_lng: z.coerce.number().optional(),
})

export type ActivityFormState = {
    errors?: {
        [K in keyof z.infer<typeof activitySchema>]?: string[]
    }
    message?: string
}

export async function createActivity(prevState: ActivityFormState, formData: FormData): Promise<ActivityFormState> {
    const session = await auth()
    const user = session?.user

    if (!user || !user.tenant_id) {
        return { message: 'Unauthorized' }
    }

    const validatedFields = activitySchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Activity.',
        }
    }

    const {
        subject, type, description, due_date, status,
        related_to_type, related_to_id,
        sentiment_score, location_lat, location_lng
    } = validatedFields.data

    try {
        // Determine links based on related_type (Polyfill logic)
        // For now we just store the generic `related_to_id` string in the DB generic field 
        // AND try to link specific FK if appropriate.

        let lead_id = undefined
        let deal_id = undefined

        if (related_to_type === 'lead' && related_to_id) lead_id = related_to_id
        if (related_to_type === 'deal' && related_to_id) deal_id = related_to_id

        await prisma.crm_activities.create({
            data: {
                tenant_id: user.tenant_id,
                owner_id: user.id,
                subject,
                type,
                description,
                due_date: due_date ? new Date(due_date) : undefined,
                status,

                related_to_type,
                related_to_id: related_to_id || '00000000-0000-0000-0000-000000000000', // UUID requirement fallback if empty?
                // Note: related_to_id is UUID in schema. If UI provides empty string, it will fail.
                // I will assume for MVP we might not populate it if unrelated, but schema says UUID.
                // I'll make sure UI sends valid UUID/placeholder or I generate one if optional is not allowed. 
                // Checking schema: `related_to_id String @db.Uuid`. It IS required. 
                // I'll generate a dummy UUID if none provided for now or handle in UI.

                lead_id,
                deal_id,

                sentiment_score: sentiment_score || 0,
                location_lat: location_lat || undefined,
                location_lng: location_lng || undefined,
            },
        })
    } catch (error) {
        console.error('Database Error:', error)
        return {
            message: 'Database Error: Failed to Create Activity. ' + (error as Error).message,
        }
    }

    revalidatePath('/crm/activities')
    redirect('/crm/activities')
}
