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

        const NEW_PERM = 'reception:view';
        console.log(`--- Creating Fresh Permission: ${NEW_PERM} ---`);

        // 1. Create Permission
        await client.query(`
            INSERT INTO permission (code, name, description, module_id)
            VALUES ($1, 'View Reception Desk', 'Access to Reception Dashboard', (SELECT id FROM modules WHERE module_key='hms' LIMIT 1))
            ON CONFLICT (code) DO NOTHING
        `, [NEW_PERM]);
        console.log("Permission Created");

        // 2. Grant to Receptionist Role
        const roleRes = await client.query("SELECT id FROM role WHERE key='receptionist'");
        if (roleRes.rows.length > 0) {
            await client.query(`
                INSERT INTO role_permission (role_id, permission_code, is_granted)
                VALUES ($1, $2, true)
                ON CONFLICT (role_id, permission_code) DO UPDATE SET is_granted = true
            `, [roleRes.rows[0].id, NEW_PERM]);
            console.log("Granted to Receptionist Role");
        }

        // 3. Grant to User REE directly (Nuclear)
        const userRes = await client.query("SELECT id, tenant_id FROM app_user WHERE email ILIKE '%ree%' LIMIT 1");
        if (userRes.rows.length > 0) {
            const user = userRes.rows[0];
            await client.query(`
                INSERT INTO user_permission (user_id, permission_code, is_granted, tenant_id)
                VALUES ($1, $2, true, $3)
                ON CONFLICT (user_id, permission_code) DO UPDATE SET is_granted = true
            `, [user.id, NEW_PERM, user.tenant_id]);
            console.log("Granted to User ree");
        }

        // 4. Update Menu Item
        await client.query(`
            UPDATE menu_items 
            SET permission_code = $1 
            WHERE key = 'hms-reception'
        `, [NEW_PERM]);
        console.log("Menu Item Updated");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
