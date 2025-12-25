import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function checkCols() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('🔍 Checking columns...');
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'hms_invoice' 
            AND column_name IN ('created_by', 'updated_by');
        `);

        console.table(res.rows);

        if (res.rows.length < 2) {
            console.log('❌ Missing columns!');
        } else {
            console.log('✅ Columns exist.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

checkCols();
