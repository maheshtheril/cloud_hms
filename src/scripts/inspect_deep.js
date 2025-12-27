
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
                    // Join the rest back, but be careful with quotes
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

        const tables = ['hms_invoice', 'hms_invoice_lines'];

        for (const tableName of tables) {
            console.log(`\n--- Inspecting ${tableName} ---`);

            // 1. Table Type (Base Table vs View)
            const typeRes = await client.query(`
                SELECT table_type 
                FROM information_schema.tables 
                WHERE table_name = $1
            `, [tableName]);
            console.log("Type:", typeRes.rows[0]?.table_type || 'Unknown');

            // 2. ALL Triggers (Including Internal)
            const triggers = await client.query(`
                SELECT tgname, tgisinternal
                FROM pg_trigger
                JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
                WHERE pg_class.relname = $1
            `, [tableName]);
            if (triggers.rows.length > 0) {
                console.log("ALL Triggers (Including Internal):", JSON.stringify(triggers.rows, null, 2));
            } else {
                console.log("No triggers found.");
            }
        }

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

main();
