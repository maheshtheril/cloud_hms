
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    await client.connect();
    console.log('Connected to database. Checking hms_clinicians structure...');

    const res = await client.query(`
        SELECT column_name, data_type, udt_name, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'hms_clinicians'
        ORDER BY column_name;
    `);

    console.table(res.rows);
    await client.end();
}

main().catch(console.error);
