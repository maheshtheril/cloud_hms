
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
    console.log('🛠️ Restructuring Billing Menu...')

    const billingItem = await prisma.menu_items.findFirst({
        where: {
            OR: [
                { label: 'Billing' },
                { key: 'hms.billing' }
            ]
        }
    })

    if (!billingItem) {
        console.log('❌ Billing item not found, exiting.')
        return
    }

    console.log(`Found Billing Item: ${billingItem.label}, URL: ${billingItem.url}`)

    // 1. Update Billing to be a Container (no URL, or just a placeholder)
    // Actually, if we remove URL, some navs treat it as folder.
    // We'll keep it as a folder.

    await prisma.menu_items.update({
        where: { id: billingItem.id },
        data: {
            url: null, // Make it a folder
            icon: 'Receipt' // Ensure icon
        }
    })
    console.log('✅ Converted Billing to Folder (URL removed)')

    // 2. Create "Invoices" item under Billing
    // Check if check exists first
    const existingInvoices = await prisma.menu_items.findFirst({
        where: {
            label: 'Invoices',
            parent_id: billingItem.id
        }
    })

    if (!existingInvoices) {
        await prisma.menu_items.create({
            data: {
                module_key: billingItem.module_key,
                key: 'hms.billing.invoices',
                label: 'Invoices',
                url: '/hms/billing', // This is the dashboard
                parent_id: billingItem.id,
                sort_order: 10,
                is_global: true
            }
        })
        console.log('✅ Created Invoices Item under Billing')
    } else {
        console.log('ℹ️ Invoices Item already exists')
    }

    // 3. Ensure Payments is under Billing
    const paymentsItem = await prisma.menu_items.findFirst({
        where: {
            OR: [{ label: 'Payments' }, { key: 'hms.payments' }]
        }
    })

    if (paymentsItem) {
        if (paymentsItem.parent_id !== billingItem.id) {
            await prisma.menu_items.update({
                where: { id: paymentsItem.id },
                data: { parent_id: billingItem.id, sort_order: 20 }
            })
            console.log('✅ Moved Payments under Billing')
        } else {
            console.log('ℹ️ Payments is already under Billing')
        }
    }

    // 4. Create "New Invoice" item?
    const existingNewInvoice = await prisma.menu_items.findFirst({
        where: {
            label: 'New Invoice',
            parent_id: billingItem.id
        }
    })

    if (!existingNewInvoice) {
        await prisma.menu_items.create({
            data: {
                module_key: billingItem.module_key,
                key: 'hms.billing.new',
                label: 'New Invoice',
                url: '/hms/billing/new',
                parent_id: billingItem.id,
                sort_order: 5, // Top of list
                is_global: true,
                icon: 'Plus'
            }
        })
        console.log('✅ Created "New Invoice" Item')
    }

}

main()
    .then(async () => { await prisma.$disconnect(); await pool.end() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1) })
