
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

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

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await client.connect();

        const tableName = 'hms_invoice';

        console.log(`--- Inspecting ${tableName} ---`);

        // 1. Columns (Generated?)
        const cols = await client.query(`
            SELECT column_name, is_generated, generation_expression
            FROM information_schema.columns
            WHERE table_name = $1
        `, [tableName]);
        console.log("Columns:", JSON.stringify(cols.rows, null, 2));

        // 2. Rules
        const rules = await client.query(`
            SELECT rulename, ev_type, is_instead
            FROM pg_rewrite
            JOIN pg_class ON pg_rewrite.ev_class = pg_class.oid
            WHERE pg_class.relname = $1
        `, [tableName]);
        console.log("Rules:", JSON.stringify(rules.rows, null, 2));

        // 3. Triggers (Double Check)
        const triggers = await client.query(`
            SELECT tgname
            FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE pg_class.relname = $1
            AND tgisinternal = false
        `, [tableName]);
        console.log("Triggers:", JSON.stringify(triggers.rows, null, 2));

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

main();
