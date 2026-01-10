const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
    try {
        await client.connect();
        console.log("Connected.");

        // Find user by email 'laab' (flexible)
        const res = await client.query("SELECT id, email, role, name, tenant_id FROM app_user WHERE email ILIKE '%laab%' OR name ILIKE '%laab%'");
        if (res.rows.length === 0) {
            console.log("User laab NOT FOUND.");
            return;
        }

        const user = res.rows[0];
        console.log("User Found:", user);

        // 1. Force Update Legacy Role Column
        console.log("Updating app_user.role to 'lab_technician'...");
        await client.query("UPDATE app_user SET role = 'lab_technician' WHERE id = $1", [user.id]);

        // 2. Find Lab Technician Role ID
        const roleRes = await client.query("SELECT id FROM role WHERE key = 'lab_technician'");
        let roleId;
        if (roleRes.rows.length === 0) {
            console.log("Role 'lab_technician' NOT FOUND in role table. Creating it...");
            const newRole = await client.query(`
                INSERT INTO role (tenant_id, key, name, permissions)
                VALUES ($1, 'lab_technician', 'Lab Technician', ARRAY['lab:view', 'hms:view'])
                RETURNING id
            `, [user.tenant_id]);
            roleId = newRole.rows[0].id;
        } else {
            roleId = roleRes.rows[0].id;
        }

        // 3. Link User to Role
        console.log(`Linking User ${user.id} to Role ${roleId}...`);
        await client.query(`
            DELETE FROM user_role WHERE user_id = $1;
            INSERT INTO user_role (user_id, role_id, tenant_id) VALUES ($1, $2, $3);
        `, [user.id, roleId, user.tenant_id]);

        console.log("Fix Complete. User 'laab' is now strictly 'lab_technician'.");

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await client.end();
    }
}
run();
