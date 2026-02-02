const { Client } = require('pg');

// Removed ?sslmode=require from string, relying on ssl object
const connectionString = 'postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("Checking Prod DB...");
    try {
        await client.connect();
        const res = await client.query('SELECT count(*) FROM countries');
        console.log("Countries:", res.rows[0].count);
        const res2 = await client.query("SELECT count(*) FROM country_subdivision WHERE type='state'");
        console.log("States:", res2.rows[0].count);
    } catch (e) {
        console.error(e);
    } finally {
        client.end();
    }
}
main();
