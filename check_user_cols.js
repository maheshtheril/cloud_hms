
const { Client } = require('pg');

async function check() {
    const client = new Client({
        host: '13.228.184.177',
        port: 5432,
        user: 'neondb_owner',
        password: 'npg_LKIg3tRXfbp9',
        database: 'neondb',
        ssl: {
            rejectUnauthorized: false,
            servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
        }
    });

    await client.connect();

    const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'app_user'`);
    res.rows.forEach(r => console.log(r.column_name));

    await client.end();
}

check().catch(console.error);
