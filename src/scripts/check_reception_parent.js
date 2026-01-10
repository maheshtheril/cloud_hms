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

        const res = await client.query(`
            SELECT id, label, url, parent_id, permission_code, sort_order
            FROM menu_items 
            WHERE label ILIKE '%Reception%'
        `);

        console.log("Reception Menu Items:");
        for (const item of res.rows) {
            console.log(JSON.stringify(item, null, 2));
            if (item.parent_id) {
                const parent = await client.query('SELECT label, permission_code FROM menu_items WHERE id = $1', [item.parent_id]);
                console.log("  Parent:", parent.rows[0]);
            } else {
                console.log("  Parent: NULL (Top Level)");
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
