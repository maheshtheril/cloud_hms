
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getCrmReports() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return null

    const tenantId = session.user.tenantId

    // 1. Leads by Status
    const leadsByStatus = await prisma.crm_leads.groupBy({
        by: ['status'],
        where: { tenant_id: tenantId, deleted_at: null },
        _count: { id: true }
    })

    // 2. Deals by Stage (Pipeline)
    // We need to fetch stage names, so we can't just use groupBy easily if we want names
    // But let's use groupBy first and simpler queries
    const dealsByStage = await prisma.crm_deals.groupBy({
        by: ['stage_id'],
        where: { tenant_id: tenantId, deleted_at: null, status: 'open' },
        _sum: { value: true },
        _count: { id: true }
    })

    // Fetch stage names ensuring uniqueness
    const stageIds = dealsByStage.map(d => d.stage_id).filter((id): id is string => id !== null)

    // Use findMany to get stages, but we need to handle potential duplicates if stages are shared (though IDs are unique)
    const stages = await prisma.crm_stages.findMany({
        where: { id: { in: stageIds } },
        select: { id: true, name: true }
    })

    const dealsReport = dealsByStage.map(d => {
        const stage = stages.find(s => s.id === d.stage_id)
        return {
            stageName: stage?.name || 'Unknown',
            count: d._count.id,
            value: Number(d._sum.value || 0)
        }
    })

    // 3. Lead Growth Trend (Last 6 Months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1) // Start of 6 months ago

    const leadsTrendData = await prisma.crm_leads.findMany({
        where: {
            tenant_id: tenantId,
            deleted_at: null,
            created_at: { gte: sixMonthsAgo }
        },
        select: { created_at: true }
    })

    // Process leads into monthly counts
    const monthlyGrowth = new Map<string, number>()
    // Initialize last 6 months with 0
    for (let i = 0; i < 6; i++) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const key = d.toLocaleString('default', { month: 'short', year: 'numeric' }) // e.g., "Dec 2025"
        monthlyGrowth.set(key, 0)
    }

    leadsTrendData.forEach(l => {
        const key = l.created_at.toLocaleString('default', { month: 'short', year: 'numeric' })
        if (monthlyGrowth.has(key)) {
            monthlyGrowth.set(key, (monthlyGrowth.get(key) || 0) + 1)
        }
    })

    // Reverse to show oldest first
    const growthTrend = Array.from(monthlyGrowth.entries())
        .map(([name, value]) => ({ name, value }))
        .reverse()

    // 4. Activity Volume
    const activities = await prisma.crm_activities.groupBy({
        by: ['type'],
        where: { tenant_id: tenantId },
        _count: { id: true }
    })

    // 5. Top Performers (By Deal Value)
    const topDeals = await prisma.crm_deals.findMany({
        where: { tenant_id: tenantId, deleted_at: null, status: 'won' },
        select: {
            value: true,
            owner: {
                select: { name: true, email: true }
            }
        }
    })

    const ownerPerformance = new Map<string, number>()
    topDeals.forEach(d => {
        const ownerName = d.owner?.name || 'Unassigned'
        const val = Number(d.value || 0)
        ownerPerformance.set(ownerName, (ownerPerformance.get(ownerName) || 0) + val)
    })

    const topPerformers = Array.from(ownerPerformance.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5

    return {
        leadsByStatus: leadsByStatus.map(l => ({
            status: l.status || 'New',
            count: l._count.id
        })),
        dealsByStage: dealsReport,
        growthTrend,
        activityVolume: activities.map(a => ({ name: a.type, value: a._count.id })),
        topPerformers
    }
}
