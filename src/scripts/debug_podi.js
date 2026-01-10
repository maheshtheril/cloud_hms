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

        console.log("--- Checking User 'podi' ---");
        const userRes = await client.query("SELECT id, email, name, tenant_id, role FROM app_user WHERE email ILIKE '%podi%' OR name ILIKE '%podi%'");
        const user = userRes.rows[0];

        if (!user) {
            console.log("User podi not found");
            return;
        }
        console.log(`User: ${user.name} (${user.email}) | ID: ${user.id} | Tenant: ${user.tenant_id} | LegacyRole: ${user.role}`);

        console.log("\n--- Checking Menu State (Global) ---");
        const menuRes = await client.query(`
            SELECT label, url, permission_code, key 
            FROM menu_items 
            WHERE key IN ('hms-reception', 'hms-attendance', 'hms-patients')
        `);
        console.log(JSON.stringify(menuRes.rows, null, 2));

        console.log("\n--- Checking User Permissions ---");
        // Check User Role Link
        const userRole = await client.query("SELECT role.name, role.key FROM user_role JOIN role ON user_role.role_id = role.id WHERE user_id = $1", [user.id]);
        console.log("Assigned Roles:", userRole.rows);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
