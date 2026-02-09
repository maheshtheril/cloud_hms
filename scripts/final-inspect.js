
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- FINAL INSPECTION OF HMS_INVOICE ---');

    const res = await client.query(`
    SELECT column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'hms_invoice'
    ORDER BY column_name
  `);

    res.rows.forEach(col => {
        console.log(`${col.column_name}: Type=${col.udt_name}, Default=${col.column_default}`);
    });

    console.log('\n--- CHECKING FOR UNEXPECTED TABLES ---');
    const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'hms_invoice%'
  `);
    console.log('Tables:', tables.rows.map(t => t.table_name).join(', '));

    await client.end();
}

main();
