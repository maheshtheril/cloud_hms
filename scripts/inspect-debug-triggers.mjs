import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function inspectTriggers() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const triggers = ['trg_hms_invoice_post_stock', 'trg_hms_invoice_history'];
        let output = '';

        for (const triggerName of triggers) {
            const triggerInfo = await client.query(
                `SELECT t.tgname, p.proname, p.prosrc 
                 FROM pg_trigger t
                 JOIN pg_proc p ON t.tgfoid = p.oid
                 WHERE t.tgname = $1`,
                [triggerName]
            );

            if (triggerInfo.rows.length === 0) {
                output += `❌ Trigger '${triggerName}' not found.\n\n`;
            } else {
                const { proname, prosrc } = triggerInfo.rows[0];
                output += `📋 Trigger: ${triggerName}\n`;
                output += `📋 Function Name: ${proname}\n`;
                output += `--- SOURCE CODE START ---\n`;
                output += prosrc + '\n';
                output += `--- SOURCE CODE END ---\n\n`;
            }
        }

        fs.writeFileSync('scripts/debug_triggers_source.txt', output);
        console.log('✅ wrote scripts/debug_triggers_source.txt');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

inspectTriggers();
