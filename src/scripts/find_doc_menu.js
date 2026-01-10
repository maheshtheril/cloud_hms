const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    // Dump all HMS menus to find the Doctors one
    const res = await client.query("SELECT key, label, permission_code FROM menu_items WHERE label ILIKE '%Doctor%' OR url ILIKE '%clinician%' OR label ILIKE '%Staff%'");
    console.log(JSON.stringify(res.rows, null, 2));
    client.end();
}).catch(e => console.error(e));
