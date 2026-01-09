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
    // 1. Get Distinct Create Permissions (from DB)
    // Note: Standard permissions in rbac.ts are NOT in DB unless seeded.
    // If getAllPermissions merges them, we need to check THAT list.
    // But here we check DB only.

    const dbPermissions = await prisma.permission.findMany();
    const used = new Set(dbPermissions.map(p => p.category));

    // Hardcoded ones from RBAC.Ts (We simulate them here since we can't import TS easily in JS script)
    // 'HMS', 'CRM', 'Inventory', 'Finance', 'System' are standard.
    ['HMS', 'CRM', 'Inventory', 'Finance', 'Purchasing'].forEach(c => used.add(c));

    // 2. Get Modules
    const modules = await prisma.modules.findMany();
    const existing = new Set(modules.map(m => m.module_key.toLowerCase()));

    console.log(`Used Categories (Count: ${used.size}): ${Array.from(used).sort().join(', ')}`);
    console.log(`Existing Modules (Count: ${existing.size}): ${Array.from(existing).sort().join(', ')}`);

    const missing = [];
    used.forEach(cat => {
        // Simple normalization check
        if (!existing.has(cat.toLowerCase())) missing.push(cat);
    });

    if (missing.length > 0) {
        console.log(`⚠️ MISSING MODULES IN DB: ${missing.join(', ')}`);
    } else {
        console.log("✅ All used categories exist in Modules table. No insertion needed.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
