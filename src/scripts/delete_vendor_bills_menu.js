
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Keys identified for "Vendor Bills"
        const keys = ['hms-accounting-bills', 'vendor-bills', 'acc-bills'];

        console.log(`Attempting to delete menu items with keys: ${keys.join(', ')}`);

        const deleted = await prisma.menu_items.deleteMany({
            where: {
                key: { in: keys }
            }
        });

        console.log(`Successfully deleted ${deleted.count} menu items.`);

    } catch (e) {
        console.error("Error deleting menu items:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
