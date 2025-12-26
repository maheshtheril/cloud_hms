
import { prisma } from "@/lib/prisma"

async function main() {
    console.log('Checking Table via Raw SQL...');
    try {
        const result = await prisma.$queryRaw`SELECT count(*) as count FROM "journal_entries"`;
        console.log('Raw Count Result:', result);
    } catch (e) {
        console.error('Raw Query Error:', e.message);
    }
}

main();
