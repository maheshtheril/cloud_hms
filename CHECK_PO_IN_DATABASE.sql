-- =====================================================
-- CHECK IF ANY PURCHASE ORDERS EXIST IN DATABASE
-- Run this on your production database
-- =====================================================

-- 1. Count total purchase orders
SELECT COUNT(*) as total_purchase_orders FROM hms_purchase_order;

-- 2. If count > 0, get details
SELECT 
    po.id,
    po.name,
    po.number,
    po.tenant_id,
    po.company_id,
    po.status,
    po.total_amount,
    po.created_at,
    s.name as supplier_name,
    t.name as tenant_name,
    t.created_at as tenant_created_at
FROM hms_purchase_order po
LEFT JOIN hms_supplier s ON po.supplier_id = s.id
LEFT JOIN tenant t ON po.tenant_id = t.id
ORDER BY po.created_at DESC;

-- 3. Group by tenant to see distribution
SELECT 
    po.tenant_id,
    t.name as tenant_name,
    t.created_at as tenant_created,
    COUNT(po.id) as order_count,
    MIN(po.created_at) as first_order,
    MAX(po.created_at) as last_order
FROM hms_purchase_order po
LEFT JOIN tenant t ON po.tenant_id = t.id
GROUP BY po.tenant_id, t.name, t.created_at
ORDER BY order_count DESC;

-- 4. Show all tenants (to compare with purchase orders)
SELECT 
    id,
    name,
    created_at,
    (SELECT COUNT(*) FROM hms_purchase_order WHERE tenant_id = tenant.id) as purchase_order_count
FROM tenant
ORDER BY created_at DESC;

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- If NEWLY SIGNED UP tenant sees purchase orders:
--   → Their tenant_id will appear in query #3
--   → This means database HAS data for that tenant
--   → Either: 
--      a) It's not a new tenant (old account)
--      b) Someone created orders for that tenant
--      c) There's orphaned test data
-- 
-- If NO purchase orders exist:
--   → Query #1 returns 0
--   → The issue is frontend/cache, NOT database
-- =====================================================
