import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

async function check() {
    const tables = ['hms_invoice', 'hms_invoice_lines'];

    for (const table of tables) {
        console.log(`\n--- DB SCHEMA CHECK (${table}) ---`);
        try {
            const columns: any[] = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = '${table}'
      `);
            console.table(columns);
        } catch (err) {
            console.error(`Query failed for ${table}:`, err);
        }
    }
    await prisma.$disconnect();
}

check();
