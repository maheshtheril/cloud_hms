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
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'country_subdivision' AND column_name IN ('parent_id', 'country_id');
        `);
        console.log("Types:", res.rows);
    } catch (e) { console.error(e); }
    finally { client.end(); }
}
main();
