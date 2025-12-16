
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching table structure for hms_purchase_receipt_line... (URL length: ' + (process.env.DATABASE_URL?.length || 0) + ')');

    try {
        const columns = await prisma.$queryRaw`
        SELECT column_name, is_nullable, data_type, column_default
        FROM information_schema.columns 
        WHERE table_name = 'hms_purchase_receipt_line'
        ORDER BY column_name;
    `;

        console.log(JSON.stringify(columns, null, 2));
    } catch (err) {
        console.error("Query failed:", err);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
