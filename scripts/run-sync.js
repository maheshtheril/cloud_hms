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
    console.log("Running Sync...");
    // 1. Get Distinct Permissions
    const dbPermissions = await prisma.permission.findMany();
    const used = new Set(dbPermissions.map(p => p.category));

    // Add Core defaults that might be in code but not DB permissions yet
    ['HMS', 'CRM', 'Inventory', 'Finance', 'System'].forEach(c => used.add(c));

    // 2. Get Modules
    const modules = await prisma.modules.findMany();
    const existing = new Set(modules.map(m => m.module_key.toLowerCase()));

    const missing = [];
    used.forEach(cat => {
        if (!existing.has(cat.toLowerCase())) missing.push(cat);
    });

    console.log(`Missing from DB: ${missing.join(', ')}`);

    for (const cat of missing) {
        const key = cat.toLowerCase();
        console.log(`Inserting ${cat} (${key})...`);
        await prisma.modules.create({
            data: {
                module_key: key,
                name: cat,
                description: 'Auto-synced',
                is_active: true
            }
        });
    }
    console.log("Sync Complete.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
