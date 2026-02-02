import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning up duplicate menu items...')

    // 1. Fetch all menu items
    const allItems = await prisma.menu_items.findMany({
        orderBy: { created_at: 'asc' }
    })

    const seenKeys = new Set()
    const toDelete = []

    for (const item of allItems) {
        if (seenKeys.has(item.key)) {
            toDelete.push(item.id)
        } else {
            seenKeys.add(item.key)
        }
    }

    console.log(`Found ${toDelete.length} duplicates to delete.`)

    if (toDelete.length > 0) {
        await prisma.menu_items.deleteMany({
            where: {
                id: { in: toDelete }
            }
        })
        console.log('Deleted duplicates successfully.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
