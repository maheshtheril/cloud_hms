const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function fix() {
    try {
        await client.connect();

        // 1. CLEAN UP MENU
        console.log('Cleaning up menus...');
        // Delete any redundant ones
        await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
        // Ensure 'crm-deals' has correct name and URL
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'");

        // 2. GET MAHESH TENANT
        const maheshRes = await client.query("SELECT tenant_id FROM app_user WHERE email ILIKE '%mahesh%' LIMIT 1");
        if (maheshRes.rows.length === 0) {
            console.log('Mahesh user not found?');
            return;
        }
        const tenantId = maheshRes.rows[0].tenant_id;
        console.log(`Fixing for Tenant: ${tenantId}`);

        // 3. CHECK FOR PIPELINES
        const pipeRes = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [tenantId]);

        if (pipeRes.rows.length === 0) {
            console.log('Creating missing standard pipeline for this tenant...');
            // Create Pipeline
            const newPipe = await client.query(`
                INSERT INTO crm_pipelines (tenant_id, name, is_default)
                VALUES ($1, 'Standard Sales Pipeline', true)
                RETURNING id
            `, [tenantId]);
            const pipeId = newPipe.rows[0].id;

            // Create Stages
            const stages = [
                { name: 'New Lead', sort: 10, prob: 10 },
                { name: 'Contacted', sort: 20, prob: 30 },
                { name: 'Proposal', sort: 30, prob: 60 },
                { name: 'Negotiation', sort: 40, prob: 80 },
                { name: 'Closed Won', sort: 50, prob: 100, type: 'won' },
                { name: 'Closed Lost', sort: 60, prob: 0, type: 'lost' }
            ];

            for (const s of stages) {
                await client.query(`
                    INSERT INTO crm_stages (pipeline_id, name, sort_order, probability, type)
                    VALUES ($1, $2, $3, $4, $5)
                `, [pipeId, s.name, s.sort, s.prob, s.type || 'open']);
            }
            console.log('✅ Pipeline and Stages seeded.');
        } else {
            console.log('Tenant already has a pipeline.');
        }

        console.log('🚀 Final fix complete.');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
fix();
