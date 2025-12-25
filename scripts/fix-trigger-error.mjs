import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function fixTriggerError() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully\n');

        const triggerName = 'trg_hms_invoice_lines_after_change';
        const tableName = 'hms_invoice_lines';

        // 1. Check if trigger exists and get function name
        console.log(`🔍 Checking for trigger '${triggerName}'...`);
        const triggerInfo = await client.query(
            `SELECT t.tgname, p.proname 
             FROM pg_trigger t
             JOIN pg_proc p ON t.tgfoid = p.oid
             WHERE t.tgname = $1`,
            [triggerName]
        );

        if (triggerInfo.rows.length === 0) {
            console.log(`✅ Trigger '${triggerName}' not found. It might have been already removed.`);
        } else {
            const functionName = triggerInfo.rows[0].proname;
            console.log(`📋 Found trigger '${triggerName}' calling function '${functionName}'`);

            // 2. Drop the trigger
            console.log(`🗑️  Dropping trigger '${triggerName}' on table '${tableName}'...`);
            await client.query(`DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName}`);
            console.log(`✅ Trigger dropped successfully.`);

            // 3. Drop the function
            if (functionName) {
                console.log(`🗑️  Dropping function '${functionName}'...`);
                await client.query(`DROP FUNCTION IF EXISTS ${functionName} CASCADE`);
                console.log(`✅ Function dropped successfully.`);
            }
        }

        console.log('🎉 Fix complete!\n');

    } catch (error) {
        console.error('❌ Error fixing trigger:', error);
        throw error;
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

fixTriggerError()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    });
