
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
    console.log('🛠️ Fixing Invoices Menu URL...')

    const invoicesItem = await prisma.menu_items.findFirst({
        where: { key: 'hms.billing.invoices' }
    })

    if (invoicesItem) {
        if (invoicesItem.url === '/hms/invoices') {
            await prisma.menu_items.update({
                where: { id: invoicesItem.id },
                data: { url: '/hms/billing' }
            })
            console.log(`✅ Updated Invoices URL from '/hms/invoices' to '/hms/billing'`)
        } else {
            console.log(`ℹ️ Invoices URL is already: ${invoicesItem.url}`)
        }
    } else {
        console.log('❌ Invoices menu item not found.')
    }
}

main()
    .then(async () => { await prisma.$disconnect(); await pool.end() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1) })
