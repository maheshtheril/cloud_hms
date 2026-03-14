import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("--- WHATSAPP SETTINGS DIAGNOSTIC ---")
    const allSettings = await prisma.hms_settings.findMany({
        where: { key: 'whatsapp_config' }
    })
    
    console.log(`Found ${allSettings.length} records.`)
    allSettings.forEach(s => {
        const val = s.value as any;
        console.log({
            id: s.id,
            company_id: s.company_id,
            tenant_id: s.tenant_id,
            has_token: !!(val && val.token),
            token_length: val?.token?.length || 0,
            scope: s.scope,
            is_active: s.is_active
        })
    })
    console.log("--- END ---")
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
