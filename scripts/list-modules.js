const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

console.log('DB URL Length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'MISSING');

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Fetching modules...');
    const modules = await prisma.modules.findMany({
        orderBy: { module_key: 'asc' }
    });

    const output = modules.map(m => `[${m.is_active ? 'ACTIVE' : 'HIDDEN'}] ${m.module_key} : ${m.name}`).join('\n');

    console.log("--- MODULES LIST ---");
    console.log(output);
    console.log("Total:", modules.length);

    const fs = require('fs');
    fs.writeFileSync('modules_list_fresh.txt', output);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
