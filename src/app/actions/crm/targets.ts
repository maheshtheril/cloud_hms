
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
            // You might want to filter by current period, but let's show all active for now
        },
        orderBy: { period_end: 'desc' }
    })

    return targets
}

export async function createTarget(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    // For MVP, user assigns target to self or simplistic flow
    // In real app, managers assign to others.

    const targetValue = parseFloat(formData.get('target_value') as string)
    const incentiveAmount = parseFloat(formData.get('incentive_amount') as string) || 0
    const periodType = formData.get('period_type') as string
    const targetType = formData.get('target_type') as string
    const startDate = new Date(formData.get('period_start') as string)
    const endDate = new Date(formData.get('period_end') as string)

    try {
        await prisma.crm_targets.create({
            data: {
                tenant_id: session.user.tenantId,
                assignee_type: 'user', // Default to user for now
                assignee_id: session.user.id, // Assign to self for demo
                period_type: periodType,
                period_start: startDate,
                period_end: endDate,
                target_type: targetType,
                target_value: targetValue,
                incentive_amount: incentiveAmount,
                achieved_value: 0
            }
        })
        revalidatePath('/crm/targets')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
