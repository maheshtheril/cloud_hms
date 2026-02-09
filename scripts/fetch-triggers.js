
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- TRIGGERS ON HMS_INVOICE ---');
    const res = await client.query(`
    SELECT t.tgname as trigger_name, 
           p.proname as function_name,
           p.prosrc as function_definition
    FROM pg_trigger t
    JOIN pg_class cl ON t.tgrelid = cl.oid
    JOIN pg_proc p ON t.tgfoid = p.oid
    WHERE cl.relname = 'hms_invoice'
  `);

    if (res.rows.length > 0) {
        res.rows.forEach(row => {
            console.log(`TRIGGER: ${row.trigger_name} EXECUTES ${row.function_name}`);
            console.log(`DEFINITION: ${row.function_definition}\n`);
        });
    } else {
        console.log('No triggers found.');
    }

    await client.end();
}

main();
