
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- INSPECTING HISTORY TABLE ---');

    const res = await client.query(`
    SELECT column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'hms_invoice_history'
    ORDER BY column_name
  `);

    res.rows.forEach(col => {
        console.log(`${col.column_name}: Type=${col.udt_name}, Default=${col.column_default}`);
    });

    await client.end();
}

main();
