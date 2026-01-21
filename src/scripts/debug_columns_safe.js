const { Client } = require('pg');
const fs = require('fs');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    let output = "--- Debugging Columns (PG) ---\n";
    try {
        await client.connect();

        const tables = ['hms_roles', 'hms_role_permissions', 'role_permission', 'role', 'hms_permissions', 'permission'];

        for (const t of tables) {
            output += `\nTable: ${t}\n`;
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '${t}'
            `);
            if (res.rows.length === 0) output += "  (Table not found or no columns)\n";
            res.rows.forEach(r => output += `  - ${r.column_name} (${r.data_type})\n`);
        }

    } catch (e) {
        output += `Script Error: ${e.message}\n`;
    } finally {
        await client.end();
        fs.writeFileSync('columns_output_safe.txt', output);
        console.log("Written to columns_output_safe.txt");
    }
}

main();
