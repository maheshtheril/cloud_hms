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

        console.log("Checking User 'ree'...");
        const userRes = await client.query("SELECT id, email, role, name FROM app_user WHERE email ILIKE '%ree%' OR name ILIKE '%ree%' LIMIT 1");

        if (userRes.rows.length === 0) {
            console.log("User 'ree' not found.");
            return;
        }

        const user = userRes.rows[0];
        console.log(`Found User: ${user.name} (${user.email}) | Legacy Role: ${user.role} | ID: ${user.id}`);

        console.log("Checking Assigned Core Roles (user_role table)...");
        const roles = await client.query(`
            SELECT r.id, r.name, r.key 
            FROM user_role ur 
            JOIN role r ON ur.role_id = r.id 
            WHERE ur.user_id = $1
        `, [user.id]);

        if (roles.rows.length === 0) {
            console.log("❌ No Core Roles assigned in 'user_role' table!");

            // ATTEMPT REPAIR
            console.log("Attempting repair...");
            const recepRole = await client.query("SELECT id FROM role WHERE key = 'receptionist'");
            if (recepRole.rows.length > 0) {
                const roleId = recepRole.rows[0].id;
                await client.query("INSERT INTO user_role (user_id, role_id, tenant_id) VALUES ($1, $2, (SELECT tenant_id FROM app_user WHERE id = $1))", [user.id, roleId]);
                console.log("✅ Repair: Assigned Receptionist Core Role.");
            } else {
                console.log("❌ Could not find Receptionist role definition.");
            }

        } else {
            console.log(`✅ Assigned Roles: ${roles.rows.map(r => r.name).join(', ')}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
