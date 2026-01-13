
const { Client } = require('pg');

// We'll try to guess the connection string or ask the user to provide it if this fails.
// Usually it's in .env, but I can't read .env easily in this specific restricted env without dotenv.
// However, I can try to read the .env file content first to get the URL.

const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const envPath = path.resolve(__dirname, '../../.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);

        if (!match) {
            console.error("Could not find DATABASE_URL in .env");
            return;
        }

        const connectionString = match[1];
        const client = new Client({ connectionString });
        await client.connect();

        console.log("Connected to DB. Inspecting Menus & Roles...\n");

        // 1. CHECK NURSE PERMISSIONS
        const nurseRole = await client.query(`SELECT id, name, permissions FROM role WHERE key='nurse'`);
        if (nurseRole.rows.length === 0) {
            console.log("CRITICAL: Nurse Role NOT FOUND.");
        } else {
            console.log("Nurse Role Config:");
            console.log(" - Permissions Array:", nurseRole.rows[0].permissions);

            const rolePerms = await client.query(`SELECT permission_code FROM role_permission WHERE role_id = $1`, [nurseRole.rows[0].id]);
            console.log(" - Permissions Table:", rolePerms.rows.map(r => r.permission_code));
        }

        console.log("\n2. CHECK MENU PERMISSIONS");
        const menus = await client.query(`
            SELECT label, key, permission_code, is_hidden 
            FROM menu_items 
            WHERE key IN ('hms-patients', 'hms-appointments', 'hms-nursing', 'hms-lab')
        `);

        menus.rows.forEach(m => {
            console.log(`Menu: [${m.label}] Key: ${m.key}`);
            console.log(`  - Required Perm: ${m.permission_code}`);
            console.log(`  - Hidden? ${m.is_hidden}`);
        });

        await client.end();

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
