const { Client } = require('pg');

const configs = [
    { name: 'FIREFLY', host: '13.228.46.236', password: 'npg_LKIg3tRXfbp9', server: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' },
    { name: 'TINY_LAB', host: '13.228.184.177', password: 'npg_t3GQCEaDsY5M', server: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
];

async function totalFix() {
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
            console.log(`\n=== REPAIRING ${conf.name} ===`);

            const tenants = await client.query(`
                SELECT DISTINCT t.id, t.name 
                FROM tenant t 
                JOIN app_user u ON u.tenant_id = t.id 
                WHERE u.email ILIKE '%mahesh%' OR u.name ILIKE '%mahesh%'
            `);

            console.log(`Found ${tenants.rows.length} relevant tenants.`);

            for (const t of tenants.rows) {
                console.log(`- Checking Pipeline for Tenant: ${t.name || t.id}`);
                const pipe = await client.query("SELECT id FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [t.id]);

                if (pipe.rows.length === 0) {
                    console.log(`   seeding pipeline...`);
                    const res = await client.query("INSERT INTO crm_pipelines (tenant_id, name, is_default) VALUES ($1, 'Sales Pipeline', true) RETURNING id", [t.id]);
                    const pid = res.rows[0].id;
                    const stages = [['Fresh Lead', 10], ['Qualified', 20], ['Proposal', 30], ['Negotiation', 40], ['Won', 50], ['Lost', 60]];
                    for (const [n, s] of stages) {
                        await client.query("INSERT INTO crm_stages (pipeline_id, name, sort_order) VALUES ($1, $2, $3)", [pid, n, s]);
                    }
                } else {
                    console.log(`   pipeline already exists.`);
                }
            }

            // Also ensure NO other pipeline exists globally or is mislinked
            await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals?v=omega' WHERE key = 'crm-deals'");
            await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");

        } catch (e) {
            console.error(`Error on ${conf.name}:`, e.message);
        } finally {
            await client.end();
        }
    }
}
totalFix();
