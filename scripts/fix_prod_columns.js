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
        console.log("Adding missing columns if needed...");

        // Countries
        await client.query(`ALTER TABLE countries ADD COLUMN IF NOT EXISTS flag CHAR(4);`);
        await client.query(`ALTER TABLE countries ADD COLUMN IF NOT EXISTS region VARCHAR(100);`);
        await client.query(`ALTER TABLE countries ADD COLUMN IF NOT EXISTS subregion VARCHAR(100);`);
        // We set default true to avoid nulls for existing rows if any, though we seed fresh mostly.
        await client.query(`ALTER TABLE countries ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`);

        // Subdivisions
        // 'type' is crucial for 'state' vs 'district'
        await client.query(`ALTER TABLE country_subdivision ADD COLUMN IF NOT EXISTS type VARCHAR(50);`);
        await client.query(`ALTER TABLE country_subdivision ADD COLUMN IF NOT EXISTS code VARCHAR(50);`);
        await client.query(`ALTER TABLE country_subdivision ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`);
        await client.query(`ALTER TABLE country_subdivision ADD COLUMN IF NOT EXISTS parent_id UUID;`);

        console.log("✅ Columns ensured.");

    } catch (e) { console.error("Column Fix Failed:", e); }
    finally { client.end(); }
}
main();
