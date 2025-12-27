
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

console.log("Starting dynamic cleanup of ALL triggers on invoice tables...");

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
        console.log("Connected to database.");

        const tableNames = ['hms_invoice', 'hms_invoice_lines'];

        // 1. Fetch all triggers
        const sqlFetch = `
            SELECT tgname, relname
            FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE pg_class.relname = ANY($1)
            AND tgisinternal = false
        `;

        const res = await client.query(sqlFetch, [tableNames]);

        if (res.rows.length === 0) {
            console.log("No triggers found on invoice tables.");
            return;
        }

        console.log(`Found ${res.rows.length} triggers. Dropping them now...`);

        // 2. Drop each trigger
        for (const row of res.rows) {
            const dropSql = `DROP TRIGGER IF EXISTS "${row.tgname}" ON "${row.relname}" CASCADE`;
            console.log(`Executing: ${dropSql}`);
            try {
                await client.query(dropSql);
                console.log(`  -> Dropped ${row.tgname}`);
            } catch (dropErr) {
                console.error(`  -> Failed to drop ${row.tgname}: ${dropErr.message}`);
            }
        }

        console.log("Cleanup complete.");

    } catch (err) {
        console.error("Error executing SQL:", err.message);
    } finally {
        await client.end();
    }
}

main();
