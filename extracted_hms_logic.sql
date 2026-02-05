-- EXTRACTED HMS FUNCTIONS

CREATE FUNCTION public.hms_compute_invoice_totals(lines jsonb) RETURNS TABLE(subtotal numeric, total_tax numeric, total_discount numeric, total numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM((elem->>'unit_price')::numeric * (elem->>'quantity')::numeric),0) AS subtotal,
    COALESCE(SUM(COALESCE((elem->'taxes'->0->>'amount')::numeric,0)),0) AS total_tax,
    COALESCE(SUM(COALESCE((elem->'discount'->>'amount')::numeric,0)),0) AS total_discount,
    COALESCE(SUM((elem->>'net_amount')::numeric),0) AS total
  FROM jsonb_array_elements(lines) elem;
END;
$$;

CREATE FUNCTION public.hms_create_invoice(p_tenant uuid, p_company uuid, p_patient uuid DEFAULT NULL::uuid, p_encounter uuid DEFAULT NULL::uuid, p_line_items jsonb DEFAULT '[]'::jsonb, p_created_by uuid DEFAULT NULL::uuid) RETURNS TABLE(invoice_id uuid, invoice_number text)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_invoice_number text;
  v_id uuid;
BEGIN
  v_invoice_number := public.hms_next_invoice_number(p_tenant, p_company);

CREATE FUNCTION public.hms_create_stock_moves_from_invoice() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  l jsonb;
  idx int;
  prod_id uuid;
  qty numeric;
  default_location uuid;
BEGIN
  -- only on status change to posted
  IF TG_OP = 'UPDATE' AND NEW.status = 'posted' AND OLD.status IS DISTINCT FROM 'posted' THEN
    FOR idx IN 0 .. jsonb_array_length(NEW.line_items)-1 LOOP
      l := NEW.line_items->idx;
      IF COALESCE((l->>'is_stockable'),'false')::boolean = true THEN
        -- try to map service_code to product sku
        SELECT id INTO prod_id FROM hms_product WHERE tenant_id = NEW.tenant_id AND sku = (l->>'service_code') LIMIT 1;
        IF prod_id IS NULL THEN
          -- skip if no product mapping; app should ensure mapping exists
          CONTINUE;
        END IF;
        qty := COALESCE((l->>'quantity')::numeric,1);

CREATE FUNCTION public.hms_invoice_history_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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

CREATE FUNCTION public.hms_invoice_immutable_when_posted() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'posted' AND (NEW.line_items IS DISTINCT FROM OLD.line_items OR NEW.invoice_number IS DISTINCT FROM OLD.invoice_number) THEN
      RAISE EXCEPTION 'Cannot modify invoice after posted (invoice_id=%). Use credit notes/adjustments', NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.hms_next_invoice_number(tid uuid, cid uuid, prefix text DEFAULT ''::text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  v bigint;
BEGIN
  LOOP
    UPDATE hms_invoice_sequence SET last_number = last_number + 1 WHERE tenant_id = tid AND company_id = cid;
    IF FOUND THEN
      SELECT last_number INTO v FROM hms_invoice_sequence WHERE tenant_id = tid AND company_id = cid;
      RETURN coalesce(prefix,'') || lpad(v::text,6,'0');

CREATE FUNCTION public.hms_notify_event_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  payload json;
BEGIN
  payload = json_build_object(
    'table', TG_TABLE_NAME,
    'op', TG_OP,
    'id', NEW.id
  );

CREATE FUNCTION public.hms_patient_audit_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.hms_patient_audit (patient_id, operation, changed_at, changed_by, row_data)
    VALUES (OLD.id, TG_OP, now(), NULL, row_to_json(OLD));

CREATE FUNCTION public.hms_patient_touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();

CREATE FUNCTION public.hms_patient_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();

CREATE FUNCTION public.hms_recalc_po_totals() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  s numeric := 0;
  t numeric := 0;
BEGIN
  SELECT COALESCE(SUM(line_total),0), COALESCE(SUM(tax_amount),0)
  INTO s, t
  FROM public.hms_purchase_order_line
  WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id);

CREATE FUNCTION public.hms_receipt_line_to_ledger_and_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  loc_to uuid := NULL;
  computed_unit_cost numeric := 0;
  computed_total_cost numeric := 0;
