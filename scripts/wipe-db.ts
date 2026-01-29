
import { Client } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function wipe() {
    console.log("⚠️  WIPING DATABASE (Dropping 'public' schema)...");
    const client = new Client({ connectionString });
    try {
        await client.connect();

        // 1. Drop Schema
        await client.query('DROP SCHEMA public CASCADE');
        console.log("✅ Schema Dropped.");

        // 2. Re-create Schema
        await client.query('CREATE SCHEMA public');
        console.log("✅ Schema Re-created (Empty).");

        // 3. Grant permissions (standard for default user)
        await client.query('GRANT ALL ON SCHEMA public TO neondb_owner');
        await client.query('GRANT ALL ON SCHEMA public TO public');
        console.log("✅ Permissions Reset.");

        await client.end();
        console.log("DB is now clean. Ready for 'prisma db push'.");
    } catch (err) {
        console.error("❌ Wipe failed:", err);
    }
}
wipe();
