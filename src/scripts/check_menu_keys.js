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

        console.log("--- MENU KEYS ---");
        // Check if key column exists first by selecting it
        const res = await client.query(`
            SELECT id, label, url, key, permission_code 
            FROM menu_items 
            WHERE module_key = 'hms'
            ORDER BY sort_order
        `);

        res.rows.forEach(r => {
            console.log(`Key: [${r.key?.padEnd(20)}] | Label: ${r.label.padEnd(20)} | Perm: ${r.permission_code}`);
        });

    } catch (e) {
        console.error(e.message);
    } finally {
        await client.end();
    }
}
main();
