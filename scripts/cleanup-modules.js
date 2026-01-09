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
    console.log("Starting Deep Cleanup...");

    const remappings = {
        'Dashboard': 'System',
        'Settings': 'System',
        'User': 'System',
        'Users': 'System',
        'permission': 'System',
        'Permissions': 'System',
        'Auth': 'System'
    };

    // 1. Remap Permissions
    for (const [oldCat, newCat] of Object.entries(remappings)) {
        await prisma.permission.updateMany({
            where: { category: oldCat },
            data: { category: newCat }
        });
    }

    // 2. Locate and Destroy Garbage Modules
    const garbageKeys = Object.keys(remappings).map(k => k.toLowerCase());

    const targets = await prisma.modules.findMany({
        where: { module_key: { in: garbageKeys } }
    });

    for (const mod of targets) {
        console.log(`Destroying Module: ${mod.name} (Key: ${mod.module_key}, ID: ${mod.id})...`);

        // Soft Delete (Hide from UI) because FK constraints might be complex
        console.log(`  - Soft Deleting (is_active = false)...`);
        await prisma.modules.update({
            where: { id: mod.id },
            data: { is_active: false }
        });
        console.log(`  - Module hidden.`);
    }

    console.log("Cleanup Complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
