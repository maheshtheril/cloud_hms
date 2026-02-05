
const pg = require('pg');
const { Client } = pg;

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    const res = await client.query(`
        SELECT table_name, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'hms_invoice' AND column_name = 'id'
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}
check();
