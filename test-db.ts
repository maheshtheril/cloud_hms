import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
        },
    },
});

async function run() {
    try {
        console.log("Connecting...");
        await prisma.$connect();
        console.log("Connected to Neon DB successfully.");

        // Check if countries/currencies are empty
        const countries = await prisma.countries.count();
        console.log("Countries count:", countries);

        const currencies = await prisma.currencies.count();
        console.log("Currencies count:", currencies);

        const uomcat = await prisma.hms_uom_category.count();
        console.log("UOM Category count:", uomcat);

    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        await prisma.$disconnect();
    }
}
run();
