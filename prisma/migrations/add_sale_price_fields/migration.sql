-- Add sale price fields to hms_product_batch table
-- Migration: Add Sale Price Management for Purchase Entry

-- Add new columns to hms_product_batch
ALTER TABLE hms_product_batch 
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(14,2),
ADD COLUMN IF NOT EXISTS margin_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS markup_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS pricing_strategy VARCHAR(50);

-- Add comments for documentation
COMMENT ON COLUMN hms_product_batch.sale_price IS 'Selling price for this batch (must be <= MRP)';
COMMENT ON COLUMN hms_product_batch.margin_percentage IS 'Profit margin % = ((sale_price - cost) / sale_price) * 100';
COMMENT ON COLUMN hms_product_batch.markup_percentage IS 'Markup % = ((sale_price - cost) / cost) * 100';
COMMENT ON COLUMN hms_product_batch.pricing_strategy IS 'Strategy used: mrp_discount, cost_markup, custom_percentage, manual';

-- Create index for faster queries on sale_price
CREATE INDEX IF NOT EXISTS idx_hms_product_batch_sale_price ON hms_product_batch(sale_price);

-- Migrate existing data: Set sale_price to MRP where MRP exists
-- This gives a conservative starting point
UPDATE hms_product_batch 
SET sale_price = mrp,
    pricing_strategy = 'mrp_discount'
WHERE sale_price IS NULL 
  AND mrp IS NOT NULL 
  AND mrp > 0;

-- For batches with cost but no MRP, set a 25% markup as default
UPDATE hms_product_batch 
SET sale_price = ROUND(cost * 1.25, 2),
    markup_percentage = 25.00,
    pricing_strategy = 'cost_markup'
WHERE sale_price IS NULL 
  AND cost IS NOT NULL 
  AND cost > 0;

-- Calculate margin and markup for all existing batches where we now have sale_price and cost
UPDATE hms_product_batch
SET 
    margin_percentage = CASE 
        WHEN sale_price > 0 AND cost > 0 THEN 
            ROUND(((sale_price - cost) / sale_price * 100)::numeric, 2)
        ELSE NULL
    END,
    markup_percentage = CASE 
        WHEN cost > 0 AND sale_price > cost THEN 
            ROUND(((sale_price - cost) / cost * 100)::numeric, 2)
        ELSE NULL
    END
WHERE sale_price IS NOT NULL AND cost IS NOT NULL;

-- Add check constraint to ensure sale_price <= MRP (legal requirement in India)
ALTER TABLE hms_product_batch
ADD CONSTRAINT chk_sale_price_lte_mrp 
CHECK (mrp IS NULL OR sale_price IS NULL OR sale_price <= mrp);

-- Add check constraint to ensure sale_price > 0 if set
ALTER TABLE hms_product_batch
ADD CONSTRAINT chk_sale_price_positive 
CHECK (sale_price IS NULL OR sale_price > 0);
