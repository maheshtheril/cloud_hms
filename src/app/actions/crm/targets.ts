
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMyTargets() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return []

    // Fetch targets assigned to this user
    const targets = await prisma.crm_targets.findMany({
        where: {
            tenant_id: session.user.tenantId,
            assignee_id: session.user.id,
            deleted_at: null,
        },
        include: {
            milestones: {
                orderBy: { step_order: 'asc' }
            }
        },
        orderBy: { period_end: 'desc' },
    })

    // Calculate status of each target based on milestones
    return targets.map(t => {
        // If revenue target is achieved, mark as secure even if milestones pending
        // But strictly, we return the data as is.
        return t
    })
}

export async function createTarget(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    const targetValue = parseFloat(formData.get('target_value') as string)
    const incentiveAmount = parseFloat(formData.get('incentive_amount') as string) || 0
    const periodType = formData.get('period_type') as string
    const targetType = formData.get('target_type') as string
    const startDate = new Date(formData.get('period_start') as string)
    const endDate = new Date(formData.get('period_end') as string)

    const assigneeId = (formData.get('assignee_id') as string) || session.user.id

    try {
        const target = await prisma.crm_targets.create({
            data: {
                tenant_id: session.user.tenantId,
                assignee_type: 'user',
                assignee_id: assigneeId,
                period_type: periodType,
                period_start: startDate,
                period_end: endDate,
                target_type: targetType,
                target_value: targetValue,
                incentive_amount: incentiveAmount,
                achieved_value: 0
            }
        })

        // AUTO-GENERATE GATES (Milestones) based on "World Standard" logic
        // Gate 1: Activity Ramp (Week 1)
        const week1Deadline = new Date(startDate)
        week1Deadline.setDate(week1Deadline.getDate() + 7)

        // Gate 2: Pipeline Coverage (Mid-period)
        const midPoint = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2)

        const milestones = [
            {
                step_order: 1,
                name: 'Pipeline Velocity (Ramp Up)',
                metric_type: 'activities', // calls, logs, etc
                target_value: 50, // e.g. 50 calls/week
                deadline: week1Deadline,
                is_blocking: true
            },
            {
                step_order: 2,
                name: 'Pipeline Coverage (3x)',
                metric_type: 'pipeline_value',
                target_value: targetValue * 3, // World standard: 3x pipeline
                deadline: midPoint,
                is_blocking: true
            },
            {
                step_order: 3,
                name: 'Revenue Goal',
                metric_type: 'revenue',
                target_value: targetValue,
                deadline: endDate, // Final deadline
                is_blocking: true
            }
        ]

        await prisma.crm_target_milestones.createMany({
            data: milestones.map(m => ({
                target_id: target.id,
                ...m
            }))
        })

        revalidatePath('/crm/targets')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getPotentialAssignees() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return []

    // Fetch all active users in the tenant
    const users = await prisma.app_user.findMany({
        where: {
            tenant_id: session.user.tenantId,
            is_active: true
        },
        select: {
            id: true,
            email: true,
            full_name: true,
            role: true
        }
    })

    return users
}
