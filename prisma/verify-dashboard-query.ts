import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('📊 Verifying Dashboard Queries...')

    const tenant = await prisma.tenant.findFirst()
    if (!tenant) throw new Error('No tenant found')
    const tenantId = tenant.id

    // 1. KPI Queries
    const wonDeals = await prisma.crm_deals.findMany({ where: { tenant_id: tenantId, status: 'won', deleted_at: null } })
    const activeDeals = await prisma.crm_deals.findMany({ where: { tenant_id: tenantId, status: { notIn: ['won', 'lost'] }, deleted_at: null } })
    const leads = await prisma.crm_leads.findMany({ where: { tenant_id: tenantId, deleted_at: null } })

    console.log(`✅ KPIs: Revenue: ${wonDeals.length}, Active Deals: ${activeDeals.length}, Leads: ${leads.length}`)

    // 2. Funnel Query
    const stages = await prisma.crm_stages.findMany({
        where: { pipeline: { tenant_id: tenantId } },
        include: { _count: { select: { deals: { where: { deleted_at: null } } } } }
    })
    console.log(`✅ Funnel: Found ${stages.length} stages`)
    stages.forEach(s => console.log(`   - ${s.name}: ${s._count.deals} deals`))

    // 3. Hot Leads
    const hotLeads = await prisma.crm_leads.findMany({
        where: { tenant_id: tenantId, deleted_at: null, is_hot: true },
        take: 5
    })
    console.log(`✅ Hot Leads: Found ${hotLeads.length}`)

    console.log('🎉 Dashboard Queries Verified!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
