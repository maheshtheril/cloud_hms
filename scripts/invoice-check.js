
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true'
});

async function check() {
  try {
    await client.connect();
    // Broad search for invoices in this tenant
    const res = await client.query("SELECT id, invoice_number, company_id, tenant_id FROM hms_invoice WHERE tenant_id = '4fceafe4-fa32-4016-856e-39a7e0e58d22' LIMIT 5");
    console.log("INVOICE_LIST:", JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("DB_ERROR:", err.message);
  } finally {
    await client.end();
  }
}
check();
