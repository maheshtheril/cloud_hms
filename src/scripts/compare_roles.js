
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

        console.log("Comparing Role Tables...");

        // 1. Get Tenant (Default / First)
        let tenantId = null;
        const u = await client.query("SELECT tenant_id FROM app_user LIMIT 1");
        if (u.rows.length > 0) tenantId = u.rows[0].tenant_id;
        console.log("Tenant:", tenantId);

        if (!tenantId) return;

        // 2. Count hms_role
        const hms = await client.query("SELECT id, name FROM hms_role WHERE tenant_id = $1 ORDER BY name", [tenantId]);
        console.log(`\n[hms_role] (UI Roles): ${hms.rows.length}`);
        hms.rows.forEach(r => console.log(` - ${r.name}`));

        // 3. Count role
        const core = await client.query("SELECT id, name, key FROM role WHERE tenant_id = $1 ORDER BY name", [tenantId]);
        console.log(`\n[role] (Permission Roles): ${core.rows.length}`);
        core.rows.forEach(r => console.log(` - ${r.name} (Key: ${r.key})`));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
main();
