const { Client } = require('pg');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("--- Debugging Doctor Permissions (PG) - Final ---");
    try {
        await client.connect();

        // 1. Find Role in 'role' table (used by rbac.ts)
        const rolesRes = await client.query(`SELECT id, name, key, permissions FROM role WHERE name ILIKE '%Doctor%'`);

        if (rolesRes.rows.length === 0) {
            console.log("No 'Doctor' role found in 'role' table.");
        }

        for (const role of rolesRes.rows) {
            console.log(`\nFound Role (role table): ${role.name} (Key: ${role.key}) ID: ${role.id}`);
            console.log(`Array Permissions:`, role.permissions);

            // 2. Get Permissions from 'role_permission' table
            const permsRes = await client.query(`
                SELECT permission_code, is_granted
                FROM role_permission
                WHERE role_id = $1
            `, [role.id]);

            console.log(`Table Permissions (role_permission) [Count: ${permsRes.rows.length}]:`);
            permsRes.rows.forEach(p => console.log(` - ${p.permission_code} (Granted: ${p.is_granted})`));
        }

        // 3. Find Doctor Dashboard Menu and its permission
        console.log("\n--- Doctor Dashboard Menu ---");
        const menusRes = await client.query(`
            SELECT key, label, url, permission_code, module_key, parent_id
            FROM menu_items 
            WHERE label ILIKE '%Doctor%' OR key = 'hms-dashboard' OR key = 'hms'
        `);

        menusRes.rows.forEach(m => {
            console.log(`Menu: "${m.label}" (Key: ${m.key}) | Perm: ${m.permission_code} | Module: ${m.module_key}`);
        });

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await client.end();
    }
}

main();
