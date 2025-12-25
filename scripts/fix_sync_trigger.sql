-- Fix for Potential Infinite Loop in Invoice Triggers (Split Version)
-- Problem: OLD is not available in INSERT triggers, causing "column does not exist" error.
-- Solution: Split triggers. Sync should happen on INSERT always, and UPDATE only when lines change.

BEGIN;

-- 1. Drop the existing sync trigger (if any variation exists)
DROP TRIGGER IF EXISTS trg_hms_sync_invoice_lines ON public.hms_invoice;

-- 2. Create INSERT trigger (Unconditional)
CREATE TRIGGER trg_hms_sync_invoice_lines_insert
AFTER INSERT ON public.hms_invoice
FOR EACH ROW
EXECUTE FUNCTION public.hms_sync_invoice_lines_on_upsert();

-- 3. Create UPDATE trigger (Conditional)
CREATE TRIGGER trg_hms_sync_invoice_lines_update
AFTER UPDATE ON public.hms_invoice
FOR EACH ROW
WHEN (OLD.line_items IS DISTINCT FROM NEW.line_items)
EXECUTE FUNCTION public.hms_sync_invoice_lines_on_upsert();

COMMIT;
