const { Client } = require('pg');

const configs = [
    { name: 'FIREFLY', host: '13.228.46.236', password: 'npg_LKIg3tRXfbp9', server: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' },
    { name: 'TINY_LAB', host: '13.228.184.177', password: 'npg_t3GQCEaDsY5M', server: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
];

async function findSeeakk() {
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
            console.log(`\n=== CHECKING ${conf.name} ===`);
            const res = await client.query("SELECT id, name, domain, slug FROM tenant WHERE domain ILIKE '%seeakk%' OR slug ILIKE '%seeakk%'");
            console.log(JSON.stringify(res.rows));
        } catch (e) {
            console.error(e.message);
        } finally {
            await client.end();
        }
    }
}
findSeeakk();
