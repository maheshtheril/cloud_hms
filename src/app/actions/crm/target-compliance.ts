'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

/**
 * Calculates the total achieved value for a user within a given period.
 * It sums the value of all 'won' deals owned by the user.
 */
export async function calculateAchievedValue(userId: string, periodStart: Date, periodEnd: Date) {
    const deals = await prisma.crm_deals.findMany({
        where: {
            owner_id: userId,
            status: 'won',
            updated_at: {
                gte: periodStart,
                lte: periodEnd
            }
        },
        select: {
            value: true
        }
    })

    const total = deals.reduce((acc, deal) => {
        return acc + Number(deal.value || 0)
    }, 0)

    return total
}

/**
 * Updates the achieved_value for all active targets of a user.
 */
export async function updateTargetProgress(userId: string) {
    const targets = await prisma.crm_targets.findMany({
        where: {
            assignee_id: userId,
            assignee_type: 'user',
            deleted_at: null,
        }
    })

    for (const target of targets) {
        const achieved = await calculateAchievedValue(userId, target.period_start, target.period_end)

        await prisma.crm_targets.update({
            where: { id: target.id },
            data: {
                achieved_value: achieved
            }
        })
    }
}

/**
 * Checks if the user has failed any CLOSED targets and blocks them if so.
 * ONLY BLOCKS if user has 'Sales Man' role.
 * Returns true if user was blocked.
 */
export async function checkAndBlockUser(userId: string) {
    // 1. Verify Role Safety Check
    const user = await prisma.app_user.findUnique({
        where: { id: userId },
        include: {
            hms_user_roles: { include: { hms_role: true } }
        }
    })

    if (!user) return false
    if (user.is_admin || user.is_platform_admin || user.is_tenant_admin) return false

    // Check if user has sales role
    const isSales =
        user.role?.match(/sales/i) ||
        user.hms_user_roles.some(ur => ur.hms_role.name.match(/sales/i))

    if (!isSales) {
        console.log(`User ${userId} is not a sales user, skipping block check.`)
        return false
    }

    // 2. Proceed with Check
    const now = new Date()
    await updateTargetProgress(userId)

    const missedTargets = await prisma.crm_targets.findMany({
        where: {
            assignee_id: userId,
            assignee_type: 'user',
            period_end: { lt: now },
            deleted_at: null,
        }
    })

    let shouldBlock = false

    for (const target of missedTargets) {
        const targetVal = Number(target.target_value)
        const achievedVal = Number(target.achieved_value || 0)

        if (achievedVal < targetVal) {
            shouldBlock = true
            break
        }
    }

    if (shouldBlock) {
        await prisma.app_user.update({
            where: { id: userId },
            data: {
                is_active: false,
                metadata: {
                    ...(user.metadata as object || {}),
                    blocked_reason: "Missed Target",
                    blocked_at: new Date().toISOString()
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
