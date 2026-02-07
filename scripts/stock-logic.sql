
-- HMS STOCK LOGIC RESTORATION
BEGIN;

CREATE OR REPLACE FUNCTION public.hms_receipt_line_to_ledger_and_stock() RETURNS trigger AS $$
DECLARE
  loc_to uuid := NULL;
  computed_unit_cost numeric := 0;
  computed_total_cost numeric := 0;
BEGIN
  -- Determine destination location
  -- Prefer hms_stock_location (singular) as used in server actions
  IF NEW.location_id IS NOT NULL THEN
    loc_to := NEW.location_id;
  ELSE
    SELECT id INTO loc_to FROM public.hms_stock_location 
    WHERE company_id = NEW.company_id AND name = 'Main Warehouse' LIMIT 1;
    
    IF loc_to IS NULL THEN
      SELECT id INTO loc_to FROM public.hms_stock_location 
      WHERE company_id = NEW.company_id AND is_default = true LIMIT 1;
    END IF;

    -- Fallback to plural if singular yields nothing
    IF loc_to IS NULL THEN
      SELECT id INTO loc_to FROM public.hms_stock_locations 
      WHERE company_id = NEW.company_id AND name = 'Main Warehouse' LIMIT 1;
    END IF;
  END IF;

  -- Determine unit cost
  IF NEW.unit_price IS NOT NULL AND NEW.unit_price <> 0 THEN
    computed_unit_cost := NEW.unit_price;
  ELSE
    SELECT COALESCE(default_cost,0) INTO computed_unit_cost FROM public.hms_product WHERE id = NEW.product_id LIMIT 1;
  END IF;

  computed_total_cost := computed_unit_cost * COALESCE(NEW.qty,0);

  -- 1. Insert into hms_stock_ledger
  INSERT INTO public.hms_stock_ledger (
    id, tenant_id, company_id, product_id, related_type, related_id, movement_type,
    qty, uom, unit_cost, total_cost, to_location_id, batch_id, created_at
  ) VALUES (
    gen_random_uuid(),
    NEW.tenant_id, 
    NEW.company_id, 
    NEW.product_id, 
    'purchase_receipt', 
    NEW.receipt_id, 
    'in',
    NEW.qty, 
    NEW.uom, 
    computed_unit_cost, 
    computed_total_cost, 
    loc_to, 
    NEW.batch_id,
    now()
  );

  -- 2. Update hms_stock_levels (UPSERT)
  IF loc_to IS NOT NULL THEN
    INSERT INTO public.hms_stock_levels (
        id, tenant_id, company_id, product_id, location_id, batch_id, quantity, updated_at
    )
    VALUES (
        gen_random_uuid(), 
        NEW.tenant_id, 
        NEW.company_id, 
        NEW.product_id, 
        loc_to, 
        NEW.batch_id, 
        NEW.qty, 
        now()
    )
    ON CONFLICT (tenant_id, company_id, product_id, location_id, batch_id) 
    DO UPDATE SET 
        quantity = public.hms_stock_levels.quantity + EXCLUDED.quantity, 
        updated_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS trg_hms_receipt_line_after_insert ON public.hms_purchase_receipt_line;
CREATE TRIGGER trg_hms_receipt_line_after_insert 
AFTER INSERT ON public.hms_purchase_receipt_line 
FOR EACH ROW WHEN (new.qty > 0) 
EXECUTE FUNCTION public.hms_receipt_line_to_ledger_and_stock();

COMMIT;
