
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

async function check() {
    console.log("--- FINAL COA CHECK ---")
    const cash = await prisma.accounts.findFirst({ where: { code: '1610' }, include: { currencies: true } })
    if (cash) {
        console.log(`CASH found: [${cash.code}] ${cash.name}`)
        const parent = await prisma.accounts.findUnique({ where: { id: cash.parent_id! } })
        console.log(`CASH Parent: [${parent?.code}] ${parent?.name}`)
        if (parent?.parent_id) {
            const grandParent = await prisma.accounts.findUnique({ where: { id: parent.parent_id } })
            console.log(`CASH Grand-Parent: [${grandParent?.code}] ${grandParent?.name}`)
        }
    } else {
        console.log("CASH (1610) NOT FOUND")
    }

    const fixedAssets = await prisma.accounts.findFirst({ where: { code: '1000' } })
    console.log(`FIXED ASSETS found: [${fixedAssets?.code}] ${fixedAssets?.name}`)
    
    console.log("--- CHECK COMPLETE ---")
}

check().catch(console.error).finally(() => prisma.$disconnect())
