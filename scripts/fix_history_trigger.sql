-- Fix for History Trigger Error (Update 2)
-- Problem: hms_invoice table is missing 'updated_by' column.
-- Solution: Use valid columns or session variables.

BEGIN;

-- 1. Drop trigger and function
DROP TRIGGER IF EXISTS trg_hms_invoice_history ON public.hms_invoice;
DROP FUNCTION IF EXISTS hms_invoice_history_trigger();

-- 2. Re-create function
CREATE OR REPLACE FUNCTION public.hms_invoice_history_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get current user from session if available
  v_user_id := NULLIF(current_setting('app.current_user_id', true), '')::uuid;

  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.hms_invoice_history (
      tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at
    ) VALUES (
      NEW.tenant_id,
      NEW.company_id,
      NEW.id,
      -- Use session user if updated_by column is missing
      v_user_id, 
      'update',
      jsonb_build_object(
        'old', to_jsonb(OLD), 
        'new', to_jsonb(NEW)
      ),
      now()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.hms_invoice_history (
      tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at
    ) VALUES (
      NEW.tenant_id,
      NEW.company_id,
      NEW.id,
      -- Use created_by if exists, else session user
      -- We know created_by exists based on check
      NEW.created_by, 
      'insert',
      jsonb_build_object(
        'new', to_jsonb(NEW)
      ),
      now()
    );
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Re-create trigger
CREATE TRIGGER trg_hms_invoice_history
AFTER INSERT OR UPDATE ON public.hms_invoice
FOR EACH ROW
EXECUTE FUNCTION public.hms_invoice_history_trigger();

COMMIT;
