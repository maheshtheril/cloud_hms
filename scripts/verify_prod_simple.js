const { Client } = require('pg');

const prodUrl = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function check() {
    console.log("Connecting to Production DB (Seeakk)...");
    const client = new Client({
        connectionString: prodUrl
    });

    try {
        await client.connect();
        console.log("Connected!");

        // Count Countries
        const cRes = await client.query('SELECT COUNT(*) FROM countries');
        const countryCount = cRes.rows[0].count;

        // Count States
        const sRes = await client.query("SELECT COUNT(*) FROM country_subdivision WHERE type = 'state'");
        const stateCount = sRes.rows[0].count;

        // Count Districts (India)
        const dRes = await client.query("SELECT COUNT(*) FROM country_subdivision WHERE type = 'district' AND country_id = (SELECT id FROM countries WHERE iso2='IN')");
        const distCount = dRes.rows[0].count;

        console.log("\n--- SEEAKK PRODUCTION DATA ---");
        console.log(`Countries: ${countryCount}`);
        console.log(`States:    ${stateCount}`);
        console.log(`Districts: ${distCount}`);

    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        await client.end();
    }
}

check();
