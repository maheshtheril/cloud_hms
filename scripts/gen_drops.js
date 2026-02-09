
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name, column_name, udt_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND table_name LIKE 'hms_invoice%'
            AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
        `);

        console.log('--- PHANTOM ARRAYS IN BILLING TABLES ---');
        res.rows.forEach(r => {
            console.log(`ALTER TABLE "${r.table_name}" DROP COLUMN IF EXISTS "${r.column_name}" CASCADE; -- ${r.udt_name}`);
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
