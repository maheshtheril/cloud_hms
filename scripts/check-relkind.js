
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const res = await client.query(`
    SELECT relname, relkind 
    FROM pg_class 
    JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
    WHERE relname = 'hms_invoice' AND nspname = 'public'
  `);
    console.log(res.rows[0]); // relkind 'r' = table, 'v' = view
    await client.end();
}

main();
