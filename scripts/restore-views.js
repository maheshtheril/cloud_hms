
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();
    console.log('Restoring essential views...');

    const views = [
        {
            name: 'invoices',
            def: `CREATE OR REPLACE VIEW invoices AS SELECT id, tenant_id, company_id, patient_id, encounter_id, invoice_number, issued_at, due_at, currency, currency_rate, subtotal, total_tax, total_discount, total, total_paid, status, line_items, billing_metadata, locked, created_by, created_at, updated_at FROM hms_invoice;`
        },
        {
            name: 'v_hms_invoice_status',
            def: `CREATE OR REPLACE VIEW v_hms_invoice_status AS SELECT id, tenant_id, company_id, patient_id, encounter_id, invoice_number, issued_at, due_at, currency, currency_rate, subtotal, total_tax, total_discount, total, total_paid, status, line_items, billing_metadata, locked, created_by, created_at, updated_at, outstanding, invoice_no, invoice_date, due_date, posted_at, outstanding_amount, COALESCE(outstanding_amount, 0::numeric) AS outstanding_amount_normalized, CASE WHEN lower(COALESCE(status::text, 'unpaid'::text)) = 'paid'::text THEN 'Paid'::text WHEN lower(COALESCE(status::text, 'unpaid'::text)) = 'partial'::text THEN 'Partially Paid'::text ELSE 'Unpaid'::text END AS payment_status FROM hms_invoice i;`
        },
        {
            name: 'vw_hms_invoice_finance',
            def: `CREATE OR REPLACE VIEW vw_hms_invoice_finance AS SELECT i.id AS invoice_id, i.tenant_id, i.company_id, i.invoice_number, i.issued_at, i.currency, i.total, i.total_tax, i.subtotal, i.line_items, jsonb_agg(jsonb_build_object('line_id', l.id, 'ref', l.line_ref, 'desc', l.description, 'qty', l.quantity, 'unit_price', l.unit_price, 'net', l.net_amount, 'account_code', l.account_code) ORDER BY l.line_idx) AS normalized_lines FROM hms_invoice i LEFT JOIN hms_invoice_lines l ON i.id = l.invoice_id GROUP BY i.id;`
        }
    ];

    for (const v of views) {
        console.log(`Creating view ${v.name}...`);
        await client.query(v.def);
    }

    console.log('Restoration complete.');
    await client.end();
}

main();
