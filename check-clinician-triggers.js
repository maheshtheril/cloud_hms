
const { Client } = require('pg');
require('dotenv').config();

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const res = await client.query(`
      SELECT trigger_name, event_manipulation, event_object_table, action_statement, action_timing
      FROM information_schema.triggers
      WHERE event_object_table = 'hms_clinicians'
    `);
        console.log("TRIGGERS:");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
check();
