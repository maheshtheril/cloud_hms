
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load .env manually
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    try {
        const envPath = path.resolve(__dirname, '../../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2 && !line.trim().startsWith('#')) {
                    const key = parts[0].trim();
                    let val = parts.slice(1).join('=').trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (key === 'DATABASE_URL') {
                        connectionString = val;
                    }
                }
            });
        }
    } catch (e) {
        console.error("Failed to load .env", e.message);
    }
}

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const RECEPTION_PERMS = [
    'patients:view', 'patients:create', 'patients:edit',
    'appointments:view', 'appointments:create', 'appointments:edit',
    'billing:view', 'billing:create',
    'hms:view', 'hms:dashboard:reception'
];

async function main() {
    try {
        await client.connect();

        // 1. Ensure Permissions Exist
        for (const code of RECEPTION_PERMS) {
            const res = await client.query("SELECT * FROM permission WHERE code = $1", [code]);
            if (res.rows.length === 0) {
                console.log(`Creating missing permission: ${code}`);
                await client.query("INSERT INTO permission (code, name, category) VALUES ($1, $2, $3)", [code, code, 'HMS']);
            }
        }

        // 2. Get Role
        const roleRes = await client.query("SELECT id FROM role WHERE key = 'receptionist'");
        if (roleRes.rows.length === 0) {
            console.log("No role found with key 'receptionist'. Aborting patch (seed should run first).");
            return;
        }

        const roleId = roleRes.rows[0].id;
        console.log(`Patching role ID: ${roleId}`);

        // 3. Clear existing role_permissions for this role? 
        // Or just Upsert? Let's just Insert ignore or check existence.
        // Safer to just ensure they exist.

        for (const code of RECEPTION_PERMS) {
            const check = await client.query("SELECT * FROM role_permission WHERE role_id = $1 AND permission_code = $2", [roleId, code]);
            if (check.rows.length === 0) {
                console.log(`Granting ${code} to receptionist...`);
                await client.query("INSERT INTO role_permission (role_id, permission_code, is_granted) VALUES ($1, $2, true)", [roleId, code]);
            } else {
                // Ensure is_granted is true
                if (!check.rows[0].is_granted) {
                    await client.query("UPDATE role_permission SET is_granted = true WHERE role_id = $1 AND permission_code = $2", [roleId, code]);
                }
            }
        }

        // 4. Update the array column in 'role' table too, for consistency
        // First get current array
        const currentArrRes = await client.query("SELECT permissions FROM role WHERE id = $1", [roleId]);
        let currentArr = currentArrRes.rows[0].permissions || [];
        if (!Array.isArray(currentArr)) currentArr = [];

        let changed = false;
        RECEPTION_PERMS.forEach(p => {
            if (!currentArr.includes(p)) {
                currentArr.push(p);
                changed = true;
            }
        });

        if (changed) {
            console.log("Updating role.permissions array column...");
            // pg driver handles array conversion automatically for text[] columns
            await client.query("UPDATE role SET permissions = $1::text[] WHERE id = $2", [currentArr, roleId]);
        }

        console.log("SUCCESS: Receptionist role patched.");

    } catch (err) {
        console.error("Patch failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
