
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getSchedulerEvents(start: Date, end: Date) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return []

    const tenantId = session.user.tenantId
    const userId = session.user.id

    // Fetch activities assigned to user or created by user? 
    // Usually scheduler shows own activities.
    // 'owner_id' in crm_activities usually denotes assignee or owner.

    // Note: start and end are coming from the client calendar view range

    const activities = await prisma.crm_activities.findMany({
        where: {
            tenant_id: tenantId,
            owner_id: userId, // Filter by user
            due_date: {
                gte: start,
                lte: end
            },
            status: { not: 'cancelled' } // Optionally hide cancelled
        },
        select: {
            id: true,
            subject: true,
            description: true,
            due_date: true,
            type: true,
            status: true,
            lead: {
                select: { name: true, company_name: true }
            },
            deal: {
                select: { title: true }
            }
        }
    })

    // Map to calendar events
    return activities.map(act => {
        const startDate = new Date(act.due_date!)
        // Default duration 1 hour if not specified (activities schema doesn't have end_date, only due_date/completed_at)
        // We might want to add end_date to schema later, but for now 1h default.
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

        return {
            id: act.id,
            title: act.subject,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: {
                type: act.type,
                description: act.description,
                status: act.status,
                related: act.lead ? `${act.lead.name} (${act.lead.company_name || ''})` : act.deal ? act.deal.title : 'General'
            }
        }
    })
}
