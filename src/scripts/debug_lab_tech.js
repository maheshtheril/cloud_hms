const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    // Check Doctors Menu
    const docRes = await client.query("SELECT key, label, permission_code FROM menu_items WHERE label ILIKE '%Doctor%'");
    console.log("DOCTORS MENU:", JSON.stringify(docRes.rows, null, 2));

    // Check Lab Menu
    const labRes = await client.query("SELECT key, label, permission_code FROM menu_items WHERE label ILIKE '%Lab%'");
    console.log("LAB MENU:", JSON.stringify(labRes.rows, null, 2));

    // Check User Perms for laab
    const userRes = await client.query("SELECT id FROM app_user WHERE email ILIKE '%laab%' LIMIT 1");
    if (userRes.rows.length > 0) {
        const uid = userRes.rows[0].id;
        const up = await client.query("SELECT permission_code FROM user_permission WHERE user_id = $1", [uid]);
        console.log("USER PERMS:", up.rows.map(r => r.permission_code));

        const ur = await client.query("SELECT r.key, r.permissions FROM user_role ur JOIN role r ON ur.role_id = r.id WHERE ur.user_id = $1", [uid]);
        console.log("USER ROLES:", JSON.stringify(ur.rows, null, 2));
    }

    client.end();
}).catch(e => console.error(e));
