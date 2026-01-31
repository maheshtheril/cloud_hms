const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function check() {
    try {
        await client.connect();
        const tid = 'd5f70e4e-9c63-41a0-b2bd-0207445fa699';
        const res = await client.query("SELECT id, slug, db_url FROM tenant WHERE id = $1", [tid]);
        console.log('TENANT_DB_URL:', JSON.stringify(res.rows[0]));

    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
