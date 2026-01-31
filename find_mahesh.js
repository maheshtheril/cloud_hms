const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function find() {
    try {
        await client.connect();
        const users = await client.query("SELECT email, tenant_id FROM app_user WHERE email ILIKE '%mahesh%'");
        users.rows.forEach(u => console.log(`EMAIL:${u.email}|TENANT:${u.tenant_id}`));
    } catch (e) { console.error(e); } finally { await client.end(); }
}
find();
