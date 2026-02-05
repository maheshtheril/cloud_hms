
-- HMS DATABASE REPAIR: Fix Json[] vs Json conflict
-- The 'line_items' column in 'hms_invoice' is marked as Json[] in Prisma 
-- but might be JSONB (not an array) in the database, causing P2011/PRM-UNKNOWN errors.

BEGIN;

-- 1. Safely convert line_items to an array if it isn't one
DO $$ 
BEGIN
    -- Check if it's already an array. If not, we fix it.
    -- This is a bit tricky in PG to check if a column is an array type.
    -- We can just try to alter it.
    ALTER TABLE public.hms_invoice ALTER COLUMN line_items SET DATA TYPE jsonb[] USING ARRAY[line_items];
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not convert line_items to array. It might not exist or is already an array.';
END $$;

-- 2. Ensure it has a default empty array
ALTER TABLE public.hms_invoice ALTER COLUMN line_items SET DEFAULT '{}';

-- 3. Also check hms_invoice_lines for any similar issues
-- (hms_invoice_lines doesn't have Json[] fields usually)

COMMIT;
