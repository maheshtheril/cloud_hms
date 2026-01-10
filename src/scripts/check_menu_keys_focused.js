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

        console.log("--- RELEVANT KEYS ---");
        const res = await client.query(`
            SELECT key, label, permission_code 
            FROM menu_items 
            WHERE label ILIKE '%Patient%' 
               OR label ILIKE '%Bill%' 
               OR label ILIKE '%Appointment%'
        `);

        res.rows.forEach(r => {
            console.log(`Key: [${r.key}] | Label: ${r.label} | Perm: ${r.permission_code}`);
        });

    } catch (e) {
        console.error(e.message);
    } finally {
        await client.end();
    }
}
main();
