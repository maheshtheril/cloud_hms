
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const locations = await prisma.hms_stock_location.findMany();
    console.log('Stock Locations:', JSON.stringify(locations, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
