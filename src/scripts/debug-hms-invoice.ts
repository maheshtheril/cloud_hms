import { prisma } from '@/lib/prisma'

async function main() {
  console.log('Starting debug with project prisma...')
  try {
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Connection test:', testQuery)

    const triggers = await prisma.$queryRaw`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table LIKE 'hms_invoice%'
    `
    console.log('Triggers:', JSON.stringify(triggers, null, 2))

    const cols = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'hms_invoice' AND column_name = 'status'
    `
    console.log('Column info:', JSON.stringify(cols, null, 2))
  } catch (err) {
    console.error('Error during debug:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
