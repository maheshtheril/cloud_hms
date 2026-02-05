-- Fix document_urls column type
-- This migration converts document_urls from text[] to jsonb

DO $$ 
BEGIN
    -- Check if document_urls is an array type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'hms_clinicians' 
        AND column_name = 'document_urls' 
        AND data_type = 'ARRAY'
    ) THEN
        -- Convert to JSONB
        ALTER TABLE hms_clinicians 
        ALTER COLUMN document_urls 
        SET DATA TYPE jsonb 
        USING to_jsonb(document_urls);
        
        -- Set default
        ALTER TABLE hms_clinicians 
        ALTER COLUMN document_urls 
        SET DEFAULT '[]'::jsonb;
        
        RAISE NOTICE 'Converted document_urls to JSONB';
    ELSE
        RAISE NOTICE 'document_urls is already JSONB or does not exist';
    END IF;
END $$;
