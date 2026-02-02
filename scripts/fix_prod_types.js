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

        console.log("Fixing Column Types to UUID...");

        // Fix country_id
        await client.query(`
            ALTER TABLE country_subdivision 
            ALTER COLUMN country_id TYPE UUID USING country_id::uuid;
        `);
        console.log("✅ country_id converted to UUID");

        // Fix parent_id 
        await client.query(`
            ALTER TABLE country_subdivision 
            ALTER COLUMN parent_id TYPE UUID USING parent_id::uuid;
        `);
        console.log("✅ parent_id converted to UUID");

    } catch (e) {
        console.error("TYPE FIX FAILED:", e.message);
    }
    finally { client.end(); }
}
main();
