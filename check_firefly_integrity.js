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
        const user = await client.query("SELECT * FROM app_user WHERE email = 'sarimaheshtheri@gma.com'");
        console.log('USER METADATA:', JSON.stringify(user.rows[0].metadata));

        const tid = user.rows[0].tenant_id;
        const pipes = await client.query("SELECT * FROM crm_pipelines WHERE tenant_id = $1", [tid]);
        console.log('PIPELINES:', JSON.stringify(pipes.rows));

        if (pipes.rows.length > 0) {
            const pid = pipes.rows[0].id;
            const stages = await client.query("SELECT * FROM crm_stages WHERE pipeline_id = $1", [pid]);
            console.log('STAGES:', JSON.stringify(stages.rows));
        }
    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
