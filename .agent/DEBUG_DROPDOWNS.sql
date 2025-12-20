-- DEBUG: Check what data exists
-- Run these queries to see what's in your database

-- 1. Check if any roles exist
SELECT 'ROLES' as table_name, COUNT(*) as count, tenant_id 
FROM hms_roles 
GROUP BY tenant_id;

-- 2. Check if any specializations exist  
SELECT 'SPECIALIZATIONS' as table_name, COUNT(*) as count, tenant_id
FROM hms_specializations
GROUP BY tenant_id;

-- 3. Check if any departments exist
SELECT 'DEPARTMENTS' as table_name, COUNT(*) as count, tenant_id
FROM hms_departments
GROUP BY tenant_id;

-- 4. Show all your tenants
SELECT id, name FROM tenant;

-- 5. Show sample roles (first 5)
SELECT tenant_id, company_id, name, is_active, is_clinical 
FROM hms_roles 
LIMIT 5;

-- 6. Show sample specializations (first 5)
SELECT tenant_id, company_id, name, is_active
FROM hms_specializations
LIMIT 5;

-- 7. Check if system tenant exists
SELECT COUNT(*) as exists FROM tenant WHERE id = '00000000-0000-0000-0000-000000000001';