BEGIN
  -- determine target location: prefer provided location else default for company
  IF NEW.location_id IS NOT NULL THEN
    loc_to := NEW.location_id;
  ELSE
    SELECT id INTO loc_to FROM public.hms_stock_locations
      WHERE company_id = NEW.company_id AND is_default = true LIMIT 1;
  END IF;

  -- compute unit cost (prefer receipt unit_price, then product.default_cost, then batch.cost)
  IF NEW.unit_price IS NOT NULL AND NEW.unit_price <> 0 THEN
    computed_unit_cost := NEW.unit_price;
  ELSE
    SELECT COALESCE(default_cost,0) INTO computed_unit_cost FROM public.hms_product WHERE id = NEW.product_id LIMIT 1;
    IF computed_unit_cost IS NULL OR computed_unit_cost = 0 THEN
      SELECT cost INTO computed_unit_cost FROM public.hms_product_batch WHERE id = NEW.batch_id LIMIT 1;
    END IF;
    computed_unit_cost := COALESCE(computed_unit_cost,0);

CREATE FUNCTION public.hms_recompute_invoice_totals() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_subtotal numeric(18,2) := 0;
  v_total_tax numeric(18,2) := 0;
  v_total_discount numeric(18,2) := 0;
  v_total numeric(18,2) := 0;
  v_paid numeric(18,2) := 0;
  v_allocated_paid numeric(18,2) := 0;
  ln RECORD;
  payment_sum numeric;
BEGIN
  -- We accept NEW or OLD depending on the trigger using this fn.
  -- Determine invoice id and tenant/company
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  -- use NEW
  IF NEW IS NULL THEN
    RAISE EXCEPTION 'hms_recompute_invoice_totals called without NEW';
  END IF;

  -- First try to compute from normalized lines table if exists
  SELECT
    COALESCE(SUM(COALESCE(net_amount,0)),0)::numeric(18,2) AS s_subtotal,
    COALESCE(SUM(COALESCE(tax_amount,0)),0)::numeric(18,2) AS s_tax,
    COALESCE(SUM(COALESCE(discount_amount,0)),0)::numeric(18,2) AS s_disc
  INTO v_subtotal, v_total_tax, v_total_discount
  FROM public.hms_invoice_lines l
  WHERE l.tenant_id = NEW.tenant_id AND l.company_id = NEW.company_id AND l.invoice_id = NEW.id;

  -- If no lines present in normalized table, try JSON `line_items` on the invoice row
  IF v_subtotal = 0 AND (NEW.line_items IS NOT NULL) THEN
    -- Expecting each line object: { quantity, unit_price, discount_amount, tax_amount, net_amount }
    SELECT
      COALESCE(SUM( ( ( (coalesce((li->>'net_amount')::numeric,0)) ) ) ),0)::numeric(18,2),
      COALESCE(SUM( (coalesce((li->>'tax_amount')::numeric,0)) ),0)::numeric(18,2),
      COALESCE(SUM( (coalesce((li->>'discount_amount')::numeric,0)) ),0)::numeric(18,2)
    INTO v_subtotal, v_total_tax, v_total_discount
    FROM jsonb_array_elements(NEW.line_items) AS arr(li);

CREATE FUNCTION public.hms_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();

CREATE FUNCTION public.hms_sync_invoice_lines_on_upsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  lines jsonb;
  i int := 0;
  l jsonb;
  nid uuid;
BEGIN
  -- delete existing derived lines for invoice
  DELETE FROM hms_invoice_lines WHERE invoice_id = NEW.id;
  lines := NEW.line_items;
  IF lines IS NULL THEN
    RETURN NEW;
  END IF;
  FOR i IN 0 .. jsonb_array_length(lines) - 1 LOOP
    l := lines->i;
    IF (l->>'line_id') IS NOT NULL THEN
      nid := (l->>'line_id')::uuid;
    ELSE
      nid := gen_random_uuid();

CREATE FUNCTION public.hms_touch_invoice_from_line() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Update the parent invoice's updated_at timestamp.
  -- This will fire 'trg_hms_invoice_recompute_totals' on hms_invoice table
  IF (TG_OP = 'DELETE') THEN
    UPDATE public.hms_invoice 
    SET updated_at = now() 
    WHERE id = OLD.invoice_id;
    RETURN OLD;
  ELSE
    UPDATE public.hms_invoice 
    SET updated_at = now() 
    WHERE id = NEW.invoice_id;
    RETURN NEW;
  END IF;
END;
$$;

-- EXTRACTED HMS TRIGGERS

CREATE TRIGGER trg_hms_stock_reservation_updated_at BEFORE UPDATE ON public.hms_stock_reservation FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();


--
-- Name: lead_pipeline trg_lead_pipeline_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_lead_pipeline_updated_at BEFORE UPDATE ON public.lead_pipeline FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();