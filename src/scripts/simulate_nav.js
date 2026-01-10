const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    try {
        const envPath = path.resolve(__dirname, '../../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                line = line.trim();
                let [key, ...valueParts] = line.split('=');
                let value = valueParts.join('=');
                if (key && value && key === 'DATABASE_URL') connectionString = value.trim().replace(/^["']|["']$/g, '');
            });
        }
    } catch (e) { }
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();

        console.log("--- SIMULATING NAVIGATION LOGIC ---");

        // 1. Get User
        const userRes = await client.query("SELECT id, tenant_id FROM app_user WHERE email ILIKE '%ree%' LIMIT 1");
        const user = userRes.rows[0];
        console.log(`User: ${user.id}`);

        // 2. Fetch User Perms (Simulating getUserPermissions)
        const permSet = new Set();

        // Roles
        const userRoles = await client.query("SELECT role_id FROM user_role WHERE user_id = $1", [user.id]);
        const roleIds = userRoles.rows.map(r => r.role_id);

        // Role Perms
        if (roleIds.length > 0) {
            const rp = await client.query("SELECT permission_code FROM role_permission WHERE role_id = ANY($1) AND is_granted = true", [roleIds]);
            rp.rows.forEach(r => permSet.add(r.permission_code));
        }

        // Direct Perms
        const up = await client.query("SELECT permission_code FROM user_permission WHERE user_id = $1 AND is_granted = true", [user.id]);
        up.rows.forEach(r => permSet.add(r.permission_code));

        console.log(`User has 'hms:dashboard:reception'? ${permSet.has('hms:dashboard:reception')}`);

        // 3. Fetch Menu Item
        const menuRes = await client.query("SELECT label, key, permission_code, module_key FROM menu_items WHERE key = 'hms-reception'");
        const item = menuRes.rows[0];
        console.log(`Menu Item: ${item.label} (${item.key}) requires ${item.permission_code}`);

        // 4. Logic Check
        const allowed = !item.permission_code || permSet.has(item.permission_code) || permSet.has('*');
        console.log(`IS ALLOWED? ${allowed ? 'YES' : 'NO'}`);

        // 5. Module Check
        const moduleAllowed = permSet.has('hms:view');
        console.log(`Module 'hms' allowed via 'hms:view'? ${moduleAllowed}`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
