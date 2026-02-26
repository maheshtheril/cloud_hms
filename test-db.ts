import { getMenuItems } from './src/app/actions/navigation';

async function main() {
    console.log("Testing Navigation Action...");
    try {
        const start = Date.now();
        const items = await getMenuItems();
        console.log(`Success! Found ${items.length} menu groups.`);
        console.log(JSON.stringify(items.map(i => ({ module: i.module.name, items: i.items.length })), null, 2));
        console.log(`Latency: ${Date.now() - start}ms`);
        process.exit(0);
    } catch (error) {
        console.error("Action Failed!");
        console.error(error);
        process.exit(1);
    }
}

main();
