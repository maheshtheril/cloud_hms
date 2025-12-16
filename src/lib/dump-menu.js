
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
                const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '')
                if (key && val) process.env[key] = val
            }
        })
    }
} catch (e) { }

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: true })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🔍 Dumping ALL Menu Items...')

    const items = await prisma.menu_items.findMany({
        orderBy: { sort_order: 'asc' }
    })

    // Map for parent lookup
    const itemMap = new Map(items.map(i => [i.id, i]))

    console.log(`\n--- Total Items: ${items.length} ---`)
    items.forEach(i => {
        const parentLabel = i.parent_id && itemMap.get(i.parent_id) ? itemMap.get(i.parent_id).label : 'ROOT'
        console.log(`[${i.module_key}] ${parentLabel} > ${i.label} (${i.url})`)
    })
}

main()
    .then(async () => { await prisma.$disconnect(); await pool.end() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1) })
