
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMyTargets() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return []

    // Helper to check if string contains "admin" or "manager"
    const hasManageAccess = session.user.isAdmin || session.user.role?.toLowerCase().includes('admin') || session.user.role?.toLowerCase().includes('manager');

    let whereClause: any = {
        tenant_id: session.user.tenantId,
        deleted_at: null,
    };

    // If NOT admin/manager, strictly filter by assignee
    if (!hasManageAccess) {
        whereClause.assignee_id = session.user.id;
    }

    // Fetch targets
    const targets = await prisma.crm_targets.findMany({
        where: whereClause,
        include: {
            milestones: {
                orderBy: { step_order: 'asc' }
            }
        },
        orderBy: { period_end: 'desc' },
    }) as any[] // Cast to allow injecting assignee details if needed

    // If manager, we might want to fetch assignee details manually since there might not be a relation defined in schema yet
    if (hasManageAccess) {
        const assigneeIds = [...new Set(targets.map(t => t.assignee_id))];
        const users = await prisma.app_user.findMany({
            where: { id: { in: assigneeIds } },
            select: { id: true, full_name: true, email: true }
        });

        // Map users to targets for UI display
        return targets.map(t => {
            const user = users.find(u => u.id === t.assignee_id);
            return {
                ...t,
                assignee_name: user?.full_name || user?.email || 'Unknown Agent'
            }
        });
    }

    return targets;
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

export async function getTarget(id: string) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return null

    const target = await prisma.crm_targets.findFirst({
        where: {
            id,
            tenant_id: session.user.tenantId,
            deleted_at: null
        },
        include: {
            milestones: {
                orderBy: { step_order: 'asc' }
            }
        }
    })

    return target
}

export async function updateTarget(id: string, formData: FormData) {
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
        await prisma.crm_targets.update({
            where: {
                id,
                tenant_id: session.user.tenantId
            },
            data: {
                assignee_id: assigneeId,
                period_type: periodType,
                period_start: startDate,
                period_end: endDate,
                target_type: targetType,
                target_value: targetValue,
                incentive_amount: incentiveAmount,
            }
        })

        // Note: For now, we are NOT regenerating milestones on update as that could destroy progress.
        // In a real-world app, you might want logic to adjust milestones if dates change significantly.

        revalidatePath('/crm/targets')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
