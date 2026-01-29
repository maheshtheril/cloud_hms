
import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

// Explicitly use the Direct URL we know works
const connectionString = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    console.log("Connecting to DB (Direct PG)...");
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log("✅ Connected.");

        // 1. List Tenants
        console.log("\n--- TENANTS ---");
        const tenants = await client.query('SELECT id, name, slug, domain FROM tenant');
        console.table(tenants.rows);

        // 2. List Users
        console.log("\n--- USERS ---");
        const users = await client.query('SELECT id, email, name, tenant_id FROM app_user');
        console.table(users.rows);

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await client.end();
    }
}

main();
