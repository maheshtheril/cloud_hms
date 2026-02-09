
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- GLOBAL ARRAY SCAN ---');

        const res = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND (
        data_type = 'ARRAY' 
        OR udt_name LIKE '\\_%' 
        OR column_default LIKE '%[]%'
      );
    `);

        console.log(JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
