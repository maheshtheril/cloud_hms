require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("--- WHATSAPP SETTINGS DIAGNOSTIC (ENV aware) ---")
    console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length || 0)
    
    try {
        const allSettings = await prisma.hms_settings.findMany({
            where: { key: 'whatsapp_config' }
        })
        
        console.log(`Found ${allSettings.length} records.`)
        allSettings.forEach(s => {
            const val = s.value;
            console.log({
                id: s.id,
                company_id: s.company_id,
                tenant_id: s.tenant_id,
                has_token: !!(val && val.token),
                token_length: val?.token?.length || 0,
                scope: s.scope,
                is_active: s.is_active,
                key: s.key
            })
        })
    } catch (e) {
        console.error("Query failed:", e.message)
    } finally {
        await prisma.$disconnect()
    }
    console.log("--- END ---")
}

main()
