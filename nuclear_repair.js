const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function nuclearFix() {
    try {
        await client.connect();
        console.log('--- NUCLEAR CRM REPAIR STARTED (PRODUCTION DB) ---');

        // 1. GLOBAL MENU REPAIR
        console.log('Repairing global menu structure...');
        await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'");

        // 2. REPAIR ALL TENANTS
        const tenantsRes = await client.query("SELECT DISTINCT tenant_id FROM app_user WHERE tenant_id IS NOT NULL");
        console.log(`Found ${tenantsRes.rows.length} tenants. Checking Pipelines...`);

        for (const tenant of tenantsRes.rows) {
            const tid = tenant.tenant_id;
            const pipeRes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tid]);

            if (pipeRes.rows.length === 0) {
                console.log(`- Seeding missing pipeline for tenant: ${tid}`);
                const newPipe = await client.query(`
                    INSERT INTO crm_pipelines (tenant_id, name, is_default)
                    VALUES ($1, 'Standard Sales Pipeline', true)
                    RETURNING id
                `, [tid]);
                const pid = newPipe.rows[0].id;

                const stages = [
                    ['Fresh Lead', 10], ['Qualified', 20], ['Proposal', 30], ['Negotiation', 40], ['Won', 50], ['Lost', 60]
                ];
                for (const [name, sort] of stages) {
                    await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, name, sort]);
                }
            }
        }

        console.log('\n✅ NUCLEAR REPAIR COMPLETE. All tenants now have a pipeline and menus are cleaned.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
nuclearFix();
