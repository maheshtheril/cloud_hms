
const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const res = await client.query("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'hms_invoice' AND column_name = 'line_items'");
        fs.writeFileSync('db-type-check.json', JSON.stringify(res.rows, null, 2));
    } catch (e) {
        fs.writeFileSync('db-type-check.json', e.message);
    } finally {
        await client.end();
    }
}
check();
