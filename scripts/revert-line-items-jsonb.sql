
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hms_invoice'
        AND column_name = 'line_items'
        AND udt_name = '_jsonb'  -- _jsonb usually means jsonb[] (array of jsonb)
    ) THEN
        ALTER TABLE public.hms_invoice ALTER COLUMN line_items DROP DEFAULT;
        
        -- Convert the array back to single JSONB by taking the first element
        -- Since the bad migration wrapped the JSON in an array [json], we unwrap it.
        ALTER TABLE public.hms_invoice 
            ALTER COLUMN line_items 
            TYPE jsonb 
            USING line_items[1]; 

        ALTER TABLE public.hms_invoice ALTER COLUMN line_items SET DEFAULT '[]'::jsonb;
        
        RAISE NOTICE 'Success: Fixed line_items column type (reverted jsonb[] to jsonb).';
    ELSE
        RAISE NOTICE 'Notice: Column line_items is not jsonb[] (or table not found in public schema), skipping fix.';
    END IF;
END $$;
