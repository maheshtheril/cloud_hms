import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Handling ESM if needed, but we are running with tsx which handles it.
// dotenv config
dotenv.config();

const sqlPath = path.join(process.cwd(), 'prisma', 'seed_global.sql');

async function main() {
    console.log("Reading SQL file...");
    let sql = '';
    try {
        sql = fs.readFileSync(sqlPath, 'utf-8');
    } catch (e) {
        console.error("Could not read seed_global.sql at", sqlPath);
        process.exit(1);
    }

    if (!process.env.DATABASE_URL && !process.env.DIRECT_DATABASE_URL) {
        console.error("No DATABASE_URL found in env");
        process.exit(1);
    }

    // Prefer DIRECT_DATABASE_URL for seeding if available to avoid pooler issues
    const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

    console.log("Connecting to DB...");
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Common for Neon/Cloud Postgres
    });

    try {
        await client.connect();
        console.log("Connected. Executing Seed...");

        // Execute the whole file
        await client.query(sql);

        console.log("Seed applied successfully!");
    } catch (e) {
        console.error("Seed execution failed:", e);
    } finally {
        await client.end();
    }
}

main();
