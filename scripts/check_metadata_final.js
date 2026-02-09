
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL });
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_name IN ('hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments')
      AND (column_name = 'metadata' OR column_name = 'billing_metadata')
    `);

        console.log('--- METADATA COLUMN CHECK ---');
        res.rows.forEach(col => {
            const isArray = col.udt_name.startsWith('_');
            console.log(`${col.table_name}.${col.column_name}: Type=${col.udt_name} ${isArray ? '[!!! ARRAY DETECTED !!!]' : '[OK]'}`);
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
