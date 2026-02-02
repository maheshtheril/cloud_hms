const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();

        // 1. Get India ID
        const cRes = await client.query("SELECT id FROM countries WHERE iso2='IN'");
        if (cRes.rows.length === 0) {
            console.error("India not found in DB! Seed countries first.");
            return;
        }
        const countryId = cRes.rows[0].id;
        console.log("India ID:", countryId);

        // 2. Try Insert without ID
        console.log("Attempting insert without ID...");
        const res = await client.query(`
            INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
            VALUES ($1, 'Test State', 'state', true)
            RETURNING id;
        `, [countryId]);

        console.log("Insert Success! ID:", res.rows[0].id);

        // 3. Cleanup
        await client.query("DELETE FROM country_subdivision WHERE id = $1", [res.rows[0].id]);
        console.log("Cleanup complete.");

    } catch (e) {
        console.error("INSERT FAILED:");
        console.error(e);
    }
    finally { client.end(); }
}
main();
