import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

// const prisma = new PrismaClient()

async function main() {
    console.log('Seeding CRM Masters...')

    // 1. CRM Sources
    const sources = ['Website', 'Referral', 'Cold Call', 'LinkedIn', 'Partner', 'Event']
    for (const name of sources) {
        // Check if exists by name (mock check or just create if tenant specific, here assume global/default tenant context or just generic seed)
        // Since tenant_id is required, we need a tenant. For seeding, we might need to skip strict tenant check or fetch a default 'demo' tenant.
        // However, usually seeds are for initial setup. 
        // Let's assume this script is run per-tenant or we fetch the first tenant to seed for demo purposes.

        // FETCH DEMO TENANT
        const tenant = await prisma.tenant.findFirst()
        if (!tenant) {
            console.log('No tenant found. Skipping localized seeds.')
            return
        }
        const tenantId = tenant.id

        const exists = await prisma.crm_sources.findFirst({
            where: { name, tenant_id: tenantId }
        })
        if (!exists) {
            await prisma.crm_sources.create({
                data: { name, tenant_id: tenantId }
            })
            console.log(`Created Source: ${name}`)
        }
    }

    // 2. CRM Pipelines & Stages
    const tenant = await prisma.tenant.findFirst()
    if (tenant) {
        const tenantId = tenant.id

        let pipeline = await prisma.crm_pipelines.findFirst({
            where: { name: 'Standard Sales Pipeline', tenant_id: tenantId }
        })

        if (!pipeline) {
            console.log('Creating Standard Pipeline...')
            pipeline = await prisma.crm_pipelines.create({
                data: {
                    name: 'Standard Sales Pipeline',
                    tenant_id: tenantId,
                    is_default: true
                }
            })

            // Stages
            const stages = [
                { name: 'New', type: 'open', prob: 10, sort: 10 },
                { name: 'Qualified', type: 'open', prob: 30, sort: 20 },
                { name: 'Proposal', type: 'open', prob: 60, sort: 30 },
                { name: 'Negotiation', type: 'open', prob: 80, sort: 40 },
                { name: 'Won', type: 'won', prob: 100, sort: 50 },
                { name: 'Lost', type: 'lost', prob: 0, sort: 60 },
            ]

            for (const s of stages) {
                await prisma.crm_stages.create({
                    data: {
                        pipeline_id: pipeline.id,
                        name: s.name,
                        type: s.type,
                        probability: s.prob,
                        sort_order: s.sort
                    }
                })
                console.log(`Created Stage: ${s.name}`)
            }
        }

        // 3. Lost Reasons
        const reasons = ['Price too high', 'Competitor', 'Feature missing', 'Timing', 'No budget']
        for (const reason of reasons) {
            const exists = await prisma.crm_lost_reasons.findFirst({
                where: { reason, tenant_id: tenantId }
            })
            if (!exists) {
                await prisma.crm_lost_reasons.create({
                    data: { reason, tenant_id: tenantId }
                })
            }
        }

        // 4. Commission Rules (Sample)
        const commissionExists = await prisma.crm_commission_rules.findFirst({ where: { tenant_id: tenantId } })
        if (!commissionExists) {
            // Assign to first user found just as sample
            const user = await prisma.app_user.findFirst({ where: { tenant_id: tenantId } })
            if (user) {
                await prisma.crm_commission_rules.create({
                    data: {
                        tenant_id: tenantId,
                        name: 'Standard Rep Commission',
                        assignee_type: 'user',
                        assignee_id: user.id,
                        calculation_type: 'percentage',
                        value: 5.00, // 5%
                        trigger_event: 'deal_won'
                    }
                })
                console.log('Created Sample Commission Rule')
            }
        }
    }

    console.log('Seeding CRM Masters Completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
