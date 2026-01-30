
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Querying...');
        const user = await prisma.app_user.findFirst({ where: { email: 'test@example.com' } });
        console.log('User:', user);
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
