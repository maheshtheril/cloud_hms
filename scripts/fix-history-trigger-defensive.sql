
-- HMS TRIGGER REPAIR (DIRECT)
BEGIN;

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

COMMIT;
