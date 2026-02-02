const { Client } = require('pg');
const connectionString = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name IN ('countries', 'country_subdivision')
            ORDER BY table_name, column_name;
        `);
        console.table(res.rows);
    } catch (e) { console.error(e); }
    finally { client.end(); }
}
main();
