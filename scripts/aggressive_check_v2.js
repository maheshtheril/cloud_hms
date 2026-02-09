
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- FINAL AGGRESSIVE CHECK ---');

        const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments', 'hms_invoice_history'];

        for (const table of tables) {
            const res = await client.query(`
                SELECT column_name, udt_name, column_default 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);

            console.log(`\nTable: ${table}`);
            res.rows.forEach(c => {
                if (c.udt_name.startsWith('_') || (c.column_default && c.column_default.includes('[]'))) {
                    console.log(`[!!] ${c.column_name}: Type=${c.udt_name}, Default=${c.column_default}`);
                }
            });
        }

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
