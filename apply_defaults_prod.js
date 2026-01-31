const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function applyDefaults() {
    try {
        await client.connect();
        console.log('Applying defaults to Production DB...');

        // crm_pipelines
        await client.query("ALTER TABLE crm_pipelines ALTER COLUMN id SET DEFAULT gen_random_uuid()");
        await client.query("ALTER TABLE crm_pipelines ALTER COLUMN created_at SET DEFAULT now()");
        await client.query("ALTER TABLE crm_pipelines ALTER COLUMN is_default SET DEFAULT false");

        // crm_stages
        await client.query("ALTER TABLE crm_stages ALTER COLUMN id SET DEFAULT gen_random_uuid()");
        await client.query("ALTER TABLE crm_stages ALTER COLUMN type SET DEFAULT 'open'");
        await client.query("ALTER TABLE crm_stages ALTER COLUMN probability SET DEFAULT 0");
        await client.query("ALTER TABLE crm_stages ALTER COLUMN sort_order SET DEFAULT 0");

        // crm_deals
        await client.query("ALTER TABLE crm_deals ALTER COLUMN id SET DEFAULT gen_random_uuid()");
        await client.query("ALTER TABLE crm_deals ALTER COLUMN created_at SET DEFAULT now()");
        await client.query("ALTER TABLE crm_deals ALTER COLUMN value SET DEFAULT 0");
        await client.query("ALTER TABLE crm_deals ALTER COLUMN status SET DEFAULT 'open'");

        console.log('✅ Defaults applied.');
    } catch (e) { console.error(e); } finally { await client.end(); }
}
applyDefaults();
