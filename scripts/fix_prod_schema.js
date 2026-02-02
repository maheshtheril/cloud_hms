const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();

        console.log("Fixing Defaults on Prod...");

        // 1. Countries
        await client.query(`ALTER TABLE countries ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
        console.log("✅ Fixed countries.id default");

        // 2. Subdivisions
        await client.query(`ALTER TABLE country_subdivision ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
        console.log("✅ Fixed country_subdivision.id default");

    } catch (e) {
        console.error("FIX FAILED:", e);
    }
    finally { client.end(); }
}
main();
