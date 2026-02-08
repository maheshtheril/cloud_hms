
-- ADD CORE CONSTRAINTS
DO $$
BEGIN
    ALTER TABLE public.tenant ADD IF NOT EXISTS PRIMARY KEY (id);
EXCEPTION WHEN others THEN RAISE NOTICE 'tenant PK failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.company ADD IF NOT EXISTS PRIMARY KEY (id);
EXCEPTION WHEN others THEN RAISE NOTICE 'company PK failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.app_user ADD IF NOT EXISTS PRIMARY KEY (id);
EXCEPTION WHEN others THEN RAISE NOTICE 'app_user PK failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.app_user ADD UNIQUE (email);
EXCEPTION WHEN others THEN RAISE NOTICE 'app_user email unique failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.modules ADD UNIQUE (module_key);
EXCEPTION WHEN others THEN RAISE NOTICE 'modules unique failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.role ADD IF NOT EXISTS PRIMARY KEY (id);
EXCEPTION WHEN others THEN RAISE NOTICE 'role PK failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE public.tenant_module ADD IF NOT EXISTS PRIMARY KEY (id);
EXCEPTION WHEN others THEN RAISE NOTICE 'tenant_module PK failed: %', SQLERRM;
END $$;
