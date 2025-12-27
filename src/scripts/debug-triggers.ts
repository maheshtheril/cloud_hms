
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Fetching triggers for hms_invoice and hms_invoice_lines...')

    const tables = ['hms_invoice', 'hms_invoice_lines']

    for (const table of tables) {
        console.log(`\n--- Triggers on table: ${table} ---`)
        const triggers = await prisma.$queryRawUnsafe(`
      SELECT 
        tgname as trigger_name,
        proname as function_name,
        prosrc as source_code
      FROM pg_trigger
      JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
      JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
      WHERE pg_class.relname = '${table}'
      AND tgisinternal = false
    `)

        console.log(JSON.stringify(triggers, null, 2))
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
