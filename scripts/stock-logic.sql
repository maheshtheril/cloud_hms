
-- HMS STOCK LOGIC RESTORATION (UUID REFINED + EXPLICIT ID + TYPE SAFE + SCHEMA SAFE + UOM CONVERSION)
-- Ensures consistency between text-based receipt lines and uuid-based stock tables.

BEGIN;

CREATE OR REPLACE FUNCTION public.hms_receipt_line_to_ledger_and_stock()
RETURNS TRIGGER AS $$
DECLARE
  v_loc_to uuid := NULL;
  computed_unit_cost numeric := 0;
  computed_total_cost numeric := 0;
  v_tenant_id uuid;
  v_company_id uuid;
  v_product_id uuid;
  v_conv_factor numeric := 1;
  v_stock_qty numeric;
BEGIN
  -- Cast inputs to uuid for safety to match hms_stock_ledger column types
  v_tenant_id := NULLIF(NEW.tenant_id, '')::uuid;
  v_company_id := NULLIF(NEW.company_id, '')::uuid;
  v_product_id := NULLIF(NEW.product_id, '')::uuid;

  -- 1. Determine destination location
  IF NULLIF(NEW.location_id, '') IS NOT NULL THEN
    v_loc_to := NEW.location_id::uuid;
  ELSE
    -- Try to find main warehouse in singular table
    SELECT id INTO v_loc_to FROM public.hms_stock_location 
    WHERE company_id::text = v_company_id::text AND name = 'Main Warehouse' LIMIT 1;
    
    -- If not found, try plural table which has is_default
    IF v_loc_to IS NULL THEN
      SELECT id INTO v_loc_to FROM public.hms_stock_locations 
      WHERE company_id::text = v_company_id::text AND (name = 'Main Warehouse' OR is_default = true) LIMIT 1;
    END IF;
    
    -- Final fallback: ANY location in singular table
    IF v_loc_to IS NULL THEN
        SELECT id INTO v_loc_to FROM public.hms_stock_location
        WHERE company_id::text = v_company_id::text LIMIT 1;
    END IF;
  END IF;

  -- 2. Determine conversion factor for UOM
  -- In HMS, stock is always tracked in BASE units. Purchase units may vary.
  IF (NEW.metadata->>'conversion_factor') IS NOT NULL AND (NEW.metadata->>'conversion_factor') <> '' THEN
      v_conv_factor := (NEW.metadata->>'conversion_factor')::numeric;
      IF v_conv_factor <= 0 THEN v_conv_factor := 1; END IF;
  END IF;

  v_stock_qty := COALESCE(NEW.qty, 0) * v_conv_factor;

  -- 3. Determine unit cost (Normalized to BASE unit if conversion > 1)
  IF NEW.unit_price IS NOT NULL AND NEW.unit_price <> 0 THEN
    -- If price is provided in purchase UOM, convert it to base unit cost
    computed_unit_cost := NEW.unit_price / v_conv_factor;
  ELSE
    SELECT COALESCE(default_cost,0) INTO computed_unit_cost FROM public.hms_product 
    WHERE id::text = v_product_id::text LIMIT 1;
  END IF;

  computed_total_cost := computed_unit_cost * v_stock_qty;

  -- 4. Insert into hms_stock_ledger (Master Ledger)
  -- PROVIDING 'id' EXPLICITLY via gen_random_uuid() to bypass any table default issues
  INSERT INTO public.hms_stock_ledger (
    id, tenant_id, company_id, product_id, related_type, related_id, movement_type,
    qty, uom, unit_cost, total_cost, to_location_id, batch_id, created_at
  ) VALUES (
    gen_random_uuid(), -- Explicitly generate UUID here
    v_tenant_id, 
    v_company_id, 
    v_product_id, 
    'purchase_receipt', 
    NULLIF(NEW.receipt_id, '')::uuid, 
    'in',
    v_stock_qty, -- Store normalized quantity
    NEW.uom, 
    computed_unit_cost, 
    computed_total_cost, 
    v_loc_to, 
    NULLIF(NEW.batch_id, '')::uuid,
    now()
  );

  -- 5. Update hms_stock_levels (UPSERT)
  IF v_loc_to IS NOT NULL THEN
    INSERT INTO public.hms_stock_levels (
        id, tenant_id, company_id, product_id, location_id, batch_id, quantity, updated_at
    )
    VALUES (
        gen_random_uuid(), -- Explicitly generate UUID here too
        v_tenant_id, 
        v_company_id, 
        v_product_id, 
        v_loc_to, 
        NULLIF(NEW.batch_id, '')::uuid, 
        v_stock_qty, -- Store normalized quantity
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
