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

        console.log("--- Forcing Menu Permissions via SQL (Relaxed) ---");

        const updates = [
            { key: 'hms-reception', perm: 'hms:view' },
            { key: 'hms-patients', perm: 'hms:view' },
            { key: 'hms-appointments', perm: 'hms:view' },
            { key: 'hms-billing', perm: 'hms:view' },
            { key: 'hms-schedule', perm: 'hms:view' },
            { key: 'hms-attendance', perm: 'hms:view' }
        ];

        for (const u of updates) {
            console.log(`Updating ${u.key} -> ${u.perm}`);
            // Update by KEY
            let res = await client.query(`UPDATE menu_items SET permission_code = $1 WHERE key = $2`, [u.perm, u.key]);

            if (res.rowCount === 0) {
                // Try fuzzy match by Label if Key missed
                const labelPattern = `%${u.key.split('-')[1]}%`;
                console.log(`Key miss. Trying label ILIKE ${labelPattern}`);
                res = await client.query(`
                    UPDATE menu_items SET permission_code = $1 
                    WHERE module_key = 'hms' AND label ILIKE $2
                `, [u.perm, labelPattern]);
            }

            console.log(`Rows updated: ${res.rowCount}`);
        }

    } catch (e) {
        console.error(e.message);
    } finally {
        await client.end();
    }
}
main();
