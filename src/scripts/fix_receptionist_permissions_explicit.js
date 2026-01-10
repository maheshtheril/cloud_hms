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

        console.log("--- Fixing Receptionist Permissions ---");

        // 1. Get Receptionist Role
        const roleRes = await client.query("SELECT id, name FROM role WHERE key = 'receptionist' OR name = 'Receptionist'");

        if (roleRes.rows.length === 0) {
            console.error("❌ Receptionist role not found!");
            return;
        }

        const role = roleRes.rows[0];
        console.log(`Found Role: ${role.name} (${role.id})`);

        // 2. Define Permissions to Grant
        const permsToGrant = [
            'hms:dashboard:reception',
            'attendance:view',
            'hms:view',
            'patients:view',
            'patients:create',
            'patients:edit',
            'appointments:view',
            'appointments:create',
            'appointments:edit',
            'billing:view',
            'billing:create'
        ];

        // 3. Grant Permissions
        for (const code of permsToGrant) {
            // Ensure permission exists in definition table first
            // Ensure permission exists in definition table first
            try {
                const checkPerm = await client.query("SELECT 1 FROM permission WHERE code = $1", [code]);
                if (checkPerm.rows.length === 0) {
                    await client.query(`
                        INSERT INTO permission (code, name, description, module_id)
                        VALUES ($1, $1, 'Auto-generated', (SELECT id FROM modules LIMIT 1))
                    `, [code]);
                }
            } catch (err) { }

            // Grant to Role
            // Grant to Role
            try {
                const check = await client.query(
                    "SELECT 1 FROM role_permission WHERE role_id = $1 AND permission_code = $2",
                    [role.id, code]
                );

                if (check.rows.length === 0) {
                    await client.query(`
                        INSERT INTO role_permission (role_id, permission_code, is_granted)
                        VALUES ($1, $2, true)
                    `, [role.id, code]);
                    console.log(`✅ Granted: ${code}`);
                } else {
                    console.log(`ℹ️ Already has: ${code}`);
                }
            } catch (err) {
                console.error(`Error granting ${code}:`, err.message);
            }
        }

        console.log("--- Fix Complete ---");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
