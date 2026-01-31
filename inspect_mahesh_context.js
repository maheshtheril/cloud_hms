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
        const userRes = await client.query("SELECT email, tenant_id, metadata FROM app_user WHERE email = 'sarimaheshtheri@gma.com'");
        console.log('USER:', JSON.stringify(userRes.rows[0]));

        const tenantRes = await client.query("SELECT * FROM tenant WHERE id = $1", [userRes.rows[0].tenant_id]);
        console.log('TENANT:', JSON.stringify(tenantRes.rows[0]));

    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
