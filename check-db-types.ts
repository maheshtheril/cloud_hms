
import { prisma } from './src/lib/prisma';

async function checkTypes() {
    try {
        const types: any = await prisma.$queryRaw`
            SELECT t.typname 
            FROM pg_type t 
            JOIN pg_namespace n ON n.oid = t.typnamespace 
            WHERE n.nspname = 'public' AND t.typname = 'hms_invoice_status';
        `;
        console.log('Enum type hms_invoice_status:', JSON.stringify(types, null, 2));

        const cols: any = await prisma.$queryRaw`
            SELECT table_name, column_name, data_type, udt_name 
            FROM information_schema.columns 
            WHERE table_name IN ('hms_invoice', 'hms_appointments') AND column_name = 'status';
        `;
        console.log('Column types:', JSON.stringify(cols, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkTypes();
