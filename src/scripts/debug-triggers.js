
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

console.log("Starting trigger debug script...");

// Load .env manually
try {
    // Assuming script is in src/scripts, .env is in root (../../)
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2 && !line.trim().startsWith('#')) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, ''); // strip quotes
                process.env[key] = val;
            }
        });
        console.log("Loaded .env. DATABASE_URL is " + (process.env.DATABASE_URL ? "SET" : "NOT SET"));
    } else {
        console.log(".env file not found at " + envPath);
    }
} catch (e) {
    console.error("Failed to load .env", e.message);
}

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching triggers for hms_invoice and hms_invoice_lines...');

    const tables = ['hms_invoice', 'hms_invoice_lines'];

    for (const table of tables) {
        console.log(`\n--- Triggers on table: ${table} ---`);
        try {
            const triggers = await prisma.$queryRawUnsafe(`
        SELECT 
            tgname as trigger_name,
            proname as function_name,
            prosrc as source_code
        FROM pg_trigger
        JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
        JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
        WHERE pg_class.relname = '${table}'
        AND tgisinternal = false
        `);

            console.log(JSON.stringify(triggers, null, 2));
        } catch (err) {
            console.error(`Error querying table ${table}:`, err.message);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
