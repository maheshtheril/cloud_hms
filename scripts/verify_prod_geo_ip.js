const { Client } = require('pg');

const dbConfig = {
    // Credentials for "Tiny Lab" / Seeakk Production
    host: '13.228.184.177', // IP Address
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' // SNI required for Neon
    },
};

async function check() {
    console.log("Connecting to Production DB (via IP) to verify data...");
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

    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        await client.end();
    }
}

check();
