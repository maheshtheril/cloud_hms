
const fs = require('fs');
const path = require('path');

// Load .env MANUALLY FIRST
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^(?:export\s+)?([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[match[1].trim()] = value;
    }
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log("Checking Products...");
        const count = await prisma.hms_product.count();
        console.log(`Total Products: ${count}`);

        const products = await prisma.hms_product.findMany({
            take: 10,
            select: { name: true, sku: true }
        });
        console.log("First 10 Products:", products);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
