import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Seeding Billing Menu...")

    try {
        // 1. Ensure 'billing' module exists
        // We need to know the 'modules' table structure. 
        // Based on navigation.ts, it has module_key, name, is_active.
        // Let's try to find it or create it.

        let billingModule = await prisma.modules.findFirst({
            where: { module_key: 'billing' }
        })

        if (!billingModule) {
            console.log("Creating 'billing' module...")
            billingModule = await prisma.modules.create({
                data: {
                    module_key: 'billing',
                    name: 'Billing',
                    is_active: true,
                    description: "Invoicing and Payments"
                }
            })
        } else {
            console.log("'billing' module exists.")
            // Ensure it's active
            if (!billingModule.is_active) {
                await prisma.modules.update({
                    where: { id: billingModule.id },
                    data: { is_active: true }
                })
            }
        }

        // 2. Upsert 'Billing' Parent Menu Item
        // We use 'key' as a unique identifier if possible, or label + module_key
        const billingMenuKey = 'billing-root'

        let billingMenu = await prisma.menu_items.findFirst({
            where: { key: billingMenuKey }
        })

        if (!billingMenu) {
            console.log("Creating 'Billing' root menu...")
            billingMenu = await prisma.menu_items.create({
                data: {
                    module_key: 'billing',
                    key: billingMenuKey,
                    label: 'Billing',
                    icon: 'Receipt',
                    sort_order: 50,
                    url: '/hms/billing' // Determine if root helps or hinders. Usually root is just a folder if it has children.
                }
            })
        }

        // 3. Sub-items
        const subItems = [
            { key: 'billing-new', label: 'New Invoice', url: '/hms/billing/new', icon: 'PlusCircle', sort: 10 },
            { key: 'billing-list', label: 'All Invoices', url: '/hms/billing', icon: 'List', sort: 20 },
        ]

        for (const item of subItems) {
            const exists = await prisma.menu_items.findFirst({ where: { key: item.key } })
            if (!exists) {
                console.log(`Creating ${item.label}...`)
                await prisma.menu_items.create({
                    data: {
                        module_key: 'billing',
                        key: item.key,
                        label: item.label,
                        url: item.url,
                        icon: item.icon,
                        sort_order: item.sort,
                        parent_id: billingMenu.id
                    }
                })
            } else {
                console.log(`Updating ${item.label}...`)
                // Ensure parent is correct in case of moves
                await prisma.menu_items.update({
                    where: { id: exists.id },
                    data: { parent_id: billingMenu.id, url: item.url }
                })
            }
        }

        console.log("Billing Menu Seeded Successfully.")

    } catch (e) {
        console.error("Error seeding menu:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
