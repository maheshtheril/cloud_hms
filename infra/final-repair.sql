
-- FINAL REPAIR SCRIPT FOR gmh@gmail.com
DO $$
DECLARE
    tid uuid := 'e4e7c1ce-0e5c-4e82-94fb-dc411e5fab41';
    cid uuid := gen_random_uuid();
    uid uuid := gen_random_uuid();
BEGIN
    -- 1. Create Tenant
    INSERT INTO public.tenant (id, name, slug) 
    VALUES (tid, 'Ziona Health', 'ziona-health') 
    ON CONFLICT (id) DO NOTHING;

    -- 2. Create Company
    INSERT INTO public.company (id, tenant_id, name, industry, enabled) 
    VALUES (cid, tid, 'Ziona Health', 'Healthcare', true) 
    ON CONFLICT DO NOTHING;

    -- Get CID if already exists
    SELECT id INTO cid FROM public.company WHERE tenant_id = tid LIMIT 1;
    
    -- 3. Create User
    INSERT INTO public.app_user (id, tenant_id, company_id, email, name, password, is_admin, is_tenant_admin, is_active)
    VALUES (uid, tid, cid, 'gmh@gmail.com', 'Admin User', '$2b$10$MgeJl5yVOoHYC30gJnuSaOOeW086m6/CTkIgOwffCuTHw9ORRYfiK', true, true, true)
    ON CONFLICT (email) DO UPDATE SET 
        tenant_id = tid, 
        company_id = cid, 
        is_active = true,
        password = '$2b$10$MgeJl5yVOoHYC30gJnuSaOOeW086m6/CTkIgOwffCuTHw9ORRYfiK';

    -- Get UID if updated
    SELECT id INTO uid FROM public.app_user WHERE email = 'gmh@gmail.com';

    -- 4. Set Default Role
    INSERT INTO public.role (id, tenant_id, key, name, permissions) 
    VALUES (gen_random_uuid(), tid, 'super_admin', 'Super Admin', ARRAY['*']) 
    ON CONFLICT DO NOTHING;

    INSERT INTO public.user_role (id, user_id, role_id, tenant_id)
    SELECT gen_random_uuid(), uid, id, tid FROM public.role WHERE tenant_id = tid AND key = 'super_admin'
    ON CONFLICT DO NOTHING;

    -- 5. Enable Modules
    -- Modules: hms, crm, system (from the modules table populated by schema_clean.sql)
    INSERT INTO public.tenant_module (id, tenant_id, module_key, enabled)
    SELECT gen_random_uuid(), tid, module_key, true 
    FROM public.modules
    WHERE module_key IN ('hms', 'crm', 'system')
    AND NOT EXISTS (SELECT 1 FROM public.tenant_module tm WHERE tm.tenant_id = tid AND tm.module_key = modules.module_key);

    RAISE NOTICE 'User gmh@gmail.com repaired successfully';
END $$;
