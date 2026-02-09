
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('Checking hms_invoice_history for array columns...');

        const res = await client.query(`
      SELECT column_name, data_type, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'hms_invoice_history'
      AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
    `);

        if (res.rows.length > 0) {
            console.log('Found problematic array columns in history table:');
            console.log(JSON.stringify(res.rows, null, 2));
        } else {
            console.log('No array columns found in hms_invoice_history.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
