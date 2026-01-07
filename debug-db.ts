import { prisma } from "./src/lib/prisma";

async function main() {
    try {
        const item = await prisma.menu_items.findFirst();
        console.log("Sample Item:", JSON.stringify(item, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
