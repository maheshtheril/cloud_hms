import { prisma } from "@/lib/prisma"

async function main() {
    console.log('Checking Table Existence...');
    try {
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%journal%'
    `;
        console.log('Tables found:', JSON.stringify(tables, null, 2));

        // Try selecting from journal_entries using raw SQL to verify column names
        try {
            const rawEntries = await prisma.$queryRaw`SELECT * FROM "journal_entries" LIMIT 1`;
            console.log('Raw Select Success:', rawEntries);
        } catch (e) {
            console.log('Raw Select Failed (journal_entries):', e.message);
        }

    } catch (e) {
        console.error(e);
    }
}

main();
