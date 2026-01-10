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

        console.log("--- RECEPTION MENU ITEM DETAILS ---");
        const res = await client.query(`
            SELECT id, label, url, key, permission_code, module_key
            FROM menu_items 
            WHERE url LIKE '%reception%' OR label ILIKE '%Reception%'
        `);

        console.log(JSON.stringify(res.rows, null, 2));

        console.log("\n--- USER PERMISSIONS FOR 'ree' ---");
        const userRes = await client.query("SELECT id FROM app_user WHERE email ILIKE '%ree%' LIMIT 1");
        const userId = userRes.rows[0].id;

        const rolePerms = await client.query(`
            SELECT rp.permission_code 
            FROM role_permission rp
            JOIN user_role ur ON ur.role_id = rp.role_id
            WHERE ur.user_id = $1 AND rp.is_granted = true
        `, [userId]);

        const perms = rolePerms.rows.map(r => r.permission_code);
        console.log("Granted Perms:", perms);

        console.log(`\nHas 'hms:dashboard:reception'? ${perms.includes('hms:dashboard:reception')}`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
