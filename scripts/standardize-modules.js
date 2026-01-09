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
    console.log("Standardizing Modules...");

    // 1. Merge Accounting -> Finance
    console.log("Merging Accounting -> Finance...");
    await prisma.permission.updateMany({
        where: { category: { equals: 'Accounting', mode: 'insensitive' } },
        data: { category: 'Finance' }
    });

    // 2. Merge User/Role Mgmt -> System
    console.log("Merging User/Role Management -> System...");
    await prisma.permission.updateMany({
        where: { category: { in: ['User Management', 'Role Management'], mode: 'insensitive' } },
        data: { category: 'System' }
    });

    // 3. Fix 'system' module name
    console.log("Fixing System module naming...");
    await prisma.modules.updateMany({
        where: { module_key: 'system' },
        data: { name: 'System' }
    });

    // 4. Delete redundancy
    const toDelete = ['accounting', 'user management', 'role management'];
    console.log(`Deleting redundant modules: ${toDelete.join(', ')}`);

    for (const key of toDelete) {
        // Soft delete or hard delete?
        // Let's hard delete if possible, assuming we moved permissions.
        // We must also delete tenant_module references.

        const mod = await prisma.modules.findUnique({ where: { module_key: key } });
        if (mod) {
            // Soft Delete to avoid FK hell
            await prisma.modules.update({
                where: { id: mod.id },
                data: { is_active: false }
            });
            console.log(` - Soft Deleted (Hidden) ${key}`);
        }
    }

    console.log("Standardization Complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
