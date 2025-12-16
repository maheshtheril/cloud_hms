
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Listing all menu items...')
    const items = await prisma.menu_items.findMany({
        orderBy: { sort_order: 'asc' },
        include: {
            module_menu_map: {
                include: {
                    modules: true
                }
            }
        }
    })

    console.log('--- MENU ITEMS ---')
    items.forEach(i => {
        let mod = i.module_menu_map[0]?.modules?.name || i.module_key || 'General';
        console.log(`[${mod}] ${i.label} (Key: ${i.key}, URL: ${i.url}) Parent: ${i.parent_id}`)
    })
    console.log('------------------')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
