const { Client } = require('pg');

const configs = [
    { name: 'FIREFLY', host: '13.228.46.236', password: 'npg_LKIg3tRXfbp9', server: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' },
    { name: 'TINY_LAB', host: '13.228.184.177', password: 'npg_t3GQCEaDsY5M', server: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
];

async function finalSync() {
    for (const conf of configs) {
        const client = new Client({
            host: conf.host,
            user: 'neondb_owner',
            password: conf.password,
            database: 'neondb',
            ssl: { rejectUnauthorized: false, servername: conf.server }
        });

        try {
            await client.connect();
            console.log(`\n=== SYNCING ${conf.name} ===`);

            // 1. Force Menu Cleanup in DB
            await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
            await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals?v=2230' WHERE key = 'crm-deals'");

            // 2. Ensure ALL Mahesh users have a pipeline
            const users = await client.query("SELECT DISTINCT tenant_id FROM app_user WHERE email ILIKE '%mahesh%' OR name ILIKE '%mahesh%'");
            for (const u of users.rows) {
                const tid = u.tenant_id;
                if (!tid) continue;

                const pipes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tid]);
                let pid;
                if (pipes.rows.length === 0) {
                    const res = await client.query("INSERT INTO crm_pipelines (tenant_id, name, is_default) VALUES ($1, 'Main Pipeline', true) RETURNING id", [tid]);
                    pid = res.rows[0].id;
                } else {
                    pid = pipes.rows[0].id;
                }

                const stages = await client.query("SELECT id FROM crm_stages WHERE pipeline_id = $1", [pid]);
                if (stages.rows.length === 0) {
                    const sData = [['New', 10], ['Qualified', 20], ['Proposal', 30], ['Won', 50], ['Lost', 60]];
                    for (const [n, s] of sData) {
                        await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, n, s]);
                    }
                }
            }
            console.log(`✅ ${conf.name} Sync Complete.`);
        } catch (e) {
            console.error(`${conf.name} ERROR:`, e.message);
        } finally {
            await client.end();
        }
    }
}
finalSync();
