'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

/**
 * Calculates achievement for a specific metric within a time range.
 */
async function calculateMetricAchievement(userId: string, metricType: string, startDate: Date, endDate: Date) {
    if (metricType === 'revenue' || metricType === 'pipeline_value') {
        const deals = await prisma.crm_deals.findMany({
            where: {
                owner_id: userId,
                // Revenue = WON, Pipeline = NOT LOST (includes won)
                status: metricType === 'revenue' ? { equals: 'won', mode: 'insensitive' } : { not: 'lost' },
                updated_at: { gte: startDate, lte: endDate }
            },
            select: { value: true }
        })
        return deals.reduce((sum, d) => sum + Number(d.value || 0), 0)
    }

    if (metricType === 'calls' || metricType === 'activities') {
        return await prisma.crm_activities.count({
            where: {
                owner_id: userId,
                created_at: { gte: startDate, lte: endDate }
            }
        })
    }

    return 0
}

/**
 * Updates the entire progress grid for a user (Targets + Milestones).
 */
export async function updateTargetProgress(userId: string) {
    const targets = await prisma.crm_targets.findMany({
        where: {
            assignee_id: userId,
            assignee_type: 'user',
            deleted_at: null,
        },
        include: { milestones: true }
    })

    const results = []

    for (const target of targets) {
        // 1. Update Milestones
        for (const m of target.milestones) {
            const mAchieved = await calculateMetricAchievement(userId, m.metric_type, target.period_start, m.deadline)

            // Check if status should update to passed or failed if deadline passed
            let newStatus = m.status
            if (new Date(m.deadline) < new Date()) {
                newStatus = mAchieved >= Number(m.target_value) ? 'passed' : 'failed'
            }

            await prisma.crm_target_milestones.update({
                where: { id: m.id },
                data: {
                    achieved_value: mAchieved,
                    status: newStatus
                }
            })
        }

        // 2. Update Main Target Progress (usually based on target_type)
        const totalAchieved = await calculateMetricAchievement(userId, target.target_type, target.period_start, target.period_end)

        await prisma.crm_targets.update({
            where: { id: target.id },
            data: { achieved_value: totalAchieved }
        })

        results.push({ id: target.id, achieved: totalAchieved })
    }

    return results
}

/**
 * High-performance compliance audit.
 * Checks for blocking failures and restricts access.
 */
export async function getUserComplianceStatus(userId: string) {
    const user = await prisma.app_user.findUnique({
        where: { id: userId },
        include: {
            hms_user_roles: { include: { hms_role: true } }
        }
    })

    if (!user || user.is_admin || user.is_platform_admin || user.is_tenant_admin) {
        return { isBlocked: false }
    }

    // World Class: Only block Sales roles
    const isSales = user.role?.match(/sales/i) ||
        user.hms_user_roles.some(ur => ur.hms_role.name.match(/sales/i))

    if (!isSales) return { isBlocked: false }

    // Synchronize progress first
    await updateTargetProgress(userId)

    // Check for any FAILED blocking milestone or CLOSED missed target
    const now = new Date()
    // First, find targets that have expired OR have failed blocking milestones
    const potentialFailures = await prisma.crm_targets.findMany({
        where: {
            assignee_id: userId,
            deleted_at: null,
            OR: [
                {
                    milestones: {
                        some: {
                            status: 'failed',
                            is_blocking: true
                        }
                    }
                },
                {
                    period_end: { lt: now }
                }
            ]
        },
        include: {
            milestones: {
                where: { status: 'failed', is_blocking: true }
            }
        }
    })

    const complianceFailure = (potentialFailures as any[]).find(t => {
        // 1. Has failed blocking milestones
        if (t.milestones?.length > 0) return true;

        // 2. Is expired and achieved < goal
        if (new Date(t.period_end) < now && Number(t.achieved_value || 0) < Number(t.target_value)) {
            return true;
        }

        return false;
    });

    if (complianceFailure) {
        const reason = (complianceFailure as any).milestones?.[0]
            ? `FAILED CRITICAL GATE: ${(complianceFailure as any).milestones[0].name}`
            : `MISSED REVENUE QUOTA: ${(complianceFailure as any).target_type}`

        return {
            isBlocked: true,
            reason,
            targetId: complianceFailure.id,
            deadline: (complianceFailure as any).milestones?.[0]?.deadline || (complianceFailure as any).period_end
        }
    }

    return { isBlocked: false }
}

export async function checkAndBlockUser(userId: string) {
    const status = await getUserComplianceStatus(userId)
    if (status.isBlocked) {
        await prisma.app_user.update({
            where: { id: userId },
            data: {
                is_active: false,
                metadata: {
                    blocked_reason: status.reason,
                    blocked_at: new Date().toISOString(),
                    blocked_by: 'Automated Compliance Engine'
                }
            }
        })
        return true
    }
    return false
}

export async function adminBlockUserIfTargetMissed(userId: string) {
    const res = await checkAndBlockUser(userId)
    return { blocked: res }
}

