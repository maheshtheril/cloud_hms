
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

console.log("Starting trigger listing...");

// Load .env manually
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    try {
        const envPath = path.resolve(__dirname, '../../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2 && !line.trim().startsWith('#')) {
                    const key = parts[0].trim();
                    let val = parts.slice(1).join('=').trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (key === 'DATABASE_URL') {
                        connectionString = val;
                    }
                }
            });
        }
    } catch (e) {
        console.error("Failed to load .env", e.message);
    }
}

if (!connectionString) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await client.connect();

        const sql = `
            SELECT 
                tgname as trigger_name,
                relname as table_name
            FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE pg_class.relname IN ('hms_invoice', 'hms_invoice_lines')
            AND tgisinternal = false
        `;

        const res = await client.query(sql);
        console.log("Active Triggers (JSON):");
        console.log(JSON.stringify(res.rows, null, 2));

        // Also check if there are any other triggers on related tables
        const allTriggers = await client.query(`
            SELECT tgname, relname, prosrc
            FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
            WHERE pg_class.relname LIKE 'hms_%'
            AND tgisinternal = false
        `);
        console.log("All HMS Triggers:");
        console.log(JSON.stringify(allTriggers.rows, null, 2));

    } catch (err) {
        console.error("Error executing SQL:", err.message);
    } finally {
        await client.end();
    }
}

main();
