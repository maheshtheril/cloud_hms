
SELECT table_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'id' 
  AND data_type = 'uuid' 
  AND column_default IS NULL;
