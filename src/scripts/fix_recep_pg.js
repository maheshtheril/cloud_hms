
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
    } catch (e) { }
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();

        console.log("pg: Fixing Receptionist...");

        // 1. Find User
        const userRes = await client.query("SELECT id, email, tenant_id FROM app_user WHERE email ILIKE '%recep%' LIMIT 1");
        if (userRes.rows.length === 0) {
            console.log("No user found.");
            return;
        }
        const user = userRes.rows[0];
        console.log(`User: ${user.email}, Tenant: ${user.tenant_id}`);

        // 2. Find Company
        const compRes = await client.query("SELECT id, name FROM company WHERE tenant_id = $1 LIMIT 1", [user.tenant_id]);
        if (compRes.rows.length > 0) {
            const company = compRes.rows[0];
            console.log(`Assigning Company: ${company.name}`);
            await client.query("UPDATE app_user SET company_id = $1 WHERE id = $2", [company.id, user.id]);
        } else {
            console.log("No company found! Creating dummy company...");
            const newComp = await client.query("INSERT INTO company (tenant_id, name) VALUES ($1, 'Default Hospital') RETURNING id", [user.tenant_id]);
            await client.query("UPDATE app_user SET company_id = $1 WHERE id = $2", [newComp.rows[0].id, user.id]);
        }

        // 3. Fix Role Link
        const roleRes = await client.query("SELECT id, key FROM role WHERE key = 'receptionist' AND tenant_id = $1", [user.tenant_id]);
        let roleId;
        if (roleRes.rows.length > 0) {
            roleId = roleRes.rows[0].id;
        } else {
            console.log("Creating Role...");
            const newRole = await client.query("INSERT INTO role (tenant_id, key, name, permissions) VALUES ($1, 'receptionist', 'Receptionist', $2::text[]) RETURNING id", [user.tenant_id, ['hms:view', 'hms:dashboard:reception']]);
            roleId = newRole.rows[0].id;
            // Also seed permissions table if needed, but array column helps
        }

        // Link
        const urRes = await client.query("SELECT * FROM user_role WHERE user_id = $1 AND role_id = $2", [user.id, roleId]);
        if (urRes.rows.length === 0) {
            console.log("Linking User Role...");
            await client.query("INSERT INTO user_role (user_id, role_id, tenant_id) VALUES ($1, $2, $3)", [user.id, roleId, user.tenant_id]);
        } else {
            console.log("User Role Link already exists.");
        }

        console.log("DONE.");

    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.end();
    }
}
main();
