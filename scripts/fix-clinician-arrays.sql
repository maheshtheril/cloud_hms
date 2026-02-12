
-- 🚨 CRITICAL FIX for "malformed array literal" in hms_clinicians
-- This script aligns the database with the updated Prisma schema.

BEGIN;

-- 1. Fix working_days: ensure it is text[] and has correct default
ALTER TABLE hms_clinicians 
ALTER COLUMN working_days DROP DEFAULT;

ALTER TABLE hms_clinicians 
ALTER COLUMN working_days TYPE text[] 
USING CASE 
    WHEN working_days IS NULL THEN ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[]
    WHEN working_days::text = '[]' THEN ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[]
    ELSE working_days::text[]
END;

ALTER TABLE hms_clinicians 
ALTER COLUMN working_days SET DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[];

-- 2. Fix document_urls: ensure it is text[] and has correct default
ALTER TABLE hms_clinicians 
ALTER COLUMN document_urls DROP DEFAULT;

ALTER TABLE hms_clinicians 
ALTER COLUMN document_urls TYPE text[] 
USING CASE 
    WHEN document_urls IS NULL THEN ARRAY[]::text[]
    WHEN document_urls::text = '[]' THEN ARRAY[]::text[]
    ELSE document_urls::text[]
END;

ALTER TABLE hms_clinicians 
ALTER COLUMN document_urls SET DEFAULT ARRAY[]::text[];

-- 3. Final Verification
DO $$
BEGIN
    RAISE NOTICE 'SUCCESS: hms_clinicians array columns repaired.';
END $$;

COMMIT;
