
import { prisma } from "../src/lib/prisma";

async function cleanupDuplicates() {
    console.log("Starting menu deduplication...");

    // 1. Get all menu items
    const items = await prisma.menu_items.findMany();

    // Map to track identifying labels and URLs
    // Key: label + "|" + url
    const uniqueItems = new Map();
    const toDelete = [];

    for (const item of items) {
        const identifier = `${item.label}|${item.url}`.toLowerCase();

        if (uniqueItems.has(identifier)) {
            const existing = uniqueItems.get(identifier);
            // Decide which one to keep. Prefer newer keys or global ones.
            // Let's keep the one that matches our NEW key standards if possible.
            const isNewKey = item.key.includes('-') || ['users', 'roles', 'general-settings'].includes(item.key);
            const existingIsNewKey = existing.key.includes('-') || ['users', 'roles', 'general-settings'].includes(existing.key);

            if (isNewKey && !existingIsNewKey) {
                toDelete.push(existing.id);
                uniqueItems.set(identifier, item);
            } else {
                toDelete.push(item.id);
            }
        } else {
            uniqueItems.set(identifier, item);
        }
    }

    if (toDelete.length > 0) {
        console.log(`🧹 DELETED ${toDelete.length} duplicate menu items.`);
        await prisma.menu_items.deleteMany({
            where: { id: { in: toDelete } }
        });
        console.log("-----------------------------------------");
        console.log("✅ Cleanup complete.");
    } else {
        console.log("✨ No duplicates found. Everything is clean!");
    }
}

cleanupDuplicates()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
