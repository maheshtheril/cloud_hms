const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

client.connect().then(async () => {
    const res = await client.query("SELECT * FROM information_schema.tables WHERE table_name = 'user_permission'");
    console.log(res.rows);
    client.end();
});
