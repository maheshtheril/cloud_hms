import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function applyFix() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Check if trigger is disabled currently, we might need to enable it or just dropping/recreating will handle it (DROP removes constraint)
        // Dropping trigger removes it regardless of enable/disable state.

        const sqlPath = path.join(process.cwd(), 'scripts', 'fix_history_trigger.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔄 Applying history trigger fix...');
        await client.query(sql);
        console.log('✅ History trigger fix applied successfully!');

    } catch (error) {
        console.error('❌ Error executing script:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyFix();
