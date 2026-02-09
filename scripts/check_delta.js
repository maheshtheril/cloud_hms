
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name, column_name, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'hms_invoice_history' AND column_name = 'delta'
    `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
