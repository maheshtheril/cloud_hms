const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

let connectionString = process.env.DATABASE_URL;
// Env loader fallback
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
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    if (key === 'DATABASE_URL') connectionString = value;
                }
            });
        }
    } catch (e) { }
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
    try {
        await client.connect();

        const res = await client.query(`
            SELECT label, url, permission_code, module_key 
            FROM menu_items 
            WHERE label ILIKE '%Recep%' OR label ILIKE '%Attend%' OR label ILIKE '%Dash%'
            ORDER BY sort_order ASC
        `);

        let output = "Found Menu Items (PG):\n";
        res.rows.forEach(i => {
            output += `Label: ${i.label.padEnd(25)} | URL: ${i.url.padEnd(30)} | Perm: ${i.permission_code} | Module: ${i.module_key}\n`;
        });

        if (res.rows.length === 0) output += "No matches found.\n";

        console.log(output);
        fs.writeFileSync(path.join(__dirname, '../../menu_check_utf8.txt'), output, 'utf8');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
