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
        const u = userRes.rows[0];
        console.log('EMAIL:', u.email);
        console.log('TID:', u.tenant_id);
        console.log('METADATA:', JSON.stringify(u.metadata));

        const tenantRes = await client.query("SELECT * FROM tenant WHERE id = $1", [u.tenant_id]);
        const t = tenantRes.rows[0];
        if (t) {
            console.log('TENANT_ID:', t.id);
            console.log('TENANT_DOMAIN:', t.domain);
            console.log('TENANT_SLUG:', t.slug);
            console.log('TENANT_META:', JSON.stringify(t.metadata));
        } else {
            console.log('TENANT NOT FOUND');
        }

    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
