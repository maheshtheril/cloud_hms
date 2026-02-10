
const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Running Quick Fix for hms_clinicians...");

    // Try multiple connection strings
    const urls = [
        process.env.DATABASE_URL,
        process.env.DIRECT_DATABASE_URL,
        process.env.DATABASE_URL?.replace('-pooler', ''),
    ].filter(u => u);

    let client;
    for (const url of urls) {
        try {
            const tempClient = new Client({ connectionString: url });
            await tempClient.connect();
            console.log("Connected to DB!");
            client = tempClient;
            break;
        } catch (e) {
            console.log(`Failed to connect with ${url}: ${e.message}`);
        }
    }

    if (!client) {
        console.error("Could not connect to database.");
        return;
    }

    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, '../QUICK_FIX.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Extract the Fix 2 block as it seems most robust
        // Or better yet, just execute the ALTER commands directly.

        console.log("Fixing working_days column default...");

        // Drop default if exists to be safe
        try {
            await client.query(`ALTER TABLE hms_clinicians ALTER COLUMN working_days DROP DEFAULT`);
        } catch (e) {
            // ignore if no default
        }

        // Set correct default
        await client.query(`
            ALTER TABLE hms_clinicians 
            ALTER COLUMN working_days 
            SET DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[]
        `);

        console.log("✅ Fixed working_days column default.");

        // Verification
        const res = await client.query(`
            SELECT column_name, data_type, udt_name, column_default
            FROM information_schema.columns
            WHERE table_name = 'hms_clinicians'
            AND column_name = 'working_days'
        `);

        console.log("Verification Result:");
        console.log(JSON.stringify(res.rows, null, 2));

    } catch (e) {
        console.error("Fix failed:", e);
    } finally {
        await client.end();
    }
}

main();
