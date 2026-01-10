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

        console.log("--- Restoring Strict Menu Permissions ---");

        // 1. Reception Desk -> hms:dashboard:reception
        // Only Receptionists have this.
        await client.query(`
            UPDATE menu_items 
            SET permission_code = 'hms:dashboard:reception' 
            WHERE key = 'hms-reception'
        `);
        console.log("Restored 'Reception Desk' to 'hms:dashboard:reception'");

        // 2. Billing -> billing:view
        // Receptionists, Admins, Accountants have this. Nurses do not.
        await client.query(`
            UPDATE menu_items 
            SET permission_code = 'billing:view' 
            WHERE key = 'hms-billing'
        `);
        console.log("Restored 'Billing' to 'billing:view'");

        // 3. Patients -> patients:view
        // Nurses DO have this. But strictly enforcing it removes it for anyone else (e.g. Lab Tech if they don't have it).
        await client.query(`
            UPDATE menu_items 
            SET permission_code = 'patients:view' 
            WHERE key = 'hms-patients'
        `);
        console.log("Restored 'Patients' to 'patients:view'");

        // 4. Appointments -> appointments:view
        await client.query(`
            UPDATE menu_items 
            SET permission_code = 'appointments:view' 
            WHERE key = 'hms-appointments'
        `);
        console.log("Restored 'Appointments' to 'appointments:view'");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
