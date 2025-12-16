
import 'dotenv/config';
import { prisma } from './prisma';

async function main() {
    console.log('Successfully initialized PrismaClient');
    try {
        const count = await prisma.countries.count();
        console.log(`Connection successful. Countries count: ${count}`);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
