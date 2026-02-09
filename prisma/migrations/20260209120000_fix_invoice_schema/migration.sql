-- Fix for PRM-UNKNOWN malformed array literal: "[]"
-- Revert line_items type from jsonb[] to jsonb and set correct default
ALTER TABLE "hms_invoice" ALTER COLUMN "line_items" TYPE jsonb USING COALESCE("line_items"[1], '[]'::jsonb);
ALTER TABLE "hms_invoice" ALTER COLUMN "line_items" SET DEFAULT '[]'::jsonb;

-- Drop phantom columns that were shadowing relations and causing conflicts
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_invoice_lines" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_invoice_payments" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_payment_allocations" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_sales_return" CASCADE;

-- Recreate views dropped by CASCADE
CREATE OR REPLACE VIEW "invoices" AS 
 SELECT id,
    tenant_id,
    company_id,
    patient_id,
    encounter_id,
    invoice_number,
    issued_at,
    due_at,
    currency,
    currency_rate,
    subtotal,
    total_tax,
    total_discount,
    total,
    total_paid,
    status,
    line_items,
    billing_metadata,
    locked,
    created_by,
    created_at,
    updated_at
   FROM public.hms_invoice;

CREATE OR REPLACE VIEW "vw_hms_invoice_finance" AS 
 SELECT i.id AS invoice_id,
    i.tenant_id,
    i.company_id,
    i.invoice_number,
    i.issued_at,
    i.currency,
    i.total,
    i.total_tax,
    i.subtotal,
    i.line_items,
    jsonb_agg(jsonb_build_object('line_id', l.id, 'ref', l.line_ref, 'desc', l.description, 'qty', l.quantity, 'unit_price', l.unit_price, 'net', l.net_amount, 'account_code', l.account_code) ORDER BY l.line_idx) AS normalized_lines
   FROM public.hms_invoice i
     LEFT JOIN public.hms_invoice_lines l ON i.id = l.invoice_id
  GROUP BY i.id;
