
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DIRECT_DATABASE_URL });
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
      AND table_name LIKE 'hms_%'
    `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
