
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMyTargets() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return []

    // Fetch user role to determine access level
    const user = await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });
    const userRole = user?.role || '';

    // Check if user is admin or manager
    const hasManageAccess = session.user.isAdmin || userRole.toLowerCase().includes('admin') || userRole.toLowerCase().includes('manager');

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

    // Access Control
    const userRole = await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });
    const role = userRole?.role || '';
    const hasManageAccess = session.user.isAdmin || role.toLowerCase().includes('admin') || role.toLowerCase().includes('manager');

    if (!hasManageAccess) {
        return { error: "Access Denied" };
    }

    const targetValue = parseFloat(formData.get('target_value') as string)
    const incentiveAmount = parseFloat(formData.get('incentive_amount') as string) || 0
    const periodType = formData.get('period_type') as string
    const targetType = formData.get('target_type') as string
    const startDate = new Date(formData.get('period_start') as string)
    const endDate = new Date(formData.get('period_end') as string)
    let assigneeIds = formData.getAll('assignee_id') as string[];

    // Parse Custom Milestones if provided
    const milestonesJson = formData.get('milestones_json') as string;
    let customMilestones = [];
    if (milestonesJson) {
        try {
            customMilestones = JSON.parse(milestonesJson);
        } catch (e) {
            console.error("Failed to parse milestones JSON", e);
        }
    }

    if (assigneeIds.length === 0) assigneeIds = [session.user.id];

    try {
        for (const assigneeId of assigneeIds) {
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

            // Generate Milestones
            let milestonesToCreate = [];
            if (customMilestones.length > 0) {
                milestonesToCreate = customMilestones.map((m: any, idx: number) => ({
                    target_id: target.id,
                    step_order: idx + 1,
                    name: m.name,
                    metric_type: m.metric_type,
                    target_value: parseFloat(m.target_value),
                    deadline: new Date(m.deadline),
                    is_blocking: !!m.is_blocking
                }));
            } else {
                // Default World Class Gates
                const week1 = new Date(startDate);
                week1.setDate(week1.getDate() + 7);
                const mid = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2);

                milestonesToCreate = [
                    { target_id: target.id, step_order: 1, name: 'Ramp Up Velocity', metric_type: 'activities', target_value: 50, deadline: week1, is_blocking: true },
                    { target_id: target.id, step_order: 2, name: 'Pipeline Health', metric_type: 'pipeline_value', target_value: targetValue * 2, deadline: mid, is_blocking: true },
                    { target_id: target.id, step_order: 3, name: 'Revenue Closing', metric_type: 'revenue', target_value: targetValue, deadline: endDate, is_blocking: true }
                ];
            }

            await prisma.crm_target_milestones.createMany({ data: milestonesToCreate });
        }

        revalidatePath('/crm/targets')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateTarget(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    const userRole = await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });
    const role = userRole?.role || '';
    const hasManageAccess = session.user.isAdmin || role.toLowerCase().includes('admin') || role.toLowerCase().includes('manager');

    if (!hasManageAccess) return { error: "Access Denied" };

    const targetValue = parseFloat(formData.get('target_value') as string)
    const incentiveAmount = parseFloat(formData.get('incentive_amount') as string) || 0
    const periodType = formData.get('period_type') as string
    const targetType = formData.get('target_type') as string
    const startDate = new Date(formData.get('period_start') as string)
    const endDate = new Date(formData.get('period_end') as string)
    const assigneeId = (formData.get('assignee_id') as string) || session.user.id

    const milestonesJson = formData.get('milestones_json') as string;

    try {
        await prisma.crm_targets.update({
            where: { id, tenant_id: session.user.tenantId },
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

        if (milestonesJson) {
            const milestones = JSON.parse(milestonesJson);

            // Simplified reconciliation: delete old and create new for clarity in this large update
            // (In a high-vol prod app, you'd patch individually, but here we want to ensure exact UI sync)
            await prisma.crm_target_milestones.deleteMany({ where: { target_id: id } });

            await prisma.crm_target_milestones.createMany({
                data: milestones.map((m: any, idx: number) => ({
                    target_id: id,
                    step_order: idx + 1,
                    name: m.name,
                    metric_type: m.metric_type,
                    target_value: parseFloat(m.target_value),
                    deadline: new Date(m.deadline),
                    is_blocking: !!m.is_blocking,
                    status: m.status || 'pending'
                }))
            });
        }

        revalidatePath('/crm/targets')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function syncAllTeamTargets() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        const users = await prisma.app_user.findMany({
            where: { tenant_id: session.user.tenantId, is_active: true }
        });

        const { updateTargetProgress } = await import('./target-compliance');

        for (const user of users) {
            // @ts-ignore
            await updateTargetProgress(user.id);
        }

        revalidatePath('/crm/targets');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function getManagementOverview() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return null

    const targets = await getMyTargets(); // This already handles manager logic

    // @ts-ignore
    const stats = {
        totalAgents: new Set(targets.map((t: any) => t.assignee_id)).size,
        totalTargets: targets.length,
        atRiskCount: targets.filter((t: any) => t.milestones?.some((m: any) => m.status === 'failed' && m.is_blocking)).length,
        totalRevenueGoal: targets.filter((t: any) => t.target_type === 'revenue').reduce((s: number, t: any) => s + Number(t.target_value), 0),
        totalRevenueAchieved: targets.filter((t: any) => t.target_type === 'revenue').reduce((s: number, t: any) => s + Number(t.achieved_value), 0),
    };

    return { targets, stats };
}

export async function getTarget(id: string) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return null

    return await prisma.crm_targets.findUnique({
        where: { id, tenant_id: session.user.tenantId },
        include: {
            milestones: {
                orderBy: { step_order: 'asc' }
            }
        }
    })
}

export async function getPotentialAssignees() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    return await prisma.app_user.findMany({
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
}
