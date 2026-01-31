const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function finalRepair() {
    try {
        await client.connect();
        console.log('--- CORRECT DB (TINY_LAB) FINAL REPAIR ---');

        // 1. MENU REPAIR (FORCE UNIQUE URL TO BREAK CACHE)
        console.log('Updating menus...');
        await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals?cache=force_9999' WHERE key = 'crm-deals'");

        // 2. FIND ALL RELEVANT TENANTS
        const users = await client.query("SELECT DISTINCT tenant_id FROM app_user WHERE email ILIKE '%mahesh%' OR name ILIKE '%mahesh%'");
        console.log(`Found ${users.rows.length} relevant tenants.`);

        for (const u of users.rows) {
            const tid = u.tenant_id;
            if (!tid) continue;
            console.log(`- Repairing Pipeline for Tenant: ${tid}`);

            // Ensure at least one pipeline exists
            const pipes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tid]);

            let pid;
            if (pipes.rows.length === 0) {
                console.log(`  creating pipeline...`);
                const res = await client.query("INSERT INTO crm_pipelines (tenant_id, name, is_default) VALUES ($1, 'Main Sales Pipeline', true) RETURNING id", [tid]);
                pid = res.rows[0].id;
            } else {
                console.log(`  pipeline already exists.`);
                pid = pipes.rows[0].id;
            }

            // Ensure stages exist for this PID
            const stages = await client.query("SELECT id FROM crm_stages WHERE pipeline_id = $1 AND deleted_at IS NULL", [pid]);
            if (stages.rows.length === 0) {
                console.log(`  creating stages...`);
                const sData = [['New', 10], ['Qualified', 20], ['Proposal', 30], ['Won', 50], ['Lost', 60]];
                for (const [n, s] of sData) {
                    await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, n, s]);
                }
            } else {
                console.log(`  stages already exist.`);
            }
        }

        console.log('✅ REPAIR COMPLETE.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
finalRepair();
