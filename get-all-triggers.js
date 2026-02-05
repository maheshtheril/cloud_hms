
const { Client } = require('pg');
require('dotenv').config();

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const res = await client.query("SELECT tgname, pg_get_triggerdef(oid) as def FROM pg_trigger WHERE tgname NOT LIKE 'pg_%'");
        const fs = require('fs');
        fs.writeFileSync('all-triggers.json', JSON.stringify(res.rows, null, 2));
        console.log("Wrote all triggers to all-triggers.json");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
check();
