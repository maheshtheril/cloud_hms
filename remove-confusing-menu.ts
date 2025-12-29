import { prisma } from './src/lib/prisma';

async function main() {
    try {
        console.log("Removing 'Purchase Bills' menu...");

        // Find the menu item for bills
        const billMenu = await prisma.menu_items.findFirst({
            where: {
                url: { contains: '/accounting/bills' }
            }
        });

        if (billMenu) {
            console.log(`Found menu: ${billMenu.label} (ID: ${billMenu.id})`);
            await prisma.menu_items.delete({
                where: { id: billMenu.id }
            });
            console.log("Deleted.");
        } else {
            console.log("Menu item not found or already deleted.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
