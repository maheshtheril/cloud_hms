import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Checking last user...')
    const user = await prisma.app_user.findFirst({
        orderBy: { created_at: 'desc' }, // Assuming created_at exists, or use default ordering if ID is uuid (not reliable for time)
        // If no created_at, we might need another way. Let's check schema.
    })

    if (!user) {
        console.log('No users found.')
        return
    }

    console.log('User:', user.email, 'Tenant:', user.tenant_id)

    let company = null;
    if (user.company_id) {
        company = await prisma.company.findFirst({
            where: { id: user.company_id }
        })
    }
    console.log('Company Industry:', company?.industry)

    const modules = await prisma.tenant_module.findMany({
        where: { tenant_id: user.tenant_id }
    })
    console.log('Modules:', modules.map(m => `${m.module_key} (enabled: ${m.enabled})`))

    const isHealthcare = !company?.industry || company.industry === 'Healthcare' || company.industry === 'Hospital';
    const hasCRM = modules.some(m => m.module_key === 'crm' && m.enabled);
    const hasHMS = modules.some(m => m.module_key === 'hms' && m.enabled);

    console.log('Logic Check:')
    console.log('isHealthcare:', isHealthcare)
    console.log('hasCRM:', hasCRM)
    console.log('hasHMS:', hasHMS)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
