
const { PrismaClient } = require('@prisma/client');

console.log('Modules loaded. Initializing PrismaClient...');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Successfully initialized PrismaClient instance.');
    try {
        const count = await prisma.countries.count();
        console.log(`Connection successful. Countries count: ${count}`);
    } catch (e) {
        console.error('Connection failed:', e);
        console.error('Error name:', e.name);
        console.error('Error message:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
