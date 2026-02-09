
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    // Try DIRECT_DATABASE_URL if DATABASE_URL fails
    const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('CONNECTED TO DATABASE.');

        const res = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
      ORDER BY table_name, column_name
    `);

        console.log('--- ALL ARRAY COLUMNS ---');
        res.rows.forEach(col => {
            console.log(`${col.table_name}.${col.column_name} (${col.udt_name}) DEFAULT: ${col.column_default}`);
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
