
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTaxes() {
    console.log("Checking Taxes in DB...");

    try {
        const taxRates = await prisma.tax_rates.findMany();
        console.log(`Found ${taxRates.length} global tax_rates`);
        if (taxRates.length > 0) console.log('First global tax:', taxRates[0]);

        const companyTaxes = await prisma.company_taxes.findMany();
        console.log(`Found ${companyTaxes.length} company_taxes`);
        if (companyTaxes.length > 0) console.log('First company tax:', companyTaxes[0]);

        const taxMaps = await prisma.company_tax_maps.findMany();
        console.log(`Found ${taxMaps.length} company_tax_maps`);

    } catch (error) {
        console.error("Error querying taxes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTaxes();
