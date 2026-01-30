
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
    const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'app_user'`);
    console.log(JSON.stringify(res.rows));
    await client.end();
}

check().catch(console.error);
