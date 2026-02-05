
-- HMS REPAIR: FIX P2011 NullConstraintViolation in hms_invoice_history
-- This script ensures the 'id' column has a default and the trigger is robust.

BEGIN;

-- 1. Ensure pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ensure hms_invoice_history has a default for ID
-- We use a DO block to safely alter the column if it's missing the default
DO $$ 
BEGIN
    ALTER TABLE public.hms_invoice_history ALTER COLUMN id SET DEFAULT gen_random_uuid();
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not set default on hms_invoice_history.id, may already exist or table missing.';
END $$;

-- 3. Re-create the trigger function to be "defensive" by explicitly providing IDs 
-- in case the default somehow fails or is removed again.
CREATE OR REPLACE FUNCTION public.hms_invoice_history_trigger() 
RETURNS trigger AS $$
DECLARE 
    v_user_id uuid;
BEGIN
    -- Try to capture the session user
    BEGIN
        v_user_id := NULLIF(current_setting('app.current_user_id', true), '')::uuid;
    EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
    END;

    IF TG_OP = 'UPDATE' THEN
        INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
        VALUES (
            gen_random_uuid(), 
            NEW.tenant_id, 
            NEW.company_id, 
            NEW.id, 
            v_user_id, 
            'update', 
            jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), 
            now()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
        VALUES (
            gen_random_uuid(), 
            NEW.tenant_id, 
            NEW.company_id, 
            NEW.id, 
            COALESCE(NEW.created_by, v_user_id), 
            'insert', 
            jsonb_build_object('new', to_jsonb(NEW)), 
            now()
        );
        RETURN NEW;
    ELSE 
        RETURN NEW; 
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Ensure the trigger is active
DROP TRIGGER IF EXISTS trg_hms_invoice_history ON public.hms_invoice;
CREATE TRIGGER trg_hms_invoice_history
AFTER INSERT OR UPDATE ON public.hms_invoice
FOR EACH ROW
EXECUTE FUNCTION public.hms_invoice_history_trigger();

COMMIT;
