
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Triggers on HMS tables...');

    try {
        const triggers = await prisma.$queryRaw`
        SELECT 
            event_object_table as table_name,
            trigger_name,
            event_manipulation as event,
            action_statement as definition
        FROM information_schema.triggers
        WHERE event_object_table IN ('hms_purchase_receipt_line', 'hms_stock_ledger', 'hms_stock_levels')
        ORDER BY event_object_table, trigger_name;
    `;

        console.log(JSON.stringify(triggers, null, 2));

        console.log('\nChecking hms_stock_levels structure...');
        const columns = await prisma.$queryRaw`
        SELECT column_name, is_nullable, data_type
        FROM information_schema.columns 
        WHERE table_name = 'hms_stock_levels'
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
