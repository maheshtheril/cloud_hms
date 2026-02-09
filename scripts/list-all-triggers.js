
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    const res = await client.query(`
    SELECT trigger_name, event_manipulation, event_object_table 
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
  `);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}

main();
