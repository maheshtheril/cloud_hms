
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- GLOBAL SCAN FOR MALFORMED DEFAULTS ---');

    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND column_default LIKE '%[]%'
    AND udt_name NOT IN ('jsonb', 'json')
  `);

    if (res.rows.length === 0) {
        console.log('No suspicious defaults found.');
    } else {
        res.rows.forEach(col => {
            console.log(`SUSPECT: ${col.table_name}.${col.column_name} (Type: ${col.udt_name}, Default: ${col.column_default})`);
        });
    }

    await client.end();
}

main();
