const { Client } = require('pg');

// USING CONNECTION FROM .env (ep-flat-firefly)
const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function repair() {
    try {
        await client.connect();
        console.log('Connected to CORRECT database (ep-flat-firefly).');

        // 1. Clean Menus
        console.log('Cleaning menus...');
        await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'");

        // 2. Find Mahesh (sarimaheshtheri@gma.com)
        const userRes = await client.query("SELECT tenant_id FROM app_user WHERE email = 'sarimaheshtheri@gma.com' LIMIT 1");
        if (!userRes.rows[0]) {
            console.log('Mahesh user not found in this DB. checking all...');
            const all = await client.query("SELECT email, tenant_id FROM app_user LIMIT 10");
            all.rows.forEach(u => console.log(`- ${u.email} : ${u.tenant_id}`));
            return;
        }

        const tid = userRes.rows[0].tenant_id;
        console.log(`Fixing for Tenant: ${tid}`);

        // 3. Create Pipeline + Stages
        const pipeRes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tid]);
        if (pipeRes.rows.length === 0) {
            console.log('Creating Pipeline...');
            const newPipe = await client.query("INSERT INTO crm_pipelines (tenant_id, name, is_default) VALUES ($1, 'Sales Pipeline', true) RETURNING id", [tid]);
            const pid = newPipe.rows[0].id;

            const stages = [
                ['Fresh Lead', 10], ['Qualified', 20], ['Proposal', 30], ['Negotiation', 40], ['Won', 50], ['Lost', 60]
            ];
            for (const [name, sort] of stages) {
                await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, name, sort]);
            }
            console.log('✅ Pipeline Created.');
        } else {
            console.log('Pipeline already exists.');
        }

        console.log('✅ REPAIR COMPLETE.');
    } catch (e) { console.error(e); } finally { await client.end(); }
}
repair();
