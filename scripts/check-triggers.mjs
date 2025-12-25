import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function listTriggers() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('🔍 Querying triggers for hms_invoice and hms_invoice_lines...');

        const res = await client.query(`
            SELECT trigger_name, event_manipulation, event_object_table 
            FROM information_schema.triggers 
            WHERE event_object_table IN ('hms_invoice', 'hms_invoice_lines')
            ORDER BY event_object_table, trigger_name;
        `);

        console.table(res.rows);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

listTriggers();
