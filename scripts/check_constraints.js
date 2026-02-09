
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('Checking hms_invoice constraints...');

        const res = await client.query(`
      SELECT conname as constraint_name, pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint
      WHERE conrelid = 'hms_invoice'::regclass;
    `);

        if (res.rows.length > 0) {
            res.rows.forEach(row => {
                console.log(`Constraint: ${row.constraint_name} | Definition: ${row.constraint_definition}`);
            });
        }

        console.log('\nChecking for any remaining ARRAY columns in ALL tables beginning with hms_invoice...');
        const res2 = await client.query(`
      SELECT table_name, column_name, udt_name
      FROM information_schema.columns 
      WHERE table_name LIKE 'hms_invoice%'
      AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%');
    `);
        console.log(JSON.stringify(res2.rows, null, 2));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
