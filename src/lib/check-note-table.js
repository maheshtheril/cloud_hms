
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
    console.log('🔍 Checking for hms_clinical_note table...')

    const result = await prisma.$queryRaw`
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hms_clinical_note'
    );
  `

    console.log('Exists?', result[0].exists)
}

main()
    .then(async () => { await prisma.$disconnect(); await pool.end() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1) })
