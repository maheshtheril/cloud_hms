const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const fs = require('fs')
const path = require('path')

// Load .env manually
try {
    const envPath = path.resolve(__dirname, '../../.env')
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8')
        envFile.split('\n').forEach(line => {
            const parts = line.split('=')
            if (parts.length >= 2) {
                const key = parts[0].trim()
                const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '') // remove quotes
                if (key && val) process.env[key] = val
            }
        })
        console.log('✅ Loaded .env file')
    }
} catch (e) {
    console.log('⚠️ Could not load .env:', e.message)
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    console.error('❌ DATABASE_URL not found')
    process.exit(1)
}

const pool = new Pool({ connectionString, ssl: true }) // Added ssl: true to match app
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
            let hmsModule = await prisma.modules.findFirst({ where: { module_key: 'hms' } })
            if (!hmsModule) {
                // Try to find any module to link to, or create general
                hmsModule = await prisma.modules.findFirst()
            }

            if (hmsModule) {
                await prisma.menu_items.create({
                    data: {
                        module_key: hmsModule.module_key,
                        key: 'billing',
                        label: 'Billing',
                        url: '/hms/billing',
                        icon: 'Receipt',
                        sort_order: 50,
                        is_global: true
                    }
                })
                console.log('✨ Created Billing Menu Item linked to:', hmsModule.module_key)
            } else {
                console.log('❌ Could not find any module to attach menu to.')
            }
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
        await pool.end()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        await pool.end()
        process.exit(1)
    })
