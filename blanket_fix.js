const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function blanketFix() {
    try {
        await client.connect();
        const users = await client.query("SELECT DISTINCT tenant_id FROM app_user WHERE email ILIKE '%sari%' OR email ILIKE '%mahesh%'");
        for (const u of users.rows) {
            const tid = u.tenant_id;
            const pipes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1", [tid]);
            if (pipes.rows.length === 0) {
                console.log(`Creating pipe for ${tid}`);
                const res = await client.query("INSERT INTO crm_pipelines (tenant_id, name, is_default) VALUES ($1, 'Main Pipeline', true) RETURNING id", [tid]);
                const pid = res.rows[0].id;
                const stages = [['New', 10], ['Qualified', 20], ['Won', 50], ['Lost', 60]];
                for (const [n, s] of stages) {
                    await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, n, s]);
                }
            }
        }
    } catch (e) { console.error(e); } finally { await client.end(); }
}
blanketFix();
