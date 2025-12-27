
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

console.log("Starting direct PG trigger cleanup...");

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
    ssl: { rejectUnauthorized: false } // Required for Render/Cloud usually
});

async function main() {
    try {
        await client.connect();
        console.log("Connected to database.");

        const sql = `
            DROP TRIGGER IF EXISTS trg_hms_invoice_lines_after_change ON hms_invoice_lines CASCADE;
            DROP FUNCTION IF EXISTS trg_hms_invoice_lines_after_change() CASCADE;
            
            DROP TRIGGER IF EXISTS trg_hms_invoice_after_change ON hms_invoice CASCADE;
            DROP FUNCTION IF EXISTS trg_hms_invoice_after_change() CASCADE;
            
            DROP TRIGGER IF EXISTS update_invoice_total ON hms_invoice_lines CASCADE;
            DROP FUNCTION IF EXISTS update_invoice_total() CASCADE;

            DROP TRIGGER IF EXISTS update_invoice_totals ON hms_invoice_lines CASCADE;
            DROP FUNCTION IF EXISTS update_invoice_totals() CASCADE;

            DROP TRIGGER IF EXISTS trg_hms_invoice_history ON hms_invoice CASCADE;
            DROP FUNCTION IF EXISTS trg_hms_invoice_history() CASCADE;
            
            DROP TRIGGER IF EXISTS trg_hms_invoice_lines_history ON hms_invoice_lines CASCADE;
            DROP FUNCTION IF EXISTS trg_hms_invoice_lines_history() CASCADE;
        `;

        await client.query(sql);
        console.log("Successfully dropped triggers.");
    } catch (err) {
        console.error("Error executing SQL:", err.message);
    } finally {
        await client.end();
    }
}

main();
