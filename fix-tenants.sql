
-- 1. FORCE SUBSCRIBE TENANT TO ALL STANDARD MODULES
INSERT INTO tenant_module (id, tenant_id, module_key, module_id, enabled)
SELECT gen_random_uuid(), t.id, m.module_key, m.id, true
FROM tenant t
CROSS JOIN modules m
WHERE m.module_key IN ('system', 'finance', 'accounting', 'inventory', 'crm', 'hms', 'purchasing')
  AND NOT EXISTS (SELECT 1 FROM tenant_module tm WHERE tm.tenant_id = t.id AND tm.module_key = m.module_key);

-- 2. MIGRATE CONFIGURATION MENUS TO 'SYSTEM'
UPDATE menu_items SET module_key = 'system' WHERE module_key = 'configuration';

-- 3. RESTORE MISSING ADMIN MENUS (Removed is_active)
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'User Management', '/settings/users', 'users', 'system', 'Users', 90, 'users:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'users');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Roles & Permissions', '/settings/roles', 'roles', 'system', 'Shield', 91, 'roles:manage', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'roles');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Global Settings', '/settings/global', 'general-settings', 'system', 'Settings', 99, 'settings:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'general-settings');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'CRM Masters', '/settings/crm', 'crm-masters', 'system', 'Database', 92, 'settings:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'crm-masters');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Import Leads', '/crm/import/leads', 'import-leads', 'system', 'UploadCloud', 93, 'crm:create_leads', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'import-leads');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Custom Fields', '/settings/custom-fields', 'custom-fields', 'system', 'FileText', 95, 'settings:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'custom-fields');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'HMS Configuration', '/settings/hms', 'hms-config', 'system', 'Stethoscope', 96, 'hms:admin', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'hms-config');

-- 4. RESTORE MISSING ACCOUNTING MENUS
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Financial Dashboard', '/hms/accounting', 'acc-dashboard', 'finance', 'LayoutDashboard', 1, 'accounting:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'acc-dashboard');

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Accounting Config', '/settings/accounting', 'accounting-settings', 'system', 'Calculator', 94, 'accounting:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'accounting-settings');

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'General Ledger', '#', 'acc-ledger', 'finance', 'Book', 30, 'accounting:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'acc-ledger');
-- Children
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, parent_id)
SELECT gen_random_uuid(), 'Journal Entries', '/accounting/journals', 'acc-journals', 'finance', 'BookOpen', 10, 'accounting:view', true, (SELECT id FROM menu_items WHERE key='acc-ledger') WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'acc-journals');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, parent_id)
SELECT gen_random_uuid(), 'Chart of Accounts', '/accounting/coa', 'acc-coa', 'finance', 'ListTree', 5, 'accounting:view', true, (SELECT id FROM menu_items WHERE key='acc-ledger') WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'acc-coa');

-- 5. RESTORE MISSING INVENTORY MENUS
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Inventory', '/hms/inventory', 'inv-dashboard', 'inventory', 'LayoutDashboard', 10, 'inventory:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'inv-dashboard');

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Product Master', '/hms/inventory/products', 'inv-products', 'inventory', 'Package', 20, 'inventory:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'inv-products');

-- Procurement Group
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global)
SELECT gen_random_uuid(), 'Procurement', '#', 'inv-procurement', 'inventory', 'ShoppingCart', 30, 'purchasing:view', true WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'inv-procurement');
-- Children
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, parent_id)
SELECT gen_random_uuid(), 'Suppliers', '/hms/purchasing/suppliers', 'inv-suppliers', 'inventory', 'Truck', 10, 'suppliers:view', true, (SELECT id FROM menu_items WHERE key='inv-procurement') WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'inv-suppliers');
INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, parent_id)
SELECT gen_random_uuid(), 'Purchase Orders', '/hms/purchasing/orders', 'inv-po', 'inventory', 'FileText', 20, 'purchasing:view', true, (SELECT id FROM menu_items WHERE key='inv-procurement') WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'inv-po');
