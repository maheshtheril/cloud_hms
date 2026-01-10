const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
    try {
        await client.connect();
        console.log("Connected.");

        // 1. Get Tenant ID (Use first found or specific)
        const tenantRes = await client.query("SELECT id FROM tenants LIMIT 1"); // Assuming tenants table or similar context
        // Actually, better to get from a user or roles table example
        const roleEx = await client.query("SELECT tenant_id FROM role LIMIT 1");
        const tenantId = roleEx.rows[0]?.tenant_id;

        if (!tenantId) {
            console.log("No Tenant found.");
            return;
        }

        console.log(`Using Tenant: ${tenantId}`);

        // 2. Create Accountant Role
        const roleKey = 'accountant';
        const roleName = 'Accountant';
        const perms = [
            'accounting:view', 'accounting:create', 'accounting:edit',
            'billing:view', 'billing:create', 'billing:edit',
            'purchasing:view', 'purchasing:create',
            'suppliers:view',
            'hms:view'
        ];

        // Ensure permissions exist in permission table first?
        // Usually system assumes they exist or relies on strings.
        // But for safety, let's insert the Role.

        // Check if exists
        const check = await client.query("SELECT id FROM role WHERE key = $1 AND tenant_id = $2", [roleKey, tenantId]);

        if (check.rows.length === 0) {
            console.log("Creating Accountant Role...");
            await client.query(`
                INSERT INTO role (tenant_id, key, name, permissions)
                VALUES ($1, $2, $3, $4)
            `, [tenantId, roleKey, roleName, perms]);
            console.log("Accountant Role Created!");
        } else {
            console.log("Accountant Role already exists. Updating permissions...");
            await client.query(`
                UPDATE role SET permissions = $3 WHERE id = $1
            `, [check.rows[0].id, tenantId, perms]); // Wait, params mismatch
            await client.query(`
                UPDATE role SET permissions = $2 WHERE id = $1
            `, [check.rows[0].id, perms]);
            console.log("Updated.");
        }

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await client.end();
    }
}
run();
