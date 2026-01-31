const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function repair() {
    try {
        await client.connect();
        console.log('Connected to Seeakk ACTUAL database (ep-tiny-lab).');

        // 1. Clean Menus
        console.log('Cleaning menus...');
        await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'");

        // 2. Find Mahesh
        const userRes = await client.query("SELECT tenant_id, email FROM app_user WHERE email ILIKE '%mahesh%' LIMIT 1");
        if (!userRes.rows[0]) {
            console.log('Mahesh not found?');
            return;
        }
        const tid = userRes.rows[0].tenant_id;
        console.log(`Fixing for Tenant: ${tid} (${userRes.rows[0].email})`);

        // 3. Ensure Pipeline exists
        const pipeRes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tid]);
        if (pipeRes.rows.length === 0) {
            console.log('Creating missing pipeline...');
            const newPipe = await client.query("INSERT INTO crm_pipelines (tenant_id, name, is_default) VALUES ($1, 'Sales Pipeline', true) RETURNING id", [tid]);
            const pid = newPipe.rows[0].id;
            const stages = [['New', 10], ['Qualified', 20], ['Proposal', 30], ['Won', 50], ['Lost', 60]];
            for (const [n, s] of stages) {
                await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, n, s]);
            }
        } else {
            console.log('Pipeline already exists.');
        }

        console.log('✅ REPAIR ON CORRECT DB COMPLETE.');
    } catch (e) { console.error(e); } finally { await client.end(); }
}
repair();
