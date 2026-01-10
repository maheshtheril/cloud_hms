
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

        console.log("Debugging HMS Roles (Force Seed)...");

        // 1. Get Tenant
        const userRes = await client.query("SELECT id, email, tenant_id FROM app_user WHERE email ILIKE '%recep%' LIMIT 1");
        let tenantId;
        if (userRes.rows.length > 0) {
            tenantId = userRes.rows[0].tenant_id;
        } else {
            // Fallback
            const anyUser = await client.query("SELECT tenant_id FROM app_user LIMIT 1");
            tenantId = anyUser.rows[0].tenant_id;
        }
        console.log(`Checking Tenant: ${tenantId}`);

        const defaults = [
            'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Accountant'
        ];

        console.log("Ensuring all default roles exist...");
        for (const name of defaults) {
            const exist = await client.query("SELECT id FROM hms_role WHERE tenant_id = $1 AND name = $2", [tenantId, name]);
            if (exist.rows.length === 0) {
                console.log(`Creating ${name}...`);
                await client.query("INSERT INTO hms_role (tenant_id, name, description) VALUES ($1, $2, $3)", [tenantId, name, `Role for ${name}`]);
            }
        }

        const verify = await client.query("SELECT id, name FROM hms_role WHERE tenant_id = $1 ORDER BY name", [tenantId]);
        console.log(`Roles available now: ${verify.rows.length}`);
        verify.rows.forEach(r => console.log(` - ${r.name} (${r.id})`));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
main();
