
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    // Using the resolved IPv6 address since hostname resolution is flaky
    const connectionString = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@[2406:da18:94d:8228:c070:e7bc:3e13]:5432/neondb?sslmode=require";
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('--- SURGICAL TYPE CHECK ---');

        const res = await client.query(`
      SELECT table_name, column_name, udt_name 
      FROM information_schema.columns 
      WHERE table_name IN ('hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments')
      AND (udt_name LIKE '\\_%' OR udt_name = 'jsonb')
    `);

        res.rows.forEach(row => {
            console.log(`${row.table_name}.${row.column_name}: ${row.udt_name} ${row.udt_name.startsWith('_') ? '[!! ARRAY !!]' : '[OK]'}`);
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
