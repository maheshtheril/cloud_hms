
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
    INSERT INTO public.hms_patient_audit (patient_id, operation, changed_at, row_data)
    VALUES (OLD.id, TG_OP, now(), row_to_json(OLD));
    RETURN OLD;
  ELSE
    INSERT INTO public.hms_patient_audit (patient_id, operation, changed_at, row_data)
    VALUES (COALESCE(NEW.id, OLD.id), TG_OP, now(), row_to_json(COALESCE(NEW, OLD)));
    RETURN NEW;
  END IF;
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
