
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- EXHAUSTIVE COLUMN & TRIGGER CHECK ---');

    const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments', 'hms_invoice_history'];

    for (const table of tables) {
        console.log(`\nChecking Table: ${table}`);

        // 1. Check all columns and their types/defaults
        const cols = await client.query(`
      SELECT column_name, data_type, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_name = $1
      ORDER BY column_name
    `, [table]);

        cols.rows.forEach(c => {
            // Highlight any ARRAY types or any default with '[]'
            const isArray = c.data_type === 'ARRAY' || c.udt_name.startsWith('_');
            const hasJsonDefault = c.column_default && c.column_default.includes('[]');

            if (isArray || hasJsonDefault) {
                console.log(`[!!] ${c.column_name}: Type=${c.udt_name}, Default=${c.column_default}`);
            } else {
                console.log(`     ${c.column_name}: Type=${c.udt_name}`);
            }
        });

        // 2. Check for custom triggers (ignoring FK constraints)
        const triggers = await client.query(`
      SELECT tgname as trigger_name
      FROM pg_trigger t
      JOIN pg_class cl ON t.tgrelid = cl.oid
      WHERE cl.relname = $1 AND t.tgisinternal = false
    `, [table]);

        if (triggers.rows.length > 0) {
            console.log(`Triggers: ${triggers.rows.map(t => t.trigger_name).join(', ')}`);
        }
    }

    await client.end();
}

main();
