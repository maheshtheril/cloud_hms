-- 1. Insert India (if not exists)
INSERT INTO "countries" ("id", "iso2", "iso3", "name", "flag", "region", "is_active", "created_at", "updated_at")
VALUES (gen_random_uuid(), 'IN', 'IND', 'India', '🇮🇳', 'Asia', true, NOW(), NOW())
ON CONFLICT ("iso2") DO NOTHING;

-- 2. Insert Karnataka (State)
WITH india AS (SELECT id FROM "countries" WHERE "iso2" = 'IN')
INSERT INTO "country_subdivision" ("id", "country_id", "parent_id", "name", "type", "is_active", "created_at", "updated_at")
SELECT gen_random_uuid(), india.id, NULL, 'Karnataka', 'state', true, NOW(), NOW()
FROM india
WHERE NOT EXISTS (
    SELECT 1 FROM "country_subdivision" 
    WHERE "name" = 'Karnataka' AND "country_id" = (SELECT id FROM india)
);

-- 3. Insert Kalaburgi (District)
WITH karnataka AS (
    SELECT id, country_id FROM "country_subdivision" WHERE "name" = 'Karnataka' LIMIT 1
)
INSERT INTO "country_subdivision" ("id", "country_id", "parent_id", "name", "type", "is_active", "created_at", "updated_at")
SELECT gen_random_uuid(), karnataka.country_id, karnataka.id, 'Kalaburgi', 'district', true, NOW(), NOW()
FROM karnataka
WHERE NOT EXISTS (
    SELECT 1 FROM "country_subdivision" 
    WHERE "name" = 'Kalaburgi' AND "parent_id" = (SELECT id FROM karnataka)
);
