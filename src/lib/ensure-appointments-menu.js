
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const fs = require('fs')
const path = require('path')

// Load .env
try {
    const envPath = path.resolve(__dirname, '../../.env')
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8')
        envFile.split('\n').forEach(line => {
            const parts = line.split('=')
            if (parts.length >= 2) process.env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '')
        })
    }
} catch (e) { }

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: true })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Checking Appointments Menu Item...')

    const existingItem = await prisma.menu_items.findFirst({
        where: {
            OR: [
                { label: 'Appointments' },
                { key: 'hms.appointments' }
            ]
        }
    })

    if (existingItem) {
        console.log('✅ Appointments menu item already exists:', existingItem)
        if (existingItem.url !== '/hms/appointments') {
            await prisma.menu_items.update({
                where: { id: existingItem.id },
                data: { url: '/hms/appointments' }
            })
            console.log('🔄 Updated URL to /hms/appointments')
        }
    } else {
        console.log('➕ Creating Appointments menu item...')
        // Find a suitable parent? Or root.
        // Let's put it at root with 'hms' module key logic if we can guess, 
        // or just 'general'/null if not strict.
        // Based on fix-menu.js, module_key is likely 'hms' or 'clinic'.
        // We'll check existing modules or items to guess.

        const generalModule = await prisma.modules.findFirst({
            where: { module_key: 'general' }
        }) || { module_key: 'general' }; // Fallback

        await prisma.menu_items.create({
            data: {
                module_key: generalModule.module_key,
                key: 'hms.appointments',
                label: 'Appointments',
                icon: 'Calendar',
                url: '/hms/appointments',
                sort_order: 2, // Put it early
                is_global: true
            }
        })
        console.log('✅ Created Appointments menu item')
    }
}

main()
    .then(async () => { await prisma.$disconnect(); await pool.end() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1) })
