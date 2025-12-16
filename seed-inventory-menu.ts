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
    console.log("Seeding Inventory & Purchasing Menus (corrected)...")

    try {
        // 1. CLEANUP OLD DUPLICATES (hms.* items that conflict with new modules)
        // We want to remove 'hms.products', 'hms.inventory', 'hms.suppliers', etc.
        // defined in the dump as children of HMS ('f391937f...')

        const duplicatesToRemove = [
            'hms.inventory',
            'hms.products',
            'hms.product_categories',
            'hms.product_batches',
            'hms.product_variants',
            'hms.suppliers',
            'hms.purchase_orders',
            'hms.adjustments',
            'hms.product_tax_rules',
            'hms.price_lists',
            'hms.uom',
            'hms.price_history',
            'purchase.orders' // Also remove old purchase module items if any
        ]

        console.log("Cleaning up old duplicate menu items...")
        const deleteResult = await prisma.menu_items.deleteMany({
            where: {
                key: { in: duplicatesToRemove }
            }
        })
        console.log(`Deleted ${deleteResult.count} duplicate items.`)


        // 2. SEED INVENTORY MODULE
        let invModule = await prisma.modules.findFirst({ where: { module_key: 'inventory' } })
        if (!invModule) {
            invModule = await prisma.modules.create({
                data: { module_key: 'inventory', name: 'Inventory', is_active: true, description: "Stock Management" }
            })
        }

        // Inventory Parent
        const invMenuKey = 'inventory-root'
        let invMenu = await prisma.menu_items.findFirst({ where: { key: invMenuKey } })
        if (!invMenu) {
            invMenu = await prisma.menu_items.create({
                data: { module_key: 'inventory', key: invMenuKey, label: 'Inventory', icon: 'Package', sort_order: 60, url: '/hms/inventory', is_global: true, permission_code: null }
            })
        } else {
            // Ensure url is correct
            await prisma.menu_items.update({ where: { id: invMenu.id }, data: { url: '/hms/inventory' } })
        }

        // Inventory Sub-items (Validated Paths)
        const invSubItems = [
            { key: 'inv-dashboard', label: 'Dashboard', url: '/hms/inventory', icon: 'LayoutDashboard', sort: 10, is_global: true, permission_code: null },
            { key: 'inventory.products', label: 'Products', url: '/hms/inventory/products', icon: 'Package', sort: 20, is_global: true, permission_code: null },
            { key: 'inv-receive', label: 'Receive Stock', url: '/hms/inventory/operations/receive', icon: 'Download', sort: 30, is_global: true, permission_code: null },
            // { key: 'inv-moves', label: 'Stock Moves', url: '/hms/inventory/moves', icon: 'ArrowRightLeft', sort: 40 }, // Path does not exist yet
        ]

        for (const item of invSubItems) {
            const exists = await prisma.menu_items.findFirst({ where: { key: item.key } })
            if (!exists) {
                console.log(`Creating ${item.label}...`)
                await prisma.menu_items.create({
                    data: { module_key: 'inventory', key: item.key, label: item.label, url: item.url, icon: item.icon, sort_order: item.sort, parent_id: invMenu.id, is_global: !!item.is_global, permission_code: item.permission_code }
                })
            } else {
                console.log(`Updating ${item.label} URL...`)
                await prisma.menu_items.update({
                    where: { id: exists.id },
                    data: { url: item.url, parent_id: invMenu.id, module_key: 'inventory' }
                })
            }
        }


        // 3. SEED PURCHASING MODULE
        let purchModule = await prisma.modules.findFirst({ where: { module_key: 'purchasing' } })
        if (!purchModule) {
            purchModule = await prisma.modules.create({
                data: { module_key: 'purchasing', name: 'Purchasing', is_active: true, description: "Vendor Management" }
            })
        }

        // Purchasing Parent
        const purchMenuKey = 'purchasing-root'
        let purchMenu = await prisma.menu_items.findFirst({ where: { key: purchMenuKey } })
        if (!purchMenu) {
            purchMenu = await prisma.menu_items.create({
                data: { module_key: 'purchasing', key: purchMenuKey, label: 'Purchasing', icon: 'Truck', sort_order: 70, url: '/hms/purchasing', is_global: true, permission_code: null }
            })
        }

        // Purchasing Sub-items 
        // Note: '/hms/suppliers' path was missing in checks, using placeholder or check if it's meant to be something else.
        // I will point to '/hms/inventory' for now as placeholder to avoid 404, or commented out.
        // User asked "Where is purchase menu", so I should add it even if link is dead/WIP.
        const purchSubItems = [
            { key: 'purch-suppliers', label: 'Suppliers', url: '/hms/inventory/suppliers', icon: 'Users', sort: 10, is_global: true, permission_code: null },
        ]

        for (const item of purchSubItems) {
            const exists = await prisma.menu_items.findFirst({ where: { key: item.key } })
            if (!exists) {
                console.log(`Creating ${item.label}...`)
                await prisma.menu_items.create({
                    data: { module_key: 'purchasing', key: item.key, label: item.label, url: item.url, icon: item.icon, sort_order: item.sort, parent_id: purchMenu.id, is_global: !!item.is_global, permission_code: item.permission_code }
                })
            } else {
                await prisma.menu_items.update({
                    where: { id: exists.id },
                    data: { url: item.url, parent_id: purchMenu.id, is_global: !!item.is_global, permission_code: item.permission_code }
                })
            }
        }

        console.log("Inventory & Purchasing Menus Fixed.")

    } catch (e) {
        console.error("Error seeding inventory menu:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
