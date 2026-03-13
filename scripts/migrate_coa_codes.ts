
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const connectionString = process.env.DATABASE_URL || '';

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MIGRATION_MAP: Record<string, string> = {
    '1500': '1010', // Office Equipment (Old 1500 -> New 1010)
    '1510': '1020', // Medical Equipment (Old 1510 -> New 1020)
    '1520': '1030', // Furniture (Old 1520 -> New 1030)
    '1100': '1500', // Current Assets (Old 1100 -> New 1500)
    '1110': '1600', // Cash Group (Old 1110 -> New 1600)
    '1120': '1700', // Bank Group (Old 1120 -> New 1700)
    '1050': '1710', // Bank Primary (Old 1050 -> New 1710)
    '1001': '1610', // Cash Ledger (Old 1001 -> New 1610)
    '1150': '1800', // Sundry Debtors (Old 1150 -> New 1800)
    '1200': '1810', // AR Patient (Old 1200 -> New 1810)
    '1210': '1820', // Insurance (Old 1210 -> New 1820)
    '1220': '1830', // Corporate (Old 1220 -> New 1830)
    '1400': '1900', // Inventory (Old 1400 -> New 1900)
    '2001': '2110', // AP Vendor (Old 2001 -> New 2110)
    '2010': '2120', // Accrued Exp (Old 2010 -> New 2120)
    '2201': '2210', // Output Tax (Old 2201 -> New 2210)
    '2210': '2220', // Input Tax (Old 2210 -> New 2220)
}

async function migrate() {
    console.log("--- MIGRATING COA CODES ---")
    
    // We need to be careful with unique constraints. 
    // Best to move to a temporary high range first if there are collisions, 
    // but since we are moving from 11xx to 15xx, 15xx to 10xx, it might be okay.
    // Let's do it in order or use temporary prefixes.

    const accounts = await prisma.accounts.findMany({
        where: { code: { in: Object.keys(MIGRATION_MAP) } }
    })

    console.log(`Found ${accounts.length} accounts to migrate.`)

    // Step 1: Move to temporary high range to avoid collisions
    for (const acc of accounts) {
        const tempCode = `TMP_${acc.code}_${acc.id.substring(0, 4)}`
        console.log(`Step 1: [${acc.code}] ${acc.name} -> [${tempCode}]`)
        try {
            await prisma.accounts.update({
                where: { id: acc.id },
                data: { code: tempCode }
            })
        } catch (e: any) {
            console.error(`Step 1 Failure for ${acc.name} (${acc.code}): ${e.message}`)
        }
    }

    // Step 2: Move to final target codes
    for (const acc of accounts) {
        const newCode = MIGRATION_MAP[acc.code]
        const tempCode = `TMP_${acc.code}_${acc.id.substring(0, 4)}`
        if (!newCode) continue;

        console.log(`Step 2: [${tempCode}] ${acc.name} -> [${newCode}]`)
        try {
            await prisma.accounts.update({
                where: { id: acc.id },
                data: { code: newCode }
            })
        } catch (e: any) {
            console.error(`Step 2 Failure for ${acc.name} (Target: ${newCode}): ${e.message}`)
        }
    }

    console.log("--- MIGRATION COMPLETE ---")
}

migrate().catch(console.error).finally(() => prisma.$disconnect())
