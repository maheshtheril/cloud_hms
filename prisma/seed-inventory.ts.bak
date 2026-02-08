
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Seeding Inventory menu item...')

    // Check if it exists
    const existing = await prisma.menu_items.findFirst({
        where: { key: 'inventory' }
    })

    if (existing) {
        console.log('Inventory menu item already exists. Updating properties...')
        await prisma.menu_items.update({
            where: { id: existing.id },
            data: {
                label: 'Inventory',
                icon: 'Package', // Lucide icon name
                url: '/hms/inventory',
                module_key: 'inventory',
                is_global: true,
                sort_order: 30 // Adjust as needed
            }
        })
    } else {
        console.log('Creating Inventory menu item...')
        await prisma.menu_items.create({
            data: {
                key: 'inventory',
                label: 'Inventory',
                icon: 'Package',
                url: '/hms/inventory',
                module_key: 'inventory',
                is_global: true,
                sort_order: 30
            }
        })
    }

    console.log('✅ Inventory menu seeded.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
