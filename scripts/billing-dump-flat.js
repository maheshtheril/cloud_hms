
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments'];
    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = ANY($1)
    ORDER BY table_name, column_name
  `, [tables]);

    res.rows.forEach(c => {
        console.log(`${c.table_name}|${c.column_name}|${c.data_type}|${c.udt_name}|${c.column_default}`);
    });
    await client.end();
}

main();
