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

        console.log("--- Checking User Accounts ---");
        const res = await client.query("SELECT id, email, name, tenant_id FROM app_user WHERE email ILIKE '%ree%' OR name ILIKE '%ree%'");

        res.rows.forEach(u => {
            console.log(`User: ${u.name} (${u.email}) | ID: ${u.id} | Tenant: ${u.tenant_id}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
