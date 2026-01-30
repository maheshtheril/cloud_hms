const { Client } = require('pg');
const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function check() {
    try {
        await client.connect();
        const p = await client.query('SELECT count(*) FROM crm_pipelines');
        const s = await client.query('SELECT count(*) FROM crm_stages');
        console.log(`Pipelines: ${p.rows[0].count}, Stages: ${s.rows[0].count}`);

        if (s.rows.length > 0) {
            const stages = await client.query('SELECT name, sort_order FROM crm_stages ORDER BY sort_order');
            stages.rows.forEach(r => console.log(`- ${r.name} (${r.sort_order})`));
        }
    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
