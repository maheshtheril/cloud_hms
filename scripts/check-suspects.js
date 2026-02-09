
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- CHECKING HMS_INVOICE_HISTORY ---');
    const res = await client.query(`
    SELECT column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'hms_invoice_history'
    AND (udt_name LIKE '\\_%' OR column_default LIKE '%[]%')
  `);

    if (res.rows.length > 0) {
        res.rows.forEach(col => {
            console.log(`SUSPECT: ${col.column_name}: Type=${col.udt_name}, Default=${col.column_default}`);
        });
    } else {
        console.log('No suspicious columns in hms_invoice_history.');
    }

    console.log('\n--- CHECKING HMS_INVOICE_LINES ---');
    const res2 = await client.query(`
    SELECT column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'hms_invoice_lines'
    AND (udt_name LIKE '\\_%' OR column_default LIKE '%[]%')
  `);
    if (res2.rows.length > 0) {
        res2.rows.forEach(col => {
            console.log(`SUSPECT: ${col.column_name}: Type=${col.udt_name}, Default=${col.column_default}`);
        });
    } else {
        console.log('No suspicious columns in hms_invoice_lines.');
    }

    await client.end();
}

main();
