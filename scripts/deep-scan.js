
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('--- COMPREHENSIVE SCAN FOR MALFORMED ARRAY LITERAL CAUSES ---');

    // 1. Find all columns of type ARRAY where the default value is '[]' (invalid for arrays, valid for json)
    const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
    AND column_default LIKE '%[]%'
  `);

    console.log(`Found ${res.rows.length} array columns with suspicious '[]' defaults.`);
    res.rows.forEach(row => {
        console.log(`SUSPECT: ${row.table_name}.${row.column_name} (${row.udt_name}) DEFAULT: ${row.column_default}`);
    });

    // 2. Check for triggers on hms_invoice again, very carefully
    const triggers = await client.query(`
    SELECT event_object_table, trigger_name, event_manipulation, action_statement, action_timing
    FROM information_schema.triggers
    WHERE event_object_table = 'hms_invoice' OR event_object_table = 'hms_invoice_lines'
  `);

    if (triggers.rows.length > 0) {
        console.log('--- TRIGGERS FOUND ---');
        triggers.rows.forEach(t => {
            console.log(`${t.event_manipulation} ${t.trigger_name} on ${t.event_object_table}`);
        });
    } else {
        console.log('No triggers found on hms_invoice or hms_invoice_lines.');
    }

    // 3. Check for dependent views of hms_invoice again
    const views = await client.query(`
    SELECT distinct dependent_view.relname as view_name
    FROM pg_depend 
    JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid 
    JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid 
    JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid 
    WHERE source_table.relname = 'hms_invoice'
  `);
    console.log('--- DEPENDENT VIEWS ---');
    views.rows.forEach(v => console.log(v.view_name));

    await client.end();
}

main();
