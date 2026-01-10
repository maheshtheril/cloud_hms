
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

        const key = 'hms-reception';
        const label = 'Reception';
        const url = '/hms/reception/dashboard';
        const icon = 'MonitorCheck';
        const sort_order = 12;
        const permission_code = 'hms:dashboard:reception';
        const module_key = 'hms';

        // Check if exists
        const res = await client.query("SELECT id FROM menu_items WHERE key = $1", [key]);

        if (res.rows.length === 0) {
            console.log("Creating menu item...");
            await client.query(
                "INSERT INTO menu_items (key, label, url, icon, sort_order, permission_code, module_key, is_global) VALUES ($1, $2, $3, $4, $5, $6, $7, true)",
                [key, label, url, icon, sort_order, permission_code, module_key]
            );
            console.log("Created.");
        } else {
            console.log("Updating menu item...");
            await client.query(
                "UPDATE menu_items SET label=$2, url=$3, icon=$4, permission_code=$5, module_key=$6 WHERE key=$1",
                [key, label, url, icon, permission_code, module_key]
            );
            console.log("Updated.");
        }

    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.end();
    }
}
main();
