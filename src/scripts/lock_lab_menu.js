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

        console.log("--- Checking Lab Menu ---");
        const res = await client.query(`
            SELECT id, label, url, key, permission_code 
            FROM menu_items 
            WHERE label ILIKE '%Lab%'
        `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("--- Updating Lab Menu to strict 'lab:view' ---");
        await client.query(`
            UPDATE menu_items 
            SET permission_code = 'lab:view' 
            WHERE label ILIKE '%Lab%'
        `);
        console.log("Update Complete");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
