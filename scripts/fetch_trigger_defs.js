
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('Fetching Trigger Function Definitions...');

        const res = await client.query(`
      SELECT 
        trig.tgname AS trigger_name,
        rel.relname AS table_name,
        proc.proname AS function_name,
        proc.prosrc AS function_definition
      FROM pg_trigger trig
      JOIN pg_class rel ON trig.tgrelid = rel.oid
      JOIN pg_proc proc ON trig.tgfoid = proc.oid
      JOIN pg_namespace ns ON rel.relnamespace = ns.oid
      WHERE ns.nspname = 'public' 
        AND rel.relname IN ('hms_invoice', 'hms_invoice_lines')
        AND trig.tgisinternal = false;
    `);

        if (res.rows.length > 0) {
            res.rows.forEach(row => {
                console.log(`\nTable: ${row.table_name} | Trigger: ${row.trigger_name}`);
                console.log(`Function: ${row.function_name}`);
                console.log(`Definition:\n${row.function_definition}`);
            });
        } else {
            console.log('No custom triggers found on hms_invoice or hms_invoice_lines.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
