
import { PrismaClient } from '@prisma/client'
import { getMenuItems } from '../app/actions/navigation'

// Mock auth since we can't easily fake the session in a standalone script without more setup
// We will modify this to just test the logic or use a lightweight version of the logic
const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying Menu Hierarchy...')

    // 1. Check if 'Billing' module exists
    const billingModule = await prisma.modules.findFirst({
        where: { module_key: { contains: 'billing', mode: 'insensitive' } }
    })

    if (billingModule) {
        console.log(`✅ Found Billing Module: ${billingModule.name} (${billingModule.module_key})`)
    } else {
        console.log('❌ Billing Module NOT found in `modules` table.')
    }

    // 2. Check menu items
    const billingMenu = await prisma.menu_items.findFirst({
        where: {
            OR: [
                { label: { contains: 'Billing', mode: 'insensitive' } },
                { key: { contains: 'billing', mode: 'insensitive' } }
            ]
        }
    })

    if (billingMenu) {
        console.log(`✅ Found Billing Menu Item: ${billingMenu.label} (URL: ${billingMenu.url})`)
    } else {
        console.log('❌ Billing Menu Item NOT found in `menu_items` table.')

        // Attempt to fix if missing
        console.log('⚠️ Attempting to create missing Billing menu...')
        try {
            const hmsModule = await prisma.modules.findFirst({ where: { module_key: 'hms' } }) ||
                await prisma.modules.create({ data: { module_key: 'hms', name: 'Health Management' } })

            await prisma.menu_items.create({
                data: {
                    module_key: 'hms',
                    key: 'billing',
                    label: 'Billing',
                    url: '/hms/billing',
                    icon: 'Receipt',
                    sort_order: 50,
                    is_global: true
                }
            })
            console.log('✨ Created Billing Menu Item.')
        } catch (e) {
            console.error('Failed to create menu:', e)
        }
    }

    // 3. Dump full tree structure (simulated)
    const items = await prisma.menu_items.findMany({
        orderBy: { sort_order: 'asc' }
    })

    console.log('\n--- Current Menu Structure (Flat) ---')
    items.forEach(i => {
        console.log(`[${i.module_key}] ${i.label} -> ${i.url}`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
