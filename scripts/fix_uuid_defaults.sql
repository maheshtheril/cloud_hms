
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure UUID columns have defaults
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_name = 'id' 
          AND data_type = 'uuid'
          AND column_default IS NULL
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT gen_random_uuid()';
    END LOOP;
END $$;
