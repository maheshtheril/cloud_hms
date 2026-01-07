import { ensureAccountingMenu } from "./src/lib/menu-seeder";

async function main() {
    console.log("Seeding menus...");
    await ensureAccountingMenu();
    console.log("Done.");
}

main().catch(console.error);
