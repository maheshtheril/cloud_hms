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

        const sqlPath = path.join(process.cwd(), 'scripts', 'fix_sync_trigger.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔄 Applying sync trigger fix...');
        await client.query(sql);
        console.log('✅ Sync trigger fix applied successfully!');

    } catch (error) {
        console.error('❌ Error executing script:', error);
        console.error('Stack:', error.stack);
        if (error.code) console.error('Code:', error.code);
        if (error.detail) console.error('Detail:', error.detail);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyFix();
