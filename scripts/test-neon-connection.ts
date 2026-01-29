
import { Client } from 'pg';

delete process.env.PGHOST;
delete process.env.PGDATABASE;
delete process.env.PGUSER;
delete process.env.PGPASSWORD;
delete process.env.PGPORT;

const connectionString = 'postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function test() {
    console.log("Testing connection string:", connectionString);
    const client = new Client({ connectionString });
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("✅ Connected Successfully!");
        const res = await client.query('SELECT NOW()');
        console.log("Time:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("❌ Connection failed:", err);
    }
}
test();
