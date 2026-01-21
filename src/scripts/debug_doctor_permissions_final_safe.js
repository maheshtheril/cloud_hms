const { Client } = require('pg');
const fs = require('fs');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    let output = "--- Debugging Doctor Permissions (PG) - Final Safe ---\n";
    try {
        await client.connect();

        // 1. Find Role in 'role' table
        const rolesRes = await client.query(`SELECT id, name, key, permissions FROM role WHERE name ILIKE '%Doctor%'`);

        if (rolesRes.rows.length === 0) {
            output += "No 'Doctor' role found in 'role' table.\n";
        }

        for (const role of rolesRes.rows) {
            output += `\nFound Role (role table): ${role.name} (Key: ${role.key}) ID: ${role.id}\n`;
            output += `Array Permissions: ${JSON.stringify(role.permissions)}\n`;

            // 2. Get Permissions from 'role_permission' table
            const permsRes = await client.query(`
                SELECT permission_code, is_granted
                FROM role_permission
                WHERE role_id = $1
            `, [role.id]);

            output += `Table Permissions (role_permission) [Count: ${permsRes.rows.length}]:\n`;
            permsRes.rows.forEach(p => output += ` - ${p.permission_code} (Granted: ${p.is_granted})\n`);
        }

        // 3. Find Doctor Dashboard Menu and its permission
        output += "\n--- Doctor Dashboard Menu ---\n";
        const menusRes = await client.query(`
            SELECT key, label, url, permission_code, module_key, parent_id
            FROM menu_items 
            WHERE label ILIKE '%Doctor%' OR key = 'hms-dashboard' OR key = 'hms'
        `);

        menusRes.rows.forEach(m => {
            output += `Menu: "${m.label}" (Key: ${m.key}) | Perm: ${m.permission_code} | Module: ${m.module_key}\n`;
        });

    } catch (e) {
        output += `Script Error: ${e.message}\n`;
    } finally {
        await client.end();
        fs.writeFileSync('doctor_output_final_safe.txt', output);
        console.log("Written to doctor_output_final_safe.txt");
    }
}

main();
