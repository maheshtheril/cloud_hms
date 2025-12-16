
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Find a tenant
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) throw new Error("No tenant found")

    console.log("Seeding Custom Fields for Tenant:", tenant.id)

    const fields = [
        { key: 'requirements_doc', label: 'Requirements Doc', field_type: 'file', sort_order: 1 },
        { key: 'budget_approved', label: 'Budget Approved?', field_type: 'boolean', sort_order: 2 },
        { key: 'industry_segment', label: 'Industry Segment', field_type: 'select', options: { values: ['Tech', 'Health', 'Finance'] }, sort_order: 3 },
        { key: 'referral_code', label: 'Referral Code', field_type: 'text', sort_order: 4 },
    ]

    for (const f of fields) {
        await prisma.custom_field_definition.upsert({
            where: {
                tenant_id_entity_key: {
                    tenant_id: tenant.id,
                    entity: 'lead',
                    key: f.key
                }
            },
            update: {
                label: f.label,
                field_type: f.field_type,
                options: f.options,
                sort_order: f.sort_order,
                visible: true
            },
            create: {
                tenant_id: tenant.id,
                entity: 'lead',
                key: f.key,
                label: f.label,
                field_type: f.field_type,
                options: f.options,
                sort_order: f.sort_order,
                visible: true
            }
        })
    }

    console.log("Seeding complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
