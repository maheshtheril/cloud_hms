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

        console.log("--- Nuclear Option: Granting User Direct Permissions ---");

        // 1. Get User
        const userRes = await client.query("SELECT id, tenant_id FROM app_user WHERE email ILIKE '%ree%' LIMIT 1");
        const user = userRes.rows[0];
        console.log(`User: ${user.id}`);

        const perms = [
            'hms:dashboard:reception',
            'attendance:view',
            'hms:view',
            'patients:view',
            'appointments:view',
            'billing:view'
        ];

        for (const p of perms) {
            // Ensure Perm exists using safe check
            const checkPerm = await client.query("SELECT 1 FROM permission WHERE code = $1", [p]);
            if (checkPerm.rows.length === 0) {
                try {
                    await client.query(`
                        INSERT INTO permission (code, name, description, module_id)
                        VALUES ($1, $1, 'Nuclear Grant', (SELECT id FROM modules LIMIT 1))
                    `, [p]);
                } catch (e) { }
            }

            // Grant to User using safe check
            const checkUp = await client.query("SELECT 1 FROM user_permission WHERE user_id = $1 AND permission_code = $2", [user.id, p]);
            if (checkUp.rows.length === 0) {
                await client.query(`
                    INSERT INTO user_permission (user_id, permission_code, is_granted, tenant_id)
                    VALUES ($1, $2, true, $3)
                `, [user.id, p, user.tenant_id]);
                console.log(`✅ Direct Grant: ${p}`);
            } else {
                console.log(`ℹ️ Already has: ${p}`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
