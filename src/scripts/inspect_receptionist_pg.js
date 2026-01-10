
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

async function main() {
    try {
        await client.connect();

        // 1. Role Check
        const roleRes = await client.query("SELECT id FROM role WHERE key = 'receptionist'");
        if (roleRes.rows.length > 0) {
            const rId = roleRes.rows[0].id;
            console.log(`[FOUND_ROLE] ID: ${rId}`);

            // 2. Permission Check
            const perm = await client.query("SELECT * FROM role_permission WHERE role_id = $1 AND permission_code = 'hms:dashboard:reception'", [rId]);
            console.log(`[HAS_PERM] ${perm.rows.length > 0}`);
        } else {
            console.log("[NO_ROLE]");
        }

        // 3. User Check (Column)
        const uCol = await client.query("SELECT count(*) FROM app_user WHERE role = 'receptionist'");
        console.log(`[USERS_COL] ${uCol.rows[0].count}`);

        // 4. User Check (RBAC)
        const uRbac = await client.query("SELECT count(*) FROM user_role ur JOIN role r ON ur.role_id = r.id WHERE r.key = 'receptionist'");
        console.log(`[USERS_RBAC] ${uRbac.rows[0].count}`);

    } catch (err) {
        console.error("Query failed:", err);
    } finally {
        await client.end();
    }
}

main();
