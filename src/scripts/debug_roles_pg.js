
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

        console.log("Debugging HMS Roles...");

        // 1. Get Tenant for 'recep' user (or generic check)
        const userRes = await client.query("SELECT id, email, tenant_id FROM app_user WHERE email ILIKE '%recep%' LIMIT 1");
        if (userRes.rows.length === 0) {
            console.log("No 'recep' user found. Checking any user...");
            const anyUser = await client.query("SELECT id, email, tenant_id FROM app_user LIMIT 1");
            if (anyUser.rows.length === 0) {
                console.log("No users found at all.");
                return;
            }
            // Use this tenant
            userRes.rows = anyUser.rows;
        }

        const tenantId = userRes.rows[0].tenant_id;
        console.log(`Checking Tenant: ${tenantId}`);

        // 2. Check Roles
        const roleRes = await client.query("SELECT id, name FROM hms_role WHERE tenant_id = $1", [tenantId]);
        console.log(`HMS Roles Found: ${roleRes.rows.length}`);
        roleRes.rows.forEach(r => console.log(` - ${r.name} (${r.id})`));

        if (roleRes.rows.length === 0) {
            console.log("SEEDING DEFAULT ROLES...");
            const defaults = [
                'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Accountant'
            ];

            for (const name of defaults) {
                await client.query("INSERT INTO hms_role (tenant_id, name, description) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [tenantId, name, `Role for ${name}`]);
            }
            console.log("Seeding Complete.");

            const verify = await client.query("SELECT id, name FROM hms_role WHERE tenant_id = $1", [tenantId]);
            console.log(`Roles after seeding: ${verify.rows.length}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
main();
