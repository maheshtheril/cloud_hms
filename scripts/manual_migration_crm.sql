-- RUN THIS IN NEON SQL EDITOR IF PRISMA PUSH FAILS
-- This adds the necessary columns for the CRM Menu Seeding feature

-- 1. Ensure hms_departments exists (if not already created)
CREATE TABLE IF NOT EXISTS "hms_departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "parent_id" UUID,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "hms_departments_pkey" PRIMARY KEY ("id")
);

-- 2. Add Unique Constraints and Indexes if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hms_departments_company_id_name_unique') THEN
        ALTER TABLE "hms_departments" ADD CONSTRAINT "hms_departments_company_id_name_unique" UNIQUE ("company_id", "name");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_company_code') THEN
        ALTER TABLE "hms_departments" ADD CONSTRAINT "unique_company_code" UNIQUE ("company_id", "code");
    END IF;
END $$;

-- 3. Add CRM Employee Columns
ALTER TABLE "crm_employee" ADD COLUMN IF NOT EXISTS "supervisor_id" UUID;
ALTER TABLE "crm_employee" ADD COLUMN IF NOT EXISTS "department_id" UUID;
ALTER TABLE "crm_employee" ADD COLUMN IF NOT EXISTS "office" TEXT;
ALTER TABLE "crm_employee" ADD COLUMN IF NOT EXISTS "category" TEXT;

-- 4. Add Foreign Keys
DO $$
BEGIN
    -- Parent Department FK
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_parent_company') THEN
        ALTER TABLE "hms_departments" ADD CONSTRAINT "fk_parent_company" FOREIGN KEY ("parent_id") REFERENCES "hms_departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    END IF;
    
    -- Employee Department FK
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crm_employee_department_id_fkey') THEN
        ALTER TABLE "crm_employee" ADD CONSTRAINT "crm_employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "hms_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- Employee Supervisor FK
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crm_employee_supervisor_id_fkey') THEN
        ALTER TABLE "crm_employee" ADD CONSTRAINT "crm_employee_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "crm_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
