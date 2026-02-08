
-- REPAIR SCRIPT FOR gmh@gmail.com (Version 2 - Explicit Types)
DO $$
DECLARE
    v_tenant_id text := 'e4e7c1ce-0e5c-4e82-94fb-dc411e5fab41';
    v_company_id text := gen_random_uuid()::text;
    v_user_id text;
BEGIN
    SELECT id::text INTO v_user_id FROM app_user WHERE email = 'gmh@gmail.com';
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User gmh@gmail.com not found';
    END IF;

    -- 1. Ensure Tenant
    IF NOT EXISTS (SELECT 1 FROM tenant WHERE id = v_tenant_id) THEN
        INSERT INTO tenant (id, name, slug) VALUES (v_tenant_id, 'Ziona Health', 'ziona-health');
    END IF;

    -- 2. Ensure Company
    IF NOT EXISTS (SELECT 1 FROM company WHERE tenant_id = v_tenant_id) THEN
        INSERT INTO company (id, tenant_id, name, industry, enabled)
        VALUES (v_company_id, v_tenant_id, 'Ziona Health', 'Healthcare', true);
    ELSE
        SELECT id::text INTO v_company_id FROM company WHERE tenant_id = v_tenant_id LIMIT 1;
    END IF;

    -- 3. Update User
    UPDATE app_user 
    SET tenant_id = v_tenant_id, 
        company_id = v_company_id,
        is_active = true,
        is_admin = true,
        is_tenant_admin = true,
        password = '$2b$10$MgeJl5yVOoHYC30gJnuSaOOeW086m6/CTkIgOwffCuTHw9ORRYfiK' -- password123
    WHERE id::text = v_user_id;

    -- 4. Modules
    -- Modules: hms, crm, system (Ensure they are in modules table first)
    IF NOT EXISTS (SELECT 1 FROM modules WHERE module_key = 'hms') THEN
        INSERT INTO modules (id, module_key, name) VALUES (gen_random_uuid()::text, 'hms', 'Healthcare Management');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM modules WHERE module_key = 'crm') THEN
        INSERT INTO modules (id, module_key, name) VALUES (gen_random_uuid()::text, 'crm', 'CRM');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM modules WHERE module_key = 'system') THEN
        INSERT INTO modules (id, module_key, name) VALUES (gen_random_uuid()::text, 'system', 'System');
    END IF;

    -- Link modules to tenant
    INSERT INTO tenant_module (id, tenant_id, module_key, enabled)
    SELECT gen_random_uuid()::text, v_tenant_id, m.module_key, true
    FROM modules m
    WHERE m.module_key IN ('hms', 'crm', 'system')
    AND NOT EXISTS (SELECT 1 FROM tenant_module tm WHERE tm.tenant_id = v_tenant_id AND tm.module_key = m.module_key);

    RAISE NOTICE 'Repair complete for gmh@gmail.com';
END $$;
