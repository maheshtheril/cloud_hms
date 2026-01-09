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
    console.log("Starting Hard Cleanup (Phase 2)...");

    const map = {
        'accounting': 'finance',
        'dashboard': 'system'
    };

    // 1. Resolve IDs
    const targetIds = {};
    for (const key of new Set(Object.values(map))) {
        const m = await prisma.modules.findUnique({ where: { module_key: key } });
        if (m) {
            targetIds[key] = m.id;
        } else {
            console.error(`CRITICAL: Target module '${key}' not found!`);
        }
    }

    // 2. Process
    for (const [garbageKey, targetKey] of Object.entries(map)) {
        const garbage = await prisma.modules.findUnique({ where: { module_key: garbageKey } });
        const targetId = targetIds[targetKey];

        if (!garbage) {
            console.log(`Garbage module '${garbageKey}' not found (already deleted?). Skipping.`);
            continue;
        }
        if (!targetId) {
            console.log(`Target ID missing for '${targetKey}'. Skipping.`);
            continue;
        }

        console.log(`\nProcessing ${garbageKey} -> ${targetKey}...`);

        // A. Handle tenant_module references
        // We use raw queries to correctly handle the join/check logic
        try {
            const garbageTMs = await prisma.$queryRawUnsafe(`SELECT * FROM "tenant_module" WHERE "module_id" = $1`, garbage.id);

            if (Array.isArray(garbageTMs)) {
                console.log(`Found ${garbageTMs.length} tenant associations.`);

                for (const tm of garbageTMs) {
                    // Check if tenant already has the target module assigned
                    const existingTarget = await prisma.$queryRawUnsafe(
                        `SELECT * FROM "tenant_module" WHERE "tenant_id" = $1 AND "module_id" = $2`,
                        tm.tenant_id, targetId
                    );

                    if (Array.isArray(existingTarget) && existingTarget.length > 0) {
                        // Tenant has target already. Delete garbage link.
                        await prisma.$executeRawUnsafe(
                            `DELETE FROM "tenant_module" WHERE "id" = $1`,
                            tm.id
                        );
                    } else {
                        // Move garbage link to target.
                        await prisma.$executeRawUnsafe(
                            `UPDATE "tenant_module" SET "module_id" = $1 WHERE "id" = $2`,
                            targetId, tm.id
                        );
                    }
                }
            }
        } catch (e) {
            console.error("Error processing tenant_module:", e);
        }

        // A2. Handle module_menu_map references (Based on module_key)
        try {
            // Check/Delete from module_menu_map
            const menuCount = await prisma.module_menu_map.count({ where: { module_key: garbageKey } });
            if (menuCount > 0) {
                console.log(`Found ${menuCount} menu map entries. Deleting...`);
                await prisma.module_menu_map.deleteMany({ where: { module_key: garbageKey } });
            }
        } catch (e) {
            console.error("Error processing module_menu_map:", e.message);
            // Fallback raw query if prisma model name is different
            try {
                await prisma.$executeRawUnsafe(`DELETE FROM "module_menu_map" WHERE "module_key" = $1`, garbageKey);
            } catch (rawE) {
                console.error("Raw delete failed:", rawE.message);
            }
        }

        // B. Hard Delete Module
        try {
            await prisma.modules.delete({ where: { id: garbage.id } });
            console.log(`✅ Permanently deleted module: ${garbageKey}`);
        } catch (e) {
            console.error(`❌ Failed to delete ${garbageKey}:`, e.message);
        }
    }

    console.log("\nCleanup Complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
