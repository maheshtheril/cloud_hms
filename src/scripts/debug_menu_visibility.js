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

        console.log("--- Debugging Menu Visibility for 'ree' ---");

        // 1. Get User ID
        const userRes = await client.query("SELECT id, tenant_id FROM app_user WHERE email ILIKE '%ree%' OR name ILIKE '%ree%' LIMIT 1");
        const user = userRes.rows[0];
        console.log(`User ID: ${user.id}, Tenant ID: ${user.tenant_id}`);

        // 2. Fetch Permissions
        console.log("\n--- Permissions Check ---");
        const permSet = new Set();

        // User Role
        const userRoles = await client.query("SELECT role_id FROM user_role WHERE user_id = $1", [user.id]);
        const roleIds = userRoles.rows.map(r => r.role_id);

        if (roleIds.length > 0) {
            // Role Permissions
            const rolePerms = await client.query(`
                SELECT permission_code, is_granted 
                FROM role_permission 
                WHERE role_id = ANY($1)
            `, [roleIds]);

            rolePerms.rows.forEach(p => {
                if (p.is_granted) permSet.add(p.permission_code);
            });
        }

        console.log(`Total Permissions: ${permSet.size}`);
        console.log(`Has 'hms:dashboard:reception'? ${permSet.has('hms:dashboard:reception')}`);
        console.log(`Has 'hms:view'? ${permSet.has('hms:view')}`);

        // 3. Fetch Menu Item
        console.log("\n--- Menu Item Check ---");
        const menuRes = await client.query("SELECT id, label, module_key, permission_code FROM menu_items WHERE label ILIKE '%Reception%'");
        const item = menuRes.rows[0];

        console.log(`Menu Item: ${item.label}`);
        console.log(`- Module: ${item.module_key}`);
        console.log(`- Required Perm: ${item.permission_code}`);

        // 4. Simulate Filter
        const allowed = !item.permission_code || permSet.has(item.permission_code) || permSet.has('*');
        console.log(`\nIs Allowed by Permissions? ${allowed ? 'YES' : 'NO'}`);

        // 5. Check Module Access
        console.log("\n--- Module Access Check ---");
        const tenantModules = await client.query("SELECT module_key FROM tenant_module WHERE tenant_id = $1 AND enabled = true", [user.tenant_id]);
        const subscribedModules = new Set(tenantModules.rows.map(m => m.module_key));
        console.log("Subscribed Modules:", Array.from(subscribedModules));

        const isModuleAllowed = subscribedModules.has(item.module_key) || permSet.has('hms:view'); // Simplified logic from navigation.ts
        console.log(`Is Module '${item.module_key}' Allowed? ${isModuleAllowed ? 'YES' : 'NO'}`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
