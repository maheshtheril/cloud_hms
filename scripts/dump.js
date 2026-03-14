
const { Client } = require('pg');
const fs = require('fs');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true'
});

async function check() {
  try {
    await client.connect();
    const res = await client.query("SELECT id, tenant_id, company_id, key, value FROM hms_settings WHERE tenant_id = '4fceafe4-fa32-4016-856e-39a7e0e58d22' AND key = 'whatsapp_config'");
    fs.writeFileSync('all-configs-dump.json', JSON.stringify(res.rows, null, 2));
    console.log("Written to all-configs-dump.json");
  } catch (err) {
    console.error("DB_ERROR:", err.message);
  } finally {
    await client.end();
  }
}
check();
