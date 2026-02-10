const { Client } = require('pg');

async function testConnection() {
    // Use the EXACT URL we want for Docker
    // Replace localhost with 127.0.0.1 for local testing
    const dbUrl = "postgresql://postgres:postgres@127.0.0.1:5432/postgres?sslmode=disable";

    console.log("🔍 Testing connection to:", dbUrl);

    const client = new Client({ connectionString: dbUrl });

    try {
        await client.connect();
        console.log("✅ SUCCESS! Connected to the database.");

        const res = await client.query('SELECT current_database(), current_user, count(*) as tables FROM information_schema.tables WHERE table_schema = \'public\'');
        console.log("📊 DB Info:", {
            database: res.rows[0].current_database,
            user: res.rows[0].current_user,
            table_count: res.rows[0].tables
        });

        if (res.rows[0].tables == 0) {
            console.log("⚠️ WARNING: Connection worked, but the database is EMPTY (0 tables). Did you import the backup?");
        }

    } catch (err) {
        console.error("❌ CONNECTION FAILED!");
        console.error("Reason:", err.message);

        if (err.message.includes("password authentication failed")) {
            console.log("👉 Suggestion: Your 'postgres' password is NOT 'postgres'. Check pgAdmin.");
        } else if (err.message.includes("ECONNREFUSED")) {
            console.log("👉 Suggestion: Postgres is NOT running on port 5432. Check if pgAdmin can connect.");
        }
    } finally {
        await client.end();
    }
}

testConnection();
