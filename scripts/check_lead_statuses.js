
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const statuses = await prisma.crm_leads.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });
        console.log("Distinct statuses in crm_leads:", statuses);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
