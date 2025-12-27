
-- Drop potential triggers causing "column new does not exist" errors
DROP TRIGGER IF EXISTS trg_hms_invoice_lines_after_change ON hms_invoice_lines CASCADE;
DROP FUNCTION IF EXISTS trg_hms_invoice_lines_after_change() CASCADE;

DROP TRIGGER IF EXISTS trg_hms_invoice_after_change ON hms_invoice CASCADE;
DROP FUNCTION IF EXISTS trg_hms_invoice_after_change() CASCADE;

DROP TRIGGER IF EXISTS update_invoice_total ON hms_invoice_lines CASCADE;
DROP FUNCTION IF EXISTS update_invoice_total() CASCADE;

DROP TRIGGER IF EXISTS update_invoice_totals ON hms_invoice_lines CASCADE;
DROP FUNCTION IF EXISTS update_invoice_totals() CASCADE;
