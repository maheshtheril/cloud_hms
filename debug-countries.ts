import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Fetching countries...');
        const countries = await prisma.countries.findMany({
            where: { is_active: true },
            select: { id: true, name: true, iso2: true }
        });
        console.log(`Found ${countries.length} countries.`);
        if (countries.length > 0) {
            console.log('First 3 countries:', countries.slice(0, 3));
        }
    } catch (err) {
        console.error('Error fetching countries:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
