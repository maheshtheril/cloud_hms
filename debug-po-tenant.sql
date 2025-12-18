-- Debug script to find purchase orders and their tenant associations
-- Run this in your database client (psql, pgAdmin, etc.)

SELECT 
    'Purchase Orders by Tenant' as report_section;

SELECT 
    po.tenant_id,
    po.company_id,
    COUNT(*) as order_count,
    STRING_AGG(DISTINCT po.name, ', ') as po_numbers
FROM 
    hms_purchase_order po
GROUP BY 
    po.tenant_id, po.company_id
ORDER BY 
    order_count DESC;

SELECT 
    'All Purchase Orders Details' as report_section;

SELECT 
    po.id,
    po.tenant_id,
    po.company_id,
    po.name,
    po.number,
    s.name as supplier_name,
    po.created_at,
    po.total_amount
FROM 
    hms_purchase_order po
    LEFT JOIN hms_supplier s ON po.supplier_id = s.id
ORDER BY 
    po.created_at DESC
LIMIT 50;

SELECT 
    'Tenants Summary' as report_section;

SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    t.created_at,
    COUNT(DISTINCT po.id) as purchase_order_count
FROM 
    tenant t
    LEFT JOIN hms_purchase_order po ON t.id = po.tenant_id
GROUP BY 
    t.id, t.name, t.created_at
ORDER BY 
    t.created_at DESC;
