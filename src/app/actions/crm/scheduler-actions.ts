'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateEventSchema = z.object({
    id: z.string().uuid(),
    type: z.string(),
    date: z.string(), // ISO string
    description: z.string().optional()
})

export async function updateSchedulerEvent(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { message: 'Unauthorized' }
    }

    const rawData = {
        id: formData.get('id'),
        type: formData.get('type'),
        date: formData.get('date'),
        description: formData.get('description')
    }

    const validated = updateEventSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: 'Invalid data' }
    }

    const { id, type, date, description } = validated.data
    const newDate = new Date(date)

    try {
        if (type === 'lead_followup') {
            // Update Lead Follow-up Date
            await prisma.crm_leads.update({
                where: {
                    id: id,
                    tenant_id: session.user.tenantId
                },
                data: {
                    next_followup_date: newDate
                    // Note: crm_leads doesn't have a simple description/notes field to update easily here without overwriting other things.
                    // We typically log activities for notes. For now, we only update the date for leads.
                }
            })
        } else {
            // Update Activity
            await prisma.crm_activities.update({
                where: {
                    id: id,
                    tenant_id: session.user.tenantId
                },
                data: {
                    due_date: newDate,
                    description: description
                }
            })
        }

        revalidatePath('/crm/scheduler')
        return { success: true, message: 'Event updated successfully' }

    } catch (error) {
        console.error('Update Event Error:', error)
        return { message: 'Failed to update event' }
    }
}
