
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTaxes() {
    console.log("Checking Taxes in DB...");

    try {
        const taxRates = await prisma.tax_rates.findMany();
        console.log(`Found ${taxRates.length} global tax_rates`);
        if (taxRates.length > 0) console.log(taxRates[0]);

        const companyTaxes = await prisma.company_taxes.findMany();
        console.log(`Found ${companyTaxes.length} company_taxes`);
        if (companyTaxes.length > 0) console.log(companyTaxes[0]);

        const taxMaps = await prisma.company_tax_maps.findMany();
        console.log(`Found ${taxMaps.length} company_tax_maps`);

        // Get a random company accounting settings
        const settings = await prisma.company_accounting_settings.findFirst();
        // console.log("Accounting Settings Sample:", settings);

    } catch (error) {
        console.error("Error querying taxes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTaxes();
