
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- METADATA TYPES CHECK ---');

        const res = await client.query(`
      SELECT table_name, column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND (column_name LIKE '%metadata%' OR column_name = 'line_items')
      AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
    `);

        if (res.rows.length > 0) {
            console.log('FOUND ARRAY METADATA COLUMNS:');
            console.log(JSON.stringify(res.rows, null, 2));
        } else {
            console.log('No array-typed metadata columns found.');
        }

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
