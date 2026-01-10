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

        console.log("--- PARENTAGE CHECK ---");
        const res = await client.query(`
            SELECT m1.label as Item, m1.key, m1.permission_code, 
                   m2.label as Parent, m2.permission_code as ParentPerm
            FROM menu_items m1
            LEFT JOIN menu_items m2 ON m1.parent_id = m2.id
            WHERE m1.module_key = 'hms'
        `);

        res.rows.forEach(r => {
            if (r.Parent) {
                console.log(`Item: ${r.Item} [${r.permission_code}] -> Parent: ${r.Parent} [${r.ParentPerm}]`);
            } else {
                console.log(`Item: ${r.Item} [${r.permission_code}] -> (Top Level)`);
            }
        });

    } catch (e) {
        console.error(e.message);
    } finally {
        await client.end();
    }
}
main();
