
-- HMS STOCK LOGIC RESTORATION (UUID REFINED)
-- Ensures consistency between text-based receipt lines and uuid-based stock tables.

BEGIN;

CREATE OR REPLACE FUNCTION public.hms_receipt_line_to_ledger_and_stock()
RETURNS TRIGGER AS $$
DECLARE
  loc_to uuid := NULL;
  computed_unit_cost numeric := 0;
  computed_total_cost numeric := 0;
  v_tenant_id uuid;
  v_company_id uuid;
  v_product_id uuid;
BEGIN
  -- Cast inputs to uuid for safety to match hms_stock_ledger column types
  v_tenant_id := NEW.tenant_id::uuid;
  v_company_id := NEW.company_id::uuid;
  v_product_id := NEW.product_id::uuid;

  -- 1. Determine destination location
  IF NEW.location_id IS NOT NULL THEN
    loc_to := NEW.location_id::uuid;
  ELSE
    -- Try to find main warehouse or default in both possible table names
    SELECT id INTO loc_to FROM public.hms_stock_location 
    WHERE company_id = v_company_id AND (name = 'Main Warehouse' OR is_default = true) LIMIT 1;
    
    IF loc_to IS NULL THEN
      SELECT id INTO loc_to FROM public.hms_stock_locations 
      WHERE company_id = v_company_id AND (name = 'Main Warehouse' OR is_default = true) LIMIT 1;
    END IF;
  END IF;

  -- 2. Determine unit cost
  IF NEW.unit_price IS NOT NULL AND NEW.unit_price <> 0 THEN
    computed_unit_cost := NEW.unit_price;
  ELSE
    SELECT COALESCE(default_cost,0) INTO computed_unit_cost FROM public.hms_product WHERE id = v_product_id LIMIT 1;
  END IF;

  computed_total_cost := computed_unit_cost * COALESCE(NEW.qty,0);

  -- 3. Insert into hms_stock_ledger (Master Ledger)
  -- NOT providing 'id' here, letting database DEFAULT gen_random_uuid() handle it
  INSERT INTO public.hms_stock_ledger (
    tenant_id, company_id, product_id, related_type, related_id, movement_type,
    qty, uom, unit_cost, total_cost, to_location_id, batch_id, created_at
  ) VALUES (
    v_tenant_id, 
    v_company_id, 
    v_product_id, 
    'purchase_receipt', 
    NEW.receipt_id::uuid, 
    'in',
    COALESCE(NEW.qty, 0), 
    NEW.uom, 
    computed_unit_cost, 
    computed_total_cost, 
    loc_to, 
    NEW.batch_id::uuid,
    now()
  );

  -- 4. Update hms_stock_levels (UPSERT)
  IF loc_to IS NOT NULL THEN
    INSERT INTO public.hms_stock_levels (
        tenant_id, company_id, product_id, location_id, batch_id, quantity, updated_at
    )
    VALUES (
        v_tenant_id, 
        v_company_id, 
        v_product_id, 
        loc_to, 
        NEW.batch_id::uuid, 
        COALESCE(NEW.qty, 0), 
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
FOR EACH ROW 
WHEN (NEW.qty > 0)
EXECUTE FUNCTION public.hms_receipt_line_to_ledger_and_stock();

COMMIT;
