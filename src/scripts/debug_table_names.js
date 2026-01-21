const { Client } = require('pg');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("--- Debugging Tables (PG) ---");
    try {
        await client.connect();

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name ILIKE '%role%'
        `);

        console.log("Tables matching 'role':");
        res.rows.forEach(r => console.log(r.table_name));

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await client.end();
    }
}

main();
