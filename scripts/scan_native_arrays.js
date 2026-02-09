
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- SCANNING FOR ALL NATIVE ARRAYS ---');

        const res = await client.query(`
            SELECT table_name, column_name, udt_name, column_default 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND udt_name LIKE '\\_%'
            ORDER BY table_name, column_name
        `);

        console.log(JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
