import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function listTriggersDetails() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('🔍 Querying detailed trigger info...');

        const res = await client.query(`
            SELECT 
                tgname as trigger_name, 
                relname as table_name,
                tgtype, 
                tgenabled, 
                pg_get_triggerdef(t.oid) as definition
            FROM pg_trigger t
            JOIN pg_class c ON t.tgrelid = c.oid
            WHERE c.relname IN ('hms_invoice', 'hms_invoice_lines')
            AND NOT tgisinternal
            ORDER BY table_name, trigger_name;
        `);

        res.rows.forEach(row => {
            console.log(`\n📋 Trigger: ${row.trigger_name} (on ${row.table_name})`);
            console.log(`   Definition: ${row.definition}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

listTriggersDetails();
