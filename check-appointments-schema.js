const { Client } = require('pg');
require('dotenv').config();

async function checkNotNullColumns() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected...');

        // Get all NOT NULL columns for hms_appointments
        const result = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'hms_appointments'
      AND is_nullable = 'NO'
      ORDER BY ordinal_position
    `);

        console.log('\n=== NOT NULL columns in hms_appointments ===\n');
        result.rows.forEach(row => {
            console.log(`${row.column_name.padEnd(25)} | ${row.data_type.padEnd(20)} | Default: ${row.column_default || 'NONE'}`);
        });

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await client.end();
    }
}

checkNotNullColumns();
