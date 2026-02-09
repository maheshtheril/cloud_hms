
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
    AND column_default LIKE '%[]%'
  `);

    console.log(JSON.stringify(res.rows, null, 2));

    await client.end();
}

main();
