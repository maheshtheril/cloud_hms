const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

client.connect().then(async () => {
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'app_user'");
    console.log(res.rows.map(r => r.column_name));
    client.end();
});
