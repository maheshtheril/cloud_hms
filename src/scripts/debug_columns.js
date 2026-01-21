const { Client } = require('pg');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("--- Debugging Columns (PG) ---");
    try {
        await client.connect();

        const tables = ['hms_roles', 'hms_role_permissions', 'role_permission', 'role'];

        for (const t of tables) {
            console.log(`\nTable: ${t}`);
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '${t}'
            `);
            if (res.rows.length === 0) console.log("  (Table not found or no columns)");
            res.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));
        }

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await client.end();
    }
}

main();
