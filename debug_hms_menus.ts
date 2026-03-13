
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const items = await prisma.menu_items.findMany({
    where: { 
        OR: [
            { module_key: 'hms' },
            { module_key: 'general' },
            { module_key: 'system' },
            { module_key: 'configuration' }
        ]
    },
    orderBy: { sort_order: 'asc' }
  })
  console.log(JSON.stringify(items, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
