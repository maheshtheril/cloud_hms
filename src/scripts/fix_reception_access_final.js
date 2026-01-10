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

        console.log("--- DEBUG: Receptionist Access ---");

        // 1. Get Receptionist Role
        const roleRes = await client.query("SELECT id, name FROM role WHERE key='receptionist' OR name='Receptionist'");
        const role = roleRes.rows[0];
        console.log(`Role: ${role?.name} (${role?.id})`);

        if (role) {
            // Check if Role has the critical permission
            const permRes = await client.query(
                "SELECT is_granted FROM role_permission WHERE role_id = $1 AND permission_code = 'hms:dashboard:reception'",
                [role.id]
            );
            console.log(`Role has 'hms:dashboard:reception'? ${permRes.rows.length > 0}`);

            if (permRes.rows.length === 0) {
                console.log("FIXING: Granting 'hms:dashboard:reception' to Role...");
                await client.query(`
                    INSERT INTO role_permission (role_id, permission_code, is_granted)
                    VALUES ($1, 'hms:dashboard:reception', true)
                `, [role.id]);
            }
        }

        // 2. Check User Direct Perms (Nuclear Option Check)
        const userRes = await client.query("SELECT id FROM app_user WHERE email ILIKE '%ree%' OR name ILIKE '%ree%' LIMIT 1");
        const user = userRes.rows[0];
        if (user) {
            const userPermRes = await client.query(
                "SELECT is_granted FROM user_permission WHERE user_id = $1 AND permission_code = 'hms:dashboard:reception'",
                [user.id]
            );
            console.log(`User 'ree' has direct 'hms:dashboard:reception'? ${userPermRes.rows.length > 0}`);

            if (userPermRes.rows.length === 0) {
                console.log("FIXING: Granting 'hms:dashboard:reception' to User directly...");
                // Ensure permission exists first
                await client.query("INSERT INTO permission (code, name, module_id) VALUES ('hms:dashboard:reception', 'Access Reception', (SELECT id FROM modules LIMIT 1)) ON CONFLICT DO NOTHING");

                await client.query(`
                    INSERT INTO user_permission (user_id, permission_code, is_granted, tenant_id)
                    VALUES ($1, 'hms:dashboard:reception', true, (SELECT tenant_id FROM app_user WHERE id = $1))
                `, [user.id]);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
