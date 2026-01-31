const { Client } = require('pg');

const configs = [
    { name: 'FIREFLY', host: '13.228.46.236', password: 'npg_LKIg3tRXfbp9', server: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' },
    { name: 'TINY_LAB', host: '13.228.184.177', password: 'npg_t3GQCEaDsY5M', server: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
];

async function diagnostic() {
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
            console.log(`\n=== DATABASE: ${conf.name} ===`);

            const users = await client.query("SELECT email, tenant_id FROM app_user WHERE email ILIKE '%mahesh%'");
            if (users.rows.length === 0) {
                console.log('No mahesh users found.');
            } else {
                for (const u of users.rows) {
                    const pipes = await client.query("SELECT id, name FROM crm_pipelines WHERE tenant_id = $1 AND deleted_at IS NULL", [u.tenant_id]);
                    console.log(`User: ${u.email} | Tenant: ${u.tenant_id} | Pipelines: ${pipes.rows.length}`);
                    pipes.rows.forEach(p => console.log(`  - ${p.name}`));
                }
            }

        } catch (e) {
            console.error(e.message);
        } finally {
            await client.end();
        }
    }
}
diagnostic();
