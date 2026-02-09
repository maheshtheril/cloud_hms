const { Client } = require('pg');
require('dotenv').config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new Client({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log('✓ Connected to database');

        // Find triggers on hms_invoice.line_items
        const triggers = await client.query(`
            SELECT 
                t.tgname as trigger_name,
                p.proname as function_name,
                pg_get_triggerdef(t.oid) as trigger_def
            FROM pg_trigger t
            JOIN pg_class c ON t.tgrelid = c.oid
            JOIN pg_proc p ON t.tgfoid = p.oid
            WHERE c.relname = 'hms_invoice'
            AND NOT t.tgisinternal
        `);

        console.log('Found triggers on hms_invoice:');
        triggers.rows.forEach(t => {
            console.log(`  - ${t.trigger_name} (${t.function_name})`);
        });

        // Get trigger function definitions
        for (const trigger of triggers.rows) {
            const funcDef = await client.query(`
                SELECT pg_get_functiondef(p.oid) as definition
                FROM pg_proc p
                WHERE p.proname = $1
            `, [trigger.function_name]);

            console.log(`\n--- ${trigger.function_name} ---`);
            console.log(funcDef.rows[0]?.definition || 'No definition found');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
