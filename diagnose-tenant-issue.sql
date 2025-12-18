-- Quick diagnostic queries to find the root cause

-- 1. Check for purchase orders with NULL tenant_id (shouldn't happen but let's check)
SELECT COUNT(*) as null_tenant_orders
FROM hms_purchase_order
WHERE tenant_id IS NULL;

-- 2. Check for purchase orders that might be global/shared
SELECT 
    po.tenant_id,
    COUNT(*) as count,
    MIN(po.created_at) as first_created,
    MAX(po.created_at) as last_created,
    STRING_AGG(DISTINCT po.name, ', ' ORDER BY po.name) as order_names
FROM hms_purchase_order po
GROUP BY po.tenant_id
HAVING COUNT(*) > 0
ORDER BY count DESC;

-- 3. Get the tenant_id of the newest tenant (the one reporting the issue)
SELECT 
    id as tenant_id,
    name as tenant_name,
    created_at
FROM tenant
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if any purchase orders belong to the newest tenant
-- (Replace 'NEWEST_TENANT_ID' with the actual ID from query #3)
-- SELECT * FROM hms_purchase_order WHERE tenant_id = 'NEWEST_TENANT_ID';
