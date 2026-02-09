
const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
  `);

    fs.writeFileSync('array_columns.json', JSON.stringify(res.rows, null, 2));
    console.log(`Saved ${res.rows.length} columns to array_columns.json`);

    await client.end();
}

main();
