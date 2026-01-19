
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("--- Executing Raw SQL Checks ---");

        console.log("\n1. COUNTRIES CHECK:");
        const countriesCount = await prisma.$queryRaw`SELECT count(*)::int as count FROM countries`;
        console.log("Total Countries:", countriesCount);

        const countries = await prisma.$queryRaw`SELECT iso2, iso3, name, is_active FROM countries LIMIT 5`;
        console.log("Sample Data:", countries);

        console.log("\n2. CURRENCIES CHECK:");
        const currenciesCount = await prisma.$queryRaw`SELECT count(*)::int as count FROM currencies`;
        console.log("Total Currencies:", currenciesCount);

        const currencies = await prisma.$queryRaw`SELECT code, name, symbol FROM currencies LIMIT 5`;
        console.log("Sample Data:", currencies);

    } catch (e) {
        console.error("Error executing raw queries:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
