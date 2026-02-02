const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
});

async function main() {
    await client.connect();
    const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='country_subdivision' AND column_name='parent_id'`);
    console.log(res.rows);
    client.end();
}
main();
