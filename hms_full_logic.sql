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
$$;
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
    ELSE
      -- insert first row
      BEGIN
        INSERT INTO hms_invoice_sequence (tenant_id, company_id, last_number) VALUES (tid, cid, 1);
        RETURN coalesce(prefix,'') || lpad('1',6,'0');
      EXCEPTION WHEN unique_violation THEN
        -- race, retry
      END;
    END IF;
  END LOOP;
END;
$$;
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
  END IF;

  v_total := (v_subtotal + v_total_tax - v_total_discount);

  -- total_paid computed from invoice_payments table (tenant + company + invoice)
  SELECT COALESCE(SUM(amount),0)::numeric(18,2) INTO payment_sum
  FROM public.hms_invoice_payments p
  WHERE p.tenant_id = NEW.tenant_id AND p.company_id = NEW.company_id AND p.invoice_id = NEW.id;

  -- Also add any allocations (if using hms_payment_allocations)
  SELECT COALESCE(SUM(allocated_amount),0)::numeric(18,2) INTO v_allocated_paid
  FROM public.hms_payment_allocations a
  WHERE a.tenant_id = NEW.tenant_id AND a.company_id = NEW.company_id AND a.invoice_id = NEW.id;

  v_paid := payment_sum + v_allocated_paid;

  -- Update invoice row if any computed value differs (avoid infinite trigger loops by checking)
  IF NEW.subtotal IS DISTINCT FROM v_subtotal
     OR NEW.total_tax IS DISTINCT FROM v_total_tax
     OR NEW.total_discount IS DISTINCT FROM v_total_discount
     OR NEW.total IS DISTINCT FROM v_total
     OR NEW.total_paid IS DISTINCT FROM v_paid
  THEN
    NEW.subtotal := v_subtotal;
    NEW.total_tax := v_total_tax;
    NEW.total_discount := v_total_discount;
    NEW.total := v_total;
    NEW.total_paid := v_paid;

    -- determine status if not locked
    IF COALESCE(NEW.locked, false) = false THEN
      IF v_paid >= v_total AND v_total > 0 THEN
        NEW.status := 'paid'::hms_invoice_status;
      ELSIF v_paid > 0 AND v_paid < v_total THEN
        NEW.status := 'partially_paid'::hms_invoice_status;
      ELSIF v_paid = 0 AND v_total > 0 THEN
        NEW.status := 'unpaid'::hms_invoice_status;
      ELSE
        -- keep draft or other statuses as-is
        IF NEW.status IS NULL THEN
          NEW.status := 'draft'::hms_invoice_status;
        END IF;
      END IF;
    END IF;
  END IF;

  -- set updated_at
  NEW.updated_at := now();

  RETURN NEW;
END;
$$;
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
    END IF;
    INSERT INTO hms_invoice_lines(
      id, tenant_id, company_id, invoice_id, line_idx, line_ref, product_id, description,
      quantity, uom, unit_price, discount_amount, tax_amount, net_amount, account_code, metadata, created_at
    ) VALUES (
      nid,
      NEW.tenant_id,
      NEW.company_id,
      NEW.id,
      i,
      l->>'service_code',
      NULLIF(l->>'product_id','')::uuid,
      l->>'description',
      COALESCE((l->>'quantity')::numeric,1),
      l->>'unit',
      COALESCE((l->>'unit_price')::numeric,0),
      COALESCE((l->'discount'->>'amount')::numeric,0),
      COALESCE((l->'taxes'->0->>'amount')::numeric,0),
      COALESCE((l->>'net_amount')::numeric,0),
      l->'account_mapping'->>'account_code',
      l->'metadata',
      now()
    );
  END LOOP;
  RETURN NEW;
END;
$$;
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
CREATE TRIGGER trg_audit_company_tax_maps AFTER INSERT OR DELETE OR UPDATE ON public.company_tax_maps FOR EACH ROW EXECUTE FUNCTION public.fn_audit_company_tax_maps();


--
-- Name: hms_lab_result trg_hms_lab_result_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_lab_result_audit AFTER UPDATE ON public.hms_lab_result FOR EACH ROW EXECUTE FUNCTION public.audit_hms_lab_result();


--
-- Name: hms_patient trg_hms_notify_patient; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_notify_patient AFTER INSERT OR UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_notify_event_trigger();


--
-- Name: hms_patient trg_hms_patient_audit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_patient_audit AFTER INSERT OR DELETE OR UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_patient_audit_trigger();


--
-- Name: hms_patient trg_hms_patient_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_patient_touch BEFORE UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_patient_touch_updated_at();


--
-- Name: hms_patient trg_hms_patient_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_patient_updated_at BEFORE UPDATE ON public.hms_patient FOR EACH ROW EXECUTE FUNCTION public.hms_patient_updated_at();


--
-- Name: hms_payment_allocations trg_hms_payment_allocations_after_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_payment_allocations_after_change AFTER INSERT OR DELETE OR UPDATE ON public.hms_payment_allocations FOR EACH ROW EXECUTE FUNCTION public.hms_recompute_invoice_totals();


--
-- Name: hms_purchase_order_line trg_hms_po_lines_after_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_po_lines_after_write AFTER INSERT OR DELETE OR UPDATE ON public.hms_purchase_order_line FOR EACH ROW EXECUTE FUNCTION public.hms_recalc_po_totals();


--
-- Name: hms_purchase_invoice trg_hms_purchase_invoice_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_purchase_invoice_updated BEFORE UPDATE ON public.hms_purchase_invoice FOR EACH ROW EXECUTE FUNCTION public.hms_set_updated_at();


--
-- Name: hms_purchase_order_line trg_hms_purchase_order_line_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_purchase_order_line_updated BEFORE UPDATE ON public.hms_purchase_order_line FOR EACH ROW EXECUTE FUNCTION public.hms_set_updated_at();


--
-- Name: hms_purchase_order trg_hms_purchase_order_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_purchase_order_updated BEFORE UPDATE ON public.hms_purchase_order FOR EACH ROW EXECUTE FUNCTION public.hms_set_updated_at();


--
-- Name: hms_purchase_receipt trg_hms_purchase_receipt_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_purchase_receipt_updated BEFORE UPDATE ON public.hms_purchase_receipt FOR EACH ROW EXECUTE FUNCTION public.hms_set_updated_at();


--
-- Name: hms_purchase_receipt_line trg_hms_receipt_line_after_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_receipt_line_after_insert AFTER INSERT ON public.hms_purchase_receipt_line FOR EACH ROW WHEN (((new.qty IS NOT NULL) AND (new.qty > (0)::numeric))) EXECUTE FUNCTION public.hms_receipt_line_to_ledger_and_stock();


--
-- Name: hms_stock_reservation trg_hms_stock_reservation_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hms_stock_reservation_updated_at BEFORE UPDATE ON public.hms_stock_reservation FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();


--
-- Name: lead_pipeline trg_lead_pipeline_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_lead_pipeline_updated_at BEFORE UPDATE ON public.lead_pipeline FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- Name: lead_followups trg_lf_refs_check; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_lf_refs_check BEFORE INSERT OR UPDATE ON public.lead_followups FOR EACH ROW EXECUTE FUNCTION public.ensure_followup_refs_are_valid();


--
-- Name: tenant_module trg_update_tenant_module_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_tenant_module_timestamp BEFORE UPDATE ON public.tenant_module FOR EACH ROW EXECUTE FUNCTION public.update_tenant_module_timestamp();

