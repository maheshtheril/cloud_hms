
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
            AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
        `);

        console.log('--- PHANTOM ARRAY COLUMNS TO BE REMOVED ---');
        res.rows.forEach(r => {
            // These are confirmed phantoms because Prisma uses relations, not physical array columns
            console.log(`ALTER TABLE "public"."${r.table_name}" DROP COLUMN IF EXISTS "${r.column_name}" CASCADE;`);
        });

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
