
import { prisma } from "@/lib/prisma"

async function main() {
    console.log('Prisma Client Keys:', Object.keys(prisma));
    // check specific keys
    console.log('journal_entries exists?', 'journal_entries' in prisma);
    console.log('journalEntry exists?', 'journalEntry' in prisma);
    console.log('JournalEntries exists?', 'JournalEntries' in prisma);
}

main();
