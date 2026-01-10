const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    try {
        const envPath = path.resolve(__dirname, '../../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return;
                let [key, ...valueParts] = line.split('=');
                let value = valueParts.join('=');
                if (key && value) {
                    key = key.trim();
                    value = value.trim();
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    if (key === 'DATABASE_URL') connectionString = value;
                }
            });
        }
    } catch (e) { }
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();
        console.log("Fixing permissions (PG)...");

        // 1. Update Menu Item 'Attendance'
        console.log("Updating Menu Item permission...");
        await client.query(`
            UPDATE menu_items 
            SET permission_code = 'attendance:view' 
            WHERE url = '/hms/attendance'
        `);

        // 2. Ensure Permission Exists
        console.log("Ensuring Permission exists...");
        const hmsModuleRes = await client.query("SELECT id FROM modules WHERE module_key = 'hms'");
        if (hmsModuleRes.rows.length > 0) {
            const moduleId = hmsModuleRes.rows[0].id;
            await client.query(`
                INSERT INTO permission (code, name, description, module_id)
                VALUES ('attendance:view', 'View Attendance', 'View staff attendance', $1)
                ON CONFLICT (code) DO NOTHING
            `, [moduleId]);
        }

        // 3. Grant to Receptionist
        console.log("Granting to Receptionist...");
        const roleRes = await client.query(`
            SELECT id FROM role WHERE key = 'receptionist' OR name = 'Receptionist'
        `);

        for (const row of roleRes.rows) {
            await client.query(`
                INSERT INTO role_permission (role_id, permission_code, is_granted)
                VALUES ($1, 'attendance:view', true)
                ON CONFLICT (role_id, permission_code) 
                DO UPDATE SET is_granted = true
            `, [row.id]);
        }

        console.log("✅ Fix applied successfully.");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
