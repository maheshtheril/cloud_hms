
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function diagnose() {
    console.log("--- COA HIERARCHY DIAGNOSIS ---")
    const accounts = await prisma.accounts.findMany({
        orderBy: { code: 'asc' }
    })

    for (const acc of accounts) {
        let parentInfo = "ROOT"
        if (acc.parent_id) {
            const parent = accounts.find(a => a.id === acc.parent_id)
            parentInfo = parent ? `[${parent.code}] ${parent.name}` : "MISSING PARENT"
        }
        console.log(`[${acc.code}] ${acc.name} (${acc.type}) | Parent: ${parentInfo} | Group: ${acc.is_group}`)
    }
    console.log("--- DIAGNOSIS COMPLETE ---")
}

diagnose().catch(console.error).finally(() => prisma.$disconnect())
