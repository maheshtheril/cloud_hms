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
        const userRes = await client.query("SELECT email, tenant_id FROM app_user WHERE email = 'sarimaheshtheri@gma.com'");
        if (userRes.rows.length === 0) {
            console.log('User not found on Tiny Lab.');
            return;
        }

        const tid = userRes.rows[0].tenant_id;
        console.log(`User: ${userRes.rows[0].email} | TenantID: ${tid}`);

        const pipes = await client.query("SELECT * FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tid]);
        console.log('Active Pipelines:', pipes.rows.length);

        for (const p of pipes.rows) {
            console.log(`Pipeline: ${p.id} (${p.name})`);
            const stages = await client.query("SELECT id, name FROM crm_stages WHERE pipeline_id = $1 AND deleted_at IS NULL", [p.id]);
            console.log(`  Stages: ${stages.rows.length}`);
            stages.rows.forEach(s => console.log(`    - ${s.name}`));
        }
    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
