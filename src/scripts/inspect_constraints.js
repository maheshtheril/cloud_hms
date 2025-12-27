
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

        const tables = ['hms_invoice', 'hms_invoice_lines'];

        for (const tableName of tables) {
            console.log(`\n--- Constraints for ${tableName} ---`);

            const sql = `
                SELECT conname, pg_get_constraintdef(pg_constraint.oid) as definition
                FROM pg_constraint
                JOIN pg_class ON pg_constraint.conrelid = pg_class.oid
                WHERE pg_class.relname = $1
            `;

            const res = await client.query(sql, [tableName]);
            if (res.rows.length > 0) {
                console.log(JSON.stringify(res.rows, null, 2));
            } else {
                console.log("No constraints found.");
            }
        }

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

main();
