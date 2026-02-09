
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- GLOBAL PHANTOM ARRAY SCAN ---');

        const res = await client.query(`
            SELECT table_name, column_name, udt_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
        `);

        const whitelist = ['permissions', 'tags', 'working_days', 'analytic_tag_ids'];

        res.rows.forEach(c => {
            if (whitelist.includes(c.column_name)) return;
            if (c.column_name.endsWith('_ids')) return;
            console.log(`[ALERT] ${c.table_name}.${c.column_name}: ${c.udt_name}`);
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
