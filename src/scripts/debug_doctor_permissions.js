const { Client } = require('pg');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("--- Debugging Doctor Permissions (PG) ---");
    try {
        await client.connect();
        console.log("Connected to DB");

        // 1. Find Doctor Role
        const rolesRes = await client.query(`SELECT id, name FROM hms_roles WHERE name ILIKE '%Doctor%'`);

        if (rolesRes.rows.length === 0) {
            console.log("No 'Doctor' role found!");
        } else {
            for (const role of rolesRes.rows) {
                console.log(`\nFound Role: ${role.name} (ID: ${role.id})`);

                // 2. Get Permissions
                const permsRes = await client.query(`
                    SELECT p.code, p.name 
                    FROM hms_role_permissions rp
                    JOIN hms_permissions p ON rp.permission_id = p.id
                    WHERE rp.role_id = $1
                `, [role.id]);

                console.log("Permissions:");
                permsRes.rows.forEach(p => console.log(` - ${p.code} : ${p.name}`));
            }
        }

        // 3. Check Menu Items
        console.log("\n--- Doctor Menu Items ---");
        const menusRes = await client.query(`
            SELECT key, label, url, permission_code, module_key, parent_id 
            FROM menu_items 
            WHERE label ILIKE '%Doctor%' OR url ILIKE '%doctor%' OR key ILIKE '%doctor%' OR key ILIKE '%clinic%'
        `);

        menusRes.rows.forEach(m => {
            console.log(`Menu: ${m.label} | Key: ${m.key} | URL: ${m.url} | Perm: ${m.permission_code} | Module: ${m.module_key} | Parent: ${m.parent_id}`);
        });

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await client.end();
    }
}

main();
