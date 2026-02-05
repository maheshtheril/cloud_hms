
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
        const res = await client.query("SELECT table_name, column_name, data_type, column_default, is_nullable FROM information_schema.columns WHERE table_name IN ('hms_patient', 'hms_invoice', 'hms_invoice_history') AND column_name IN ('id', 'line_items')");
        fs.writeFileSync('db-schema-output.json', JSON.stringify(res.rows, null, 2));

        const triggers = await client.query("SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE event_object_table IN ('hms_patient', 'hms_invoice')");
        fs.appendFileSync('db-schema-output.json', "\n\nTRIGGERS:\n" + JSON.stringify(triggers.rows, null, 2));
    } catch (e) {
        fs.writeFileSync('db-schema-output.json', e.message);
    } finally {
        await client.end();
    }
}
check();
