
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

async function repair() {
    console.log("--- COA DATA REPAIR (FINAL) ---")
    
    // 1. Move Cash A/c (1002) to Cash on Hand (1600)
    const cashGroup = await prisma.accounts.findFirst({ where: { code: '1600', is_group: true } });
    const cashAc = await prisma.accounts.findFirst({ where: { code: '1002' } });

    if (cashAc && cashGroup) {
        console.log(`Moving ${cashAc.name} to ${cashGroup.name}`);
        await prisma.accounts.update({
            where: { id: cashAc.id },
            data: { parent_id: cashGroup.id, code: '1611' }
        });
    }

    // 2. Move HDFC Bank A/c (112001) to Bank Accounts (1700)
    const bankGroup = await prisma.accounts.findFirst({ where: { code: '1700', is_group: true } });
    const hdfcAc = await prisma.accounts.findFirst({ where: { code: '112001' } });

    if (hdfcAc && bankGroup) {
        console.log(`Moving ${hdfcAc.name} to ${bankGroup.name}`);
        await prisma.accounts.update({
            where: { id: hdfcAc.id },
            data: { parent_id: bankGroup.id, code: '1720' }
        });
    }

    // 3. Move misplaced Cash on Hand (1401)
    const cashLedger = await prisma.accounts.findFirst({ where: { code: '1401' } });
    if (cashLedger && cashGroup) {
        console.log(`Moving ${cashLedger.name} to ${cashGroup.name}`);
        await prisma.accounts.update({
            where: { id: cashLedger.id },
            data: { parent_id: cashGroup.id, code: '1612' }
        });
    }

    console.log("--- REPAIR COMPLETE ---")
}

repair().catch(console.error).finally(() => prisma.$disconnect())
