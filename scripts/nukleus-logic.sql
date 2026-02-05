
-- HMS DATABASE LOGIC RESTORATION (NUKLEUS)
-- Restore all critical functions and triggers for Invoice management.

BEGIN;

-- 1. HISTORY TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.hms_invoice_history_trigger() 
RETURNS trigger AS $$
DECLARE v_user_id uuid;
BEGIN
  v_user_id := NULLIF(current_setting('app.current_user_id', true), '')::uuid;
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.hms_invoice_history (tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
    VALUES (NEW.tenant_id, NEW.company_id, NEW.id, v_user_id, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), now());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.hms_invoice_history (tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
    VALUES (NEW.tenant_id, NEW.company_id, NEW.id, NEW.created_by, 'insert', jsonb_build_object('new', to_jsonb(NEW)), now());
    RETURN NEW;
  ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. IMMUTABILITY FUNCTION
CREATE OR REPLACE FUNCTION public.hms_invoice_immutable_when_posted() 
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'posted' AND (NEW.line_items IS DISTINCT FROM OLD.line_items OR NEW.invoice_number IS DISTINCT FROM OLD.invoice_number) THEN
      RAISE EXCEPTION 'Cannot modify invoice after posted (invoice_id=%).', NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. SYNC FUNCTION
CREATE OR REPLACE FUNCTION public.hms_sync_invoice_lines_on_upsert() 
RETURNS trigger AS $$
DECLARE
  lines jsonb; i int := 0; l jsonb; nid uuid;
BEGIN
  DELETE FROM hms_invoice_lines WHERE invoice_id = NEW.id;
  lines := NEW.line_items;
  IF lines IS NULL THEN RETURN NEW; END IF;
  FOR i IN 0 .. jsonb_array_length(lines) - 1 LOOP
    l := lines->i;
    nid := COALESCE((l->>'line_id')::uuid, gen_random_uuid());
    INSERT INTO hms_invoice_lines(id, tenant_id, company_id, invoice_id, line_idx, line_ref, product_id, description, quantity, uom, unit_price, discount_amount, tax_amount, net_amount, account_code, metadata, created_at)
    VALUES (nid, NEW.tenant_id, NEW.company_id, NEW.id, i, l->>'service_code', NULLIF(l->>'product_id','')::uuid, l->>'description', COALESCE((l->>'quantity')::numeric,1), l->>'unit', COALESCE((l->>'unit_price')::numeric,0), COALESCE((l->'discount'->>'amount')::numeric,0), COALESCE((l->'taxes'->0->>'amount')::numeric,0), COALESCE((l->>'net_amount')::numeric,0), l->'account_mapping'->>'account_code', l->'metadata', now());
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.hms_touch_invoice_from_line() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE public.hms_invoice SET updated_at = now() WHERE id = OLD.invoice_id;
    RETURN OLD;
  ELSE
    UPDATE public.hms_invoice SET updated_at = now() WHERE id = NEW.invoice_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. RECOMPUTE FUNCTION
CREATE OR REPLACE FUNCTION public.hms_recompute_invoice_totals() 
RETURNS trigger AS $$
DECLARE
  v_subtotal numeric(18,2) := 0;
  v_total_tax numeric(18,2) := 0;
  v_total_discount numeric(18,2) := 0;
  v_total numeric(18,2) := 0;
  v_paid numeric(18,2) := 0;
  payment_sum numeric;
BEGIN
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  
  -- Compute totals from JSON (Primary Source in this version)
  IF (NEW.line_items IS NOT NULL) AND jsonb_array_length(NEW.line_items) > 0 THEN
    SELECT
      COALESCE(SUM( (coalesce((li->>'net_amount')::numeric,0)) ),0)::numeric(18,2),
      COALESCE(SUM( (coalesce((li->>'tax_amount')::numeric,0)) ),0)::numeric(18,2),
      COALESCE(SUM( (coalesce((li->>'discount_amount')::numeric,0)) ),0)::numeric(18,2)
    INTO v_subtotal, v_total_tax, v_total_discount
    FROM jsonb_array_elements(NEW.line_items) AS arr(li);
  END IF;

  v_total := (v_subtotal + v_total_tax - v_total_discount);

  SELECT COALESCE(SUM(amount),0)::numeric(18,2) INTO payment_sum
  FROM public.hms_invoice_payments p
  WHERE p.invoice_id = NEW.id;

  NEW.subtotal := v_subtotal;
  NEW.total_tax := v_total_tax;
  NEW.total_discount := v_total_discount;
  NEW.total := v_total;
  NEW.total_paid := payment_sum;
  NEW.outstanding_amount := v_total - payment_sum;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. ATTACH TRIGGERS
DROP TRIGGER IF EXISTS trg_hms_sync_invoice_lines_insert ON public.hms_invoice;
CREATE TRIGGER trg_hms_sync_invoice_lines_insert AFTER INSERT ON public.hms_invoice FOR EACH ROW EXECUTE FUNCTION public.hms_sync_invoice_lines_on_upsert();

DROP TRIGGER IF EXISTS trg_hms_sync_invoice_lines_update ON public.hms_invoice;
CREATE TRIGGER trg_hms_sync_invoice_lines_update AFTER UPDATE ON public.hms_invoice FOR EACH ROW WHEN (OLD.line_items IS DISTINCT FROM NEW.line_items) EXECUTE FUNCTION public.hms_sync_invoice_lines_on_upsert();

DROP TRIGGER IF EXISTS trg_hms_invoice_recompute_totals ON public.hms_invoice;
CREATE TRIGGER trg_hms_invoice_recompute_totals BEFORE UPDATE ON public.hms_invoice FOR EACH ROW WHEN (OLD.line_items IS DISTINCT FROM NEW.line_items OR OLD.total_paid IS DISTINCT FROM NEW.total_paid) EXECUTE FUNCTION public.hms_recompute_invoice_totals();

DROP TRIGGER IF EXISTS trg_hms_invoice_history ON public.hms_invoice;
CREATE TRIGGER trg_hms_invoice_history AFTER INSERT OR UPDATE ON public.hms_invoice FOR EACH ROW EXECUTE FUNCTION public.hms_invoice_history_trigger();

COMMIT;
