import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function reproduce() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('🔄 Attempting to create invoice...');

        const tenantId = 'ef13103b-c57d-446f-9696-54f50fa3860e';
        const companyId = '9318e6d6-beb7-4945-b488-41e49b4875e0';
        const patientId = '6a9119f4-e525-45f3-920c-9d3e28e98847';

        // Match the user's insert structure roughly
        const query = `
            INSERT INTO "public"."hms_invoice" (
                "id",
                "tenant_id",
                "company_id",
                "patient_id",
                "invoice_number",
                "issued_at",
                "currency",
                "currency_rate",
                "subtotal",
                "total_tax",
                "total_discount",
                "total",
                "total_paid",
                "status",
                "line_items",
                "created_at",
                "updated_at",
                "invoice_date",
                "outstanding_amount"
            ) VALUES (
                gen_random_uuid(),
                $1, $2, $3,
                'INV-TEST-' || extract(epoch from now())::int,
                now(),
                'INR',
                1,
                500, 0, 0, 500, 0,
                'draft',
                '[{"description": "Test Fee", "net_amount": 500, "quantity": 1, "unit_price": 500}]'::jsonb,
                now(), now(),
                now(),
                500
            ) RETURNING id;
        `;

        const res = await client.query(query, [tenantId, companyId, patientId]);
        console.log('✅ Invoice created successfully! ID:', res.rows[0].id);

        // Clean up
        await client.query('DELETE FROM hms_invoice WHERE id = $1', [res.rows[0].id]);
        console.log('🧹 Cleaned up test invoice');

    } catch (error) {
        console.error('❌ Error reproducing issue:');
        console.error(error.message);
    } finally {
        await client.end();
    }
}

reproduce();
