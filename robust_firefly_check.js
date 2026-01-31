const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function check() {
    try {
        await client.connect();
        const userRes = await client.query("SELECT * FROM app_user WHERE email = 'sarimaheshtheri@gma.com' OR email ILIKE '%mahesh%'");
        if (userRes.rows.length === 0) {
            console.log('No Mahesh found on Firefly.');
            return;
        }

        for (const user of userRes.rows) {
            console.log(`\n--- USER: ${user.email} ---`);
            console.log('Metadata:', JSON.stringify(user.metadata));
            const tid = user.tenant_id;
            console.log('TenantID:', tid);

            const pipes = await client.query("SELECT * FROM crm_pipelines WHERE tenant_id = $1", [tid]);
            console.log('Pipelines found:', pipes.rows.length);

            for (const p of pipes.rows) {
                console.log(`Pipeline: ${p.id} (${p.name}) | Deleted: ${p.deleted_at}`);
                const stages = await client.query("SELECT * FROM crm_stages WHERE pipeline_id = $1", [p.id]);
                console.log(`  Stages count: ${stages.rows.length}`);
                stages.rows.forEach(s => console.log(`    - ${s.name} (Deleted: ${s.deleted_at})`));
            }
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await client.end();
    }
}
check();
