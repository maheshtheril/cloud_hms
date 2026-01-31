const { Client } = require('pg');

const configs = [
    { name: 'FIREFLY', host: '13.228.46.236', password: 'npg_LKIg3tRXfbp9', server: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' },
    { name: 'TINY_LAB', host: '13.228.184.177', password: 'npg_t3GQCEaDsY5M', server: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
];

async function check() {
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
            console.log(`\n=== ${conf.name} ===`);

            const user = await client.query("SELECT email, tenant_id FROM app_user WHERE email = 'sarimaheshtheri@gma.com'");
            if (user.rows[0]) {
                const tid = user.rows[0].tenant_id;
                const pipes = await client.query("SELECT id, name FROM crm_pipelines WHERE tenant_id = $1", [tid]);
                console.log(`User found! Tenant: ${tid}. Pipelines: ${pipes.rows.length}`);
                pipes.rows.forEach(p => console.log(`- ${p.name}`));
            } else {
                console.log('User sarimaheshtheri@gma.com not found.');
                const all = await client.query("SELECT email, tenant_id FROM app_user ORDER BY created_at DESC LIMIT 5");
                console.log('Last 5 users:');
                all.rows.forEach(u => console.log(`- ${u.email}`));
            }

        } catch (e) {
            console.error(e.message);
        } finally {
            await client.end();
        }
    }
}
check();
