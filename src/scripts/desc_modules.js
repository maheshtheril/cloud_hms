const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
    const res = await client.query("SELECT * FROM modules LIMIT 1");
    console.log(Object.keys(res.rows[0]));
    client.end();
}).catch(e => console.error(e));
