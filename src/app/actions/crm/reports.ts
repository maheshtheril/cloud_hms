
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

    return {
        leadsByStatus: leadsByStatus.map(l => ({
            status: l.status || 'New',
            count: l._count.id
        })),
        dealsByStage: dealsReport
    }
}
