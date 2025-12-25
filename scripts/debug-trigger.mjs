import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function debugTrigger() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('\n🔍 Inspecting trigger: trg_hms_invoice_lines_after_change');

        // Check trigger definition
        const triggerRes = await client.query(`
            SELECT t.tgname, p.proname, t.tgenabled, t.tgtype
            FROM pg_trigger t
            JOIN pg_proc p ON t.tgfoid = p.oid
            WHERE t.tgname = 'trg_hms_invoice_lines_after_change'
        `);

        if (triggerRes.rows.length === 0) {
            console.log('❌ Trigger not found!');
        } else {
            console.log('✅ Trigger found:', triggerRes.rows[0]);

            // Check function definition
            const funcName = triggerRes.rows[0].proname;
            console.log(`\n🔍 Inspecting function: ${funcName}`);

            const funcRes = await client.query(`
                SELECT prosrc 
                FROM pg_proc 
                WHERE proname = $1
            `, [funcName]);

            if (funcRes.rows.length > 0) {
                console.log('--- Function Source ---');
                console.log(funcRes.rows[0].prosrc);
                console.log('-----------------------');
            }
        }

        // Check if there are other triggers on hms_invoice_lines
        console.log('\n🔍 Other triggers on hms_invoice_lines:');
        const otherTriggers = await client.query(`
            SELECT trigger_name, event_manipulation, action_statement
            FROM information_schema.triggers
            WHERE event_object_table = 'hms_invoice_lines'
        `);
        console.table(otherTriggers.rows);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

debugTrigger();
