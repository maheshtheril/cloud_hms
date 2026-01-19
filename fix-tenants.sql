
-- 1. Subscribe Tenant to System Module
INSERT INTO tenant_module (id, tenant_id, module_key, module_id, enabled)
SELECT gen_random_uuid(), t.id, 'system', (SELECT id FROM modules WHERE module_key='system'), true
FROM tenant t
WHERE NOT EXISTS (SELECT 1 FROM tenant_module tm WHERE tm.tenant_id = t.id AND tm.module_key = 'system');

-- 2. Migrate existing Configuration items to 'system'
UPDATE menu_items 
SET module_key = 'system' 
WHERE module_key = 'configuration';

-- 3. INSERT MISSING MENUS (Bulletproof)
-- If these rows don't exist, the UI will be empty. We force create them here.

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, is_active)
SELECT gen_random_uuid(), 'User Management', '/settings/users', 'users', 'system', 'Users', 90, 'users:view', true, true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'users');

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, is_active)
SELECT gen_random_uuid(), 'Roles & Permissions', '/settings/roles', 'roles', 'system', 'Shield', 91, 'roles:manage', true, true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'roles');

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, is_active)
SELECT gen_random_uuid(), 'Global Settings', '/settings/global', 'general-settings', 'system', 'Settings', 99, 'settings:view', true, true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'general-settings');

INSERT INTO menu_items (id, label, url, key, module_key, icon, sort_order, permission_code, is_global, is_active)
SELECT gen_random_uuid(), 'HMS Configuration', '/settings/hms', 'hms-config', 'system', 'Stethoscope', 96, 'hms:admin', true, true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE key = 'hms-config');

-- 4. Ensure Permissions Exist just in case
-- (Optional, usually handled by code, but safer to have)
