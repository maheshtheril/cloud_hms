
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('Checking hms_invoice_lines columns...');
    const res = await client.query(`
    SELECT column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'hms_invoice_lines'
  `);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}

main();
