
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

    const [activities, leads, createdLeads] = await Promise.all([
        prisma.crm_activities.findMany({
            where: {
                tenant_id: tenantId,
                owner_id: userId,
                due_date: {
                    gte: start,
                    lte: end
                },
                status: { not: 'cancelled' }
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
        }),
        prisma.crm_leads.findMany({
            where: {
                tenant_id: tenantId,
                owner_id: userId,
                next_followup_date: {
                    gte: start,
                    lte: end
                },
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                company_name: true,
                next_followup_date: true,
                status: true
            }
        }),
        prisma.crm_leads.findMany({
            where: {
                tenant_id: tenantId,
                owner_id: userId,
                created_at: {
                    gte: start,
                    lte: end
                },
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                company_name: true,
                created_at: true,
                status: true
            }
        })
    ])

    // Map activities to calendar events
    const activityEvents = activities.map(act => {
        const startDate = new Date(act.due_date!)
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

        return {
            id: act.id,
            title: act.subject,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: {
                type: act.type,
                description: act.description || 'No description provided.',
                status: act.status,
                related: act.lead ? `Lead: ${act.lead.name}` : act.deal ? `Deal: ${act.deal.title}` : 'General',
                subtext: act.lead?.company_name || ''
            }
        }
    })

    // Map leads to calendar events
    const leadEvents = leads.map(lead => {
        const startDate = new Date(lead.next_followup_date!)
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // 30 min for followups

        return {
            id: lead.id,
            title: `Follow-up: ${lead.name}`,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: {
                type: 'lead_followup',
                description: `Scheduled follow-up with lead: ${lead.name}`,
                status: lead.status,
                related: `Lead: ${lead.name}`,
                subtext: lead.company_name || ''
            }
        }
    })

    const createdLeadEvents = createdLeads.map(lead => {
        const startDate = new Date(lead.created_at)
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour block

        return {
            id: `created_${lead.id}`,
            title: `Lead Created: ${lead.name}`,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: {
                type: 'lead_created',
                description: `New Lead Created: ${lead.name} (${lead.company_name || 'Individual'})`,
                status: lead.status,
                related: `Lead: ${lead.name}`,
                subtext: lead.company_name || ''
            }
        }
    })

    return [...activityEvents, ...leadEvents, ...createdLeadEvents]
}
