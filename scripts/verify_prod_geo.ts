import { Client } from 'pg';

const dbConfig = {
    // Credentials for "Tiny Lab" / Seeakk Production
    host: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech', // Use pooler hostname
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectUnauthorized: false },
};

async function check() {
    console.log("Connecting to Production DB to verify data...");
    const client = new Client(dbConfig);

    try {
        await client.connect();

        // Count Countries
        const cRes = await client.query('SELECT COUNT(*) FROM countries');
        const countryCount = cRes.rows[0].count;

        // Count States
        const sRes = await client.query("SELECT COUNT(*) FROM country_subdivision WHERE type = 'state'");
        const stateCount = sRes.rows[0].count;

        // Count Districts (India)
        const dRes = await client.query("SELECT COUNT(*) FROM country_subdivision WHERE type = 'district' AND country_id = (SELECT id FROM countries WHERE iso2='IN')");
        const distCount = dRes.rows[0].count;

        console.log("\n--- PRODUCTION DATA VERIFICATION ---");
        console.log(`Countries Found: ${countryCount} (Target: ~250)`);
        console.log(`States Found:    ${stateCount}    (Target: ~5000)`);
        console.log(`India Districts: ${distCount}     (Target: ~700)`);

        if (parseInt(countryCount) > 200 && parseInt(stateCount) > 1000) {
            console.log("\n✅ SUCCESS: Geography data is PRESENT on Production.");
        } else {
            console.log("\n❌ FAILURE: Data is still missing.");
        }

    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        await client.end();
    }
}

check();
