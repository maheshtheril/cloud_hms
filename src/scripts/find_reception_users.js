
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

        console.log("Searching for potential receptionist users...");
        const res = await client.query("SELECT email, role FROM app_user WHERE email ILIKE '%reception%' OR role ILIKE '%reception%'");
        if (res.rows.length === 0) {
            console.log("No obvious receptionist users found.");
        } else {
            res.rows.forEach(r => console.log(`User: ${r.email}, Role: ${r.role}`));
        }

        // Check if any user has the receptionist role ID
        const roleRes = await client.query("SELECT id FROM role WHERE key = 'receptionist'");
        if (roleRes.rows.length > 0) {
            const rid = roleRes.rows[0].id;
            const urRes = await client.query("SELECT u.email FROM user_role ur JOIN app_user u ON ur.user_id = u.id WHERE ur.role_id = $1", [rid]);
            console.log(`Users with role_id ${rid}: ${urRes.rows.length}`);
            urRes.rows.forEach(r => console.log(` - ${r.email}`));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
main();
