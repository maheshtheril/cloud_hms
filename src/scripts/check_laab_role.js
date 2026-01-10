const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    const res = await client.query("SELECT email, role FROM app_user WHERE email ILIKE '%laab%'");
    console.log(res.rows);
    client.end();
}).catch(e => console.error(e));
