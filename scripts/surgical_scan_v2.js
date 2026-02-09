
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- SURGICAL DATABASE SCAN ---');

        const res = await client.query(`
            SELECT table_schema, table_name, column_name, udt_name, column_default 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND table_name IN ('hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments', 'hms_invoice_history')
        `);

        res.rows.forEach(c => {
            const isArray = c.udt_name.startsWith('_');
            const isJsonb = c.udt_name === 'jsonb';
            const hasBracketDefault = c.column_default && c.column_default.includes('[]');

            if (isArray || hasBracketDefault) {
                console.log(`[DANGER] ${c.table_name}.${c.column_name}: Type=${c.udt_name}, Default=${c.column_default}`);
            } else if (isJsonb) {
                console.log(`[INFO] ${c.table_name}.${c.column_name}: Type=${c.udt_name}, Default=${c.column_default}`);
            }
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
