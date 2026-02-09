
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('--- SURGICAL INSPECTION OF BILLING-RELATED TABLES ---');

        const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments', 'hms_appointments', 'hms_patient'];

        // 1. Check for ANY column that is an ARRAY
        const arrayColsRes = await client.query(`
      SELECT table_name, column_name, udt_name, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
      AND (data_type = 'ARRAY' OR udt_name LIKE '\\_%')
    `, [tables]);

        if (arrayColsRes.rows.length > 0) {
            console.log('\n[!] DANGER: Found physical ARRAY columns in billing tables:');
            arrayColsRes.rows.forEach(c => {
                console.log(`- ${c.table_name}.${c.column_name} (${c.udt_name}) DEFAULT: ${c.column_default}`);
            });
        } else {
            console.log('\n[OK] No physical ARRAY columns found in core billing tables.');
        }

        // 2. Check for constraints that might be misbehaving
        const constraintsRes = await client.query(`
      SELECT conrelid::regclass as table_name, conname as constraint_name, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = ANY($1::regclass[])
    `, [tables]);

        console.log('\n--- CONSTRAINTS ---');
        constraintsRes.rows.forEach(c => {
            console.log(`[${c.table_name}] ${c.constraint_name}: ${c.definition}`);
        });

        // 3. Check for Triggers (again, very carefully)
        const triggersRes = await client.query(`
      SELECT event_object_table as table_name, trigger_name, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = ANY($1)
    `, [tables]);

        console.log('\n--- TRIGGERS ---');
        if (triggersRes.rows.length > 0) {
            triggersRes.rows.forEach(t => {
                console.log(`[${t.table_name}] ${t.trigger_name}`);
            });
        } else {
            console.log('No triggers found.');
        }

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
