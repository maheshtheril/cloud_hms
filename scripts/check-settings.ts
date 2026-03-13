import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Checking WhatsApp Settings...")
    const settings = await prisma.hms_settings.findMany({
        where: {
            key: 'whatsapp_config'
        }
    })
    
    console.log("Found", settings.length, "WhatsApp settings records.")
    settings.forEach(s => {
        const val = s.value as any;
        console.log(`ID: ${s.id}, Company: ${s.company_id}, Tenant: ${s.tenant_id}, Has Token: ${!!(val && val.token)}, Token Length: ${val?.token?.length || 0}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
