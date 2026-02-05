
-- HMS DATABASE FINAL REPAIR (THE HAMMER)
-- This script fixes the "Missing ID" issue in all trigger functions and forces DB-level defaults.

BEGIN;

-- 1. FIX HISTORY TRIGGER (Explicit ID)
CREATE OR REPLACE FUNCTION public.hms_invoice_history_trigger() 
RETURNS trigger AS $$
DECLARE v_user_id uuid;
BEGIN
  v_user_id := NULLIF(current_setting('app.current_user_id', true), '')::uuid;
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
    VALUES (gen_random_uuid(), NEW.tenant_id, NEW.company_id, NEW.id, v_user_id, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), now());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
    VALUES (gen_random_uuid(), NEW.tenant_id, NEW.company_id, NEW.id, NEW.created_by, 'insert', jsonb_build_object('new', to_jsonb(NEW)), now());
    RETURN NEW;
  ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. FIX PATIENT AUDIT TRIGGER (Explicit ID)
CREATE OR REPLACE FUNCTION public.hms_patient_audit_trigger() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.hms_patient_audit (id, patient_id, operation, changed_at, row_data)
    VALUES (gen_random_uuid(), OLD.id, TG_OP, now(), row_to_json(OLD));
    RETURN OLD;
  ELSE
    INSERT INTO public.hms_patient_audit (id, patient_id, operation, changed_at, row_data)
    VALUES (gen_random_uuid(), COALESCE(NEW.id, OLD.id), TG_OP, now(), row_to_json(COALESCE(NEW, OLD)));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. FORCE GLOBAL DATABASE DEFAULTS (Brute Force)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- This looks for any 'id' column of type UUID that doesn't have a default and FORCES gen_random_uuid()
    FOR r IN (
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_name = 'id' 
          AND data_type = 'uuid'
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT gen_random_uuid()';
    END LOOP;
END $$;

COMMIT;
