const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function forceUndelete() {
    try {
        await client.connect();
        const users = await client.query("SELECT DISTINCT tenant_id FROM app_user WHERE email ILIKE '%sari%' OR email ILIKE '%mahesh%'");
        for (const u of users.rows) {
            const tid = u.tenant_id;
            await client.query("UPDATE crm_pipelines SET deleted_at = NULL WHERE tenant_id = $1", [tid]);
            await client.query("UPDATE crm_stages SET deleted_at = NULL WHERE pipeline_id IN (SELECT id FROM crm_pipelines WHERE tenant_id = $1)", [tid]);
        }
    } catch (e) { console.error(e); } finally { await client.end(); }
}
forceUndelete();
