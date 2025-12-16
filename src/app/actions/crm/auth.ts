
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type LoginStatus = {
    blocked: boolean
    reason?: 'attendance' | 'followups'
    data?: any
}

export async function checkCrmLoginStatus(): Promise<LoginStatus> {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { blocked: false }
    }

    const { id: userId, tenantId } = session.user
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 1. Check Attendance
    const attendance = await prisma.crm_attendance.findFirst({
        where: {
            tenant_id: tenantId,
            user_id: userId,
            date: {
                gte: today
            },
            check_in: { not: null }
        }
    })

    if (!attendance) {
        return { blocked: true, reason: 'attendance' }
    }

    // 2. Check Overdue Follow-ups
    // Since there might be no direct relation in schema, we fetch raw followups
    const overdueFollowups = await prisma.lead_followups.findMany({
        where: {
            tenant_id: tenantId,
            // Assuming we only block for followups assigned to the user? 
            // The schema for lead_followups doesn't expressly show an assignee.
            // But it has `created_by` or `lead_id`.
            // Let's assume we check followups for leads OWNED by the user.
            // We need to fetch leads owned by user first.
            lead_id: {
                in: (await prisma.crm_leads.findMany({
                    where: { owner_id: userId, tenant_id: tenantId },
                    select: { id: true }
                })).map(l => l.id)
            },
            status: { notIn: ['completed', 'cancelled'] },
            due_at: { lt: new Date() }
        },
        take: 5,
        orderBy: { due_at: 'asc' }
    })

    if (overdueFollowups.length > 0) {
        // Fetch lead details manually for display
        const leadIds = overdueFollowups.map(f => f.lead_id)
        const leads = await prisma.crm_leads.findMany({
            where: { id: { in: leadIds } },
            select: { id: true, name: true, company_name: true }
        })

        const enrichedFollowups = overdueFollowups.map(f => ({
            ...f,
            id: f.id.toString(),
            lead: leads.find(l => l.id === f.lead_id)
        }))

        return { blocked: true, reason: 'followups', data: enrichedFollowups }
    }

    return { blocked: false }
}

export async function markAttendance(lat?: number, lng?: number, address?: string) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        const { id: userId, tenantId } = session.user
        const today = new Date()
        const todayDate = new Date(today)
        todayDate.setHours(0, 0, 0, 0)

        // Check existing
        const existing = await prisma.crm_attendance.findFirst({
            where: {
                tenant_id: tenantId,
                user_id: userId,
                date: {
                    gte: todayDate,
                    lt: new Date(todayDate.getTime() + 24 * 60 * 60 * 1000)
                }
            }
        })

        if (existing) {
            return { success: true, message: "Already marked" }
        }

        await prisma.crm_attendance.create({
            data: {
                tenant_id: tenantId,
                user_id: userId,
                date: todayDate,
                check_in: new Date(),
                check_in_location: lat ? { lat, lng, address } : undefined,
                status: 'present'
            }
        })

        revalidatePath('/crm')
        return { success: true }
    } catch (e: any) {
        console.error("Mark Attendance Error:", e)
        return { error: e.message || "Failed to mark attendance" }
    }
}

export async function completeFollowup(followupId: number | string) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        // Need to cast to BigInt since id is BigInt in schema
        await prisma.lead_followups.update({
            where: { id: BigInt(followupId) },
            data: {
                status: 'completed',
                updated_at: new Date(),
                changed_by: session.user.id
            }
        })
        revalidatePath('/crm')
        return { success: true }
    } catch (error: any) {
        console.error("Complete Followup Error:", error)
        return { error: error.message || "Failed to complete task" }
    }
}
