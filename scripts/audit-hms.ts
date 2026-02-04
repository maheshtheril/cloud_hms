import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

async function audit() {
    console.log("--- HMS CONFIG & PRODUCT AUDIT ---");

    // 1. Check Settings
    const settings = await prisma.hms_settings.findMany({
        where: { key: 'registration_config' }
    });
    console.log("\n[Settings Found]:", settings.length);
    settings.forEach(s => {
        console.log(`- ID: ${s.id} | Co: ${s.company_id} | Value:`, JSON.stringify(s.value));
    });

    // 2. Check Products
    const products = await prisma.hms_product.findMany({
        where: {
            OR: [
                { sku: { startsWith: 'REG-FEE' } },
                { name: { contains: 'Registration Fee', mode: 'insensitive' } }
            ]
        }
    });
    console.log("\n[Products Found]:", products.length);
    products.forEach(p => {
        console.log(`- ID: ${p.id} | Name: ${p.name} | SKU: ${p.sku} | Co: ${p.company_id} | Price: ${p.price}`);
    });

    await prisma.$disconnect();
}

audit().catch(e => {
    console.error(e);
    process.exit(1);
});
