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
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    if (key === 'DATABASE_URL') {
                        connectionString = value;
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

        console.log("Searching for 'Receptionist' role in CORE 'role' table...");

        // Find Role
        const roleRes = await client.query(`
            SELECT id, name, key 
            FROM role 
            WHERE name ILIKE 'Receptionist' OR key ILIKE 'receptionist'
        `);

        if (roleRes.rows.length === 0) {
            console.log("❌ Role 'Receptionist' not found in CORE table.");
            return;
        }

        const role = roleRes.rows[0];

        // Fetch Permissions
        const permRes = await client.query(`
            SELECT permission_code, is_granted 
            FROM role_permission 
            WHERE role_id = $1
            ORDER BY permission_code
        `, [role.id]);

        let output = `✅ Found Role: ${role.name} (ID: ${role.id}, Key: ${role.key})\n\n📋 Permissions (${permRes.rows.length}):\n`;
        if (permRes.rows.length === 0) {
            output += "No permissions assigned.\n";
        } else {
            permRes.rows.forEach(p => {
                output += `- ${p.permission_code.padEnd(40)} ${p.is_granted ? '[GRANTED]' : '[DENIED]'}\n`;
            });
        }

        console.log(output);
        fs.writeFileSync(path.join(__dirname, '../../permissions_utf8.txt'), output, 'utf8');

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

main();
