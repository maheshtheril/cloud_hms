
-- HMS PATIENT DATA LOGIC RESTORATION
BEGIN;

CREATE OR REPLACE FUNCTION public.hms_notify_event_trigger() RETURNS trigger AS $$
DECLARE payload json;
BEGIN
  payload = json_build_object('table', TG_TABLE_NAME, 'op', TG_OP, 'id', NEW.id);
  PERFORM pg_notify('hms_events', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION public.hms_invoice_audit_trigger() RETURNS trigger AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Attempt to get user ID from session variable, default to a placeholder if not set
  BEGIN
    SELECT current_setting('app.user_id', true)::UUID INTO v_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      v_user_id := '00000000-0000-0000-0000-000000000000'; -- Placeholder for unknown user
  END;

  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
    VALUES (gen_random_uuid(), NEW.tenant_id, NEW.company_id, NEW.id, v_user_id, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), now());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
    VALUES (gen_random_uuid(), NEW.tenant_id, NEW.company_id, NEW.id, NEW.created_by, 'insert', jsonb_build_object('new', to_jsonb(NEW)), now());
    RETURN NEW;
  END IF;
  RETURN NULL; -- Should not be reached for INSERT/UPDATE
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.hms_patient_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hms_notify_patient ON public.hms_patient;
CREATE TRIGGER trg_hms_notify_patient AFTER INSERT OR UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_notify_event_trigger();

DROP TRIGGER IF EXISTS trg_hms_patient_audit ON public.hms_patient;
CREATE TRIGGER trg_hms_patient_audit AFTER INSERT OR DELETE OR UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_patient_audit_trigger();

DROP TRIGGER IF EXISTS trg_hms_patient_updated_at ON public.hms_patient;
CREATE TRIGGER trg_hms_patient_updated_at BEFORE UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_patient_updated_at();

COMMIT;
