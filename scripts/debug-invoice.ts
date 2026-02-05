import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()
const prisma = new PrismaClient()

async function check() {
    const table = 'hms_invoice';
    const columns: any[] = await prisma.$queryRawUnsafe(`
        SELECT column_name, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${table}' AND is_nullable = 'NO'
    `);
    console.log("MANDATORY COLUMNS (NOT NULL):");
    console.log(JSON.stringify(columns, null, 2));
    await prisma.$disconnect();
}
check();
