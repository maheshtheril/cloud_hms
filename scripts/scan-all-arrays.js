
const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('Scanning for ALL ARRAY columns...');

    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
    ORDER BY table_name, column_name
  `);

    console.log(`Found ${res.rows.length} array columns.`);
    fs.writeFileSync('all_arrays.json', JSON.stringify(res.rows, null, 2));
    await client.end();
}

main();
