const { Client } = require('pg');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("--- Debugging Doctor Permissions (PG) - Attempt 3 ---");
    try {
        await client.connect();

        // 1. Find Role in hms_roles
        const rolesRes = await client.query(`SELECT id, name, key FROM hms_roles WHERE name ILIKE '%Doctor%'`);

        if (rolesRes.rows.length === 0) {
            console.log("No 'Doctor' role found in hms_roles.");
            // Try 'role' table if exists, just in case
            try {
                const rolesRes2 = await client.query(`SELECT id, name, key FROM role WHERE name ILIKE '%Doctor%'`);
                if (rolesRes2.rows.length > 0) {
                    console.log("Found in 'role' table instead!");
                    rolesRes.rows.push(...rolesRes2.rows);
                }
            } catch (e) { }
        }

        for (const role of rolesRes.rows) {
            console.log(`\nFound Role (hms_roles): ${role.name} (Key: ${role.key}) ID: ${role.id}`);

            // 2. Get Permissions from hms_role_permissions
            try {
                const permsRes = await client.query(`
                    SELECT permission_code, is_granted
                    FROM hms_role_permissions
                    WHERE role_id = $1
                `, [role.id]);

                console.log(`Permissions (hms_role_permissions) [Count: ${permsRes.rows.length}]:`);
                permsRes.rows.forEach(p => console.log(` - ${p.permission_code} (Granted: ${p.is_granted})`));
            } catch (e) {
                console.log("Could not query hms_role_permissions: " + e.message);
                // Try role_permission
                try {
                    const permsRes2 = await client.query(`
                        SELECT permission_code, is_granted
                        FROM role_permission
                        WHERE role_id = $1
                    `, [role.id]);
                    console.log(`Permissions (role_permission) [Count: ${permsRes2.rows.length}]:`);
                    permsRes2.rows.forEach(p => console.log(` - ${p.permission_code}`));
                } catch (e2) {
                    console.log("Could not query role_permission either.");
                }
            }
        }

        // 3. Find Doctor Dashboard Menu
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
