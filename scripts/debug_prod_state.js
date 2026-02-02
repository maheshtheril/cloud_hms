const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb';
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();
        const res = await client.query("SELECT * FROM country_subdivision WHERE type='state' LIMIT 5");
        console.log("Existing States:", res.rows);
    } catch (e) { console.error(e); }
    finally { client.end(); }
}
main();
