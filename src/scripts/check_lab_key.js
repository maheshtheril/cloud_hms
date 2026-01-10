const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    const res = await client.query("SELECT key, label, url, permission_code FROM menu_items WHERE url LIKE '%/hms/lab/dashboard%' OR label ILIKE '%Lab%'");
    console.log(JSON.stringify(res.rows, null, 2));
    client.end();
}).catch(e => console.error(e));
