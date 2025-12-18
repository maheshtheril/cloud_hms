-- CRITICAL: Run these queries on your production database NOW

-- 1. Show ALL purchase orders and their tenant IDs
SELECT 
    po.id,
    po.tenant_id,
    po.company_id,
    po.name,
    po.number,
    po.created_at,
    s.name as supplier_name,
    t.name as tenant_name
FROM hms_purchase_order po
LEFT JOIN hms_supplier s ON po.supplier_id = s.id
LEFT JOIN tenant t ON po.tenant_id = t.id
ORDER BY po.created_at DESC;

-- 2. Count purchase orders by tenant
SELECT 
    po.tenant_id,
    t.name as tenant_name,
    COUNT(*) as order_count
FROM hms_purchase_order po
LEFT JOIN tenant t ON po.tenant_id = t.id
GROUP BY po.tenant_id, t.name
ORDER BY order_count DESC;

-- 3. Show newest tenants (check if the new signup matches any of these)
SELECT 
    id,
    name,
    created_at
FROM tenant
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check if there are purchase orders with tenant_id that matches the NEW tenant
--    (You'll need to replace 'NEW_TENANT_ID' with the actual ID from the new signup)
-- SELECT * FROM hms_purchase_order WHERE tenant_id = 'NEW_TENANT_ID';
