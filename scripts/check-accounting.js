const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Checking for Accounting permissions...");
    const perms = await prisma.permission.findMany({
        where: { category: { contains: 'Account', mode: 'insensitive' } }
    });

    if (perms.length > 0) {
        console.log("Found Bad Permissions:");
        perms.forEach(p => console.log(` - ${p.code} (${p.name}) [Cat: ${p.category}]`));
    } else {
        console.log("No 'Account' permissions found in DB.");
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
