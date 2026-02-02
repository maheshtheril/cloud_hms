const { Client } = require('pg');

const dbConfig = {
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' },
};
const client = new Client(dbConfig);

async function main() {
    try {
        await client.connect();

        // Count All Districts
        const res = await client.query("SELECT count(*) FROM country_subdivision WHERE type='district'");
        console.log("Total Districts:", res.rows[0].count);

        // Count India Districts specifically
        const res2 = await client.query(`
            SELECT count(*) FROM country_subdivision s
            JOIN countries c ON s.country_id::text = c.id::text 
            WHERE s.type='district' AND c.iso2='IN'
        `);
        console.log("India Districts:", res2.rows[0].count);

    } catch (e) { console.error(e); }
    finally { client.end(); }
}
main();
