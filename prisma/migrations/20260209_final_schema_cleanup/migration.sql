-- =====================================================
-- FINAL PRODUCTION-READY SCHEMA CLEANUP
-- =====================================================
-- This migration removes ALL phantom array columns that were created
-- by incorrect migrations and are causing "malformed array literal" errors.
-- 
-- LEGITIMATE ARRAYS (preserved):
-- - hms_clinicians.working_days (String[])
-- - role.permissions (String[])
--
-- All other array columns are phantom relation columns that should
-- never have been created as physical columns in the database.
-- =====================================================

-- Step 1: Save and drop triggers on hms_invoice (they prevent column type changes)
DO $$
DECLARE
    trigger_rec RECORD;
    trigger_defs TEXT[];
BEGIN
    -- Save trigger definitions
    FOR trigger_rec IN 
        SELECT 
            t.tgname as trigger_name,
            pg_get_triggerdef(t.oid) as trigger_def
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        WHERE c.relname = 'hms_invoice'
        AND NOT t.tgisinternal
    LOOP
        trigger_defs := array_append(trigger_defs, trigger_rec.trigger_def);
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trigger_rec.trigger_name) || ' ON hms_invoice CASCADE';
        RAISE NOTICE 'Dropped trigger: %', trigger_rec.trigger_name;
    END LOOP;
    
    -- Store trigger definitions in a temporary table for later restoration
    CREATE TEMP TABLE IF NOT EXISTS saved_invoice_triggers (trigger_def TEXT);
    IF array_length(trigger_defs, 1) > 0 THEN
        INSERT INTO saved_invoice_triggers SELECT unnest(trigger_defs);
    END IF;
END $$;

-- Step 2: Fix hms_invoice.line_items if it's still an array
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'hms_invoice' 
        AND column_name = 'line_items' 
        AND udt_name LIKE '_%'
    ) THEN
        ALTER TABLE "hms_invoice" ALTER COLUMN "line_items" TYPE jsonb USING COALESCE("line_items"[1], '[]'::jsonb);
        RAISE NOTICE 'Converted line_items from array to jsonb';
    END IF;
END $$;

ALTER TABLE "hms_invoice" ALTER COLUMN "line_items" SET DEFAULT '[]'::jsonb;

-- Step 2: Drop ALL phantom array columns (except working_days and permissions)
-- These are relation columns that were mistakenly created as physical array columns

-- Drop phantom columns from various tables
ALTER TABLE "account_types" DROP COLUMN IF EXISTS "account_chart" CASCADE;
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "journal_entry_lines" CASCADE;
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "journal_lines" CASCADE;
ALTER TABLE "analytic_accounts" DROP COLUMN IF EXISTS "analytic_distribution" CASCADE;
ALTER TABLE "analytic_accounts" DROP COLUMN IF EXISTS "journal_entry_lines" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "accounts" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "contacts" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "deals" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "doctor_notes" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "email_verification_tokens" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "hms_user_roles" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "leads" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "user_branches" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "user_holidays" CASCADE;
ALTER TABLE "app_user" DROP COLUMN IF EXISTS "user_permission" CASCADE;
ALTER TABLE "company" DROP COLUMN IF EXISTS "branches" CASCADE;
ALTER TABLE "company" DROP COLUMN IF EXISTS "company_menu_overrides" CASCADE;
ALTER TABLE "company" DROP COLUMN IF EXISTS "company_taxes" CASCADE;
ALTER TABLE "company" DROP COLUMN IF EXISTS "sessions" CASCADE;
ALTER TABLE "countries" DROP COLUMN IF EXISTS "app_users" CASCADE;
ALTER TABLE "countries" DROP COLUMN IF EXISTS "company" CASCADE;
ALTER TABLE "countries" DROP COLUMN IF EXISTS "country_default_currency" CASCADE;
ALTER TABLE "countries" DROP COLUMN IF EXISTS "country_tax_mappings" CASCADE;
ALTER TABLE "countries" DROP COLUMN IF EXISTS "hms_holidays" CASCADE;
ALTER TABLE "countries" DROP COLUMN IF EXISTS "subdivisions" CASCADE;
ALTER TABLE "country_subdivision" DROP COLUMN IF EXISTS "app_users" CASCADE;
ALTER TABLE "country_subdivision" DROP COLUMN IF EXISTS "hms_holidays" CASCADE;
ALTER TABLE "crm_accounts" DROP COLUMN IF EXISTS "contacts" CASCADE;
ALTER TABLE "crm_accounts" DROP COLUMN IF EXISTS "deals" CASCADE;
ALTER TABLE "crm_custom_fields" DROP COLUMN IF EXISTS "values" CASCADE;
ALTER TABLE "crm_deals" DROP COLUMN IF EXISTS "activities" CASCADE;
ALTER TABLE "crm_deals" DROP COLUMN IF EXISTS "commissions" CASCADE;
ALTER TABLE "crm_designation" DROP COLUMN IF EXISTS "employees" CASCADE;
ALTER TABLE "crm_leads" DROP COLUMN IF EXISTS "activities" CASCADE;
ALTER TABLE "crm_lost_reasons" DROP COLUMN IF EXISTS "deals" CASCADE;
ALTER TABLE "crm_pipelines" DROP COLUMN IF EXISTS "deals" CASCADE;
ALTER TABLE "crm_pipelines" DROP COLUMN IF EXISTS "leads" CASCADE;
ALTER TABLE "crm_pipelines" DROP COLUMN IF EXISTS "stages" CASCADE;
ALTER TABLE "crm_sources" DROP COLUMN IF EXISTS "leads" CASCADE;
ALTER TABLE "crm_stages" DROP COLUMN IF EXISTS "deals" CASCADE;
ALTER TABLE "crm_stages" DROP COLUMN IF EXISTS "leads" CASCADE;
ALTER TABLE "crm_target_types" DROP COLUMN IF EXISTS "leads" CASCADE;
ALTER TABLE "crm_targets" DROP COLUMN IF EXISTS "milestones" CASCADE;
ALTER TABLE "currencies" DROP COLUMN IF EXISTS "accounts" CASCADE;
ALTER TABLE "currencies" DROP COLUMN IF EXISTS "company_accounting_settings" CASCADE;
ALTER TABLE "currencies" DROP COLUMN IF EXISTS "company_settings" CASCADE;
ALTER TABLE "currencies" DROP COLUMN IF EXISTS "country_default_currency" CASCADE;
ALTER TABLE "currencies" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "currencies" DROP COLUMN IF EXISTS "tenant_enabled_currencies" CASCADE;
ALTER TABLE "fiscal_positions" DROP COLUMN IF EXISTS "fiscal_position_account_map" CASCADE;
ALTER TABLE "fiscal_positions" DROP COLUMN IF EXISTS "fiscal_position_tax_map" CASCADE;
ALTER TABLE "fiscal_years" DROP COLUMN IF EXISTS "periods" CASCADE;
ALTER TABLE "hms_appointments" DROP COLUMN IF EXISTS "hms_imaging_order" CASCADE;
ALTER TABLE "hms_appointments" DROP COLUMN IF EXISTS "hms_invoice" CASCADE;
ALTER TABLE "hms_appointments" DROP COLUMN IF EXISTS "hms_lab_order" CASCADE;
ALTER TABLE "hms_appointments" DROP COLUMN IF EXISTS "prescription" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "admissions" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "appointments" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "business_partners" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "crm_accounts" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "crm_contacts" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "crm_deals" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "crm_employees" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "doctor_notes" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "encounters" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "invoices" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "journals" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "leads" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "modules" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "patients" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "stock_locations" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "users" CASCADE;
ALTER TABLE "hms_branch" DROP COLUMN IF EXISTS "wards" CASCADE;
ALTER TABLE "hms_clinicians" DROP COLUMN IF EXISTS "hms_appointments" CASCADE;
-- NOTE: hms_clinicians.working_days is PRESERVED (legitimate array)
ALTER TABLE "hms_departments" DROP COLUMN IF EXISTS "crm_employees" CASCADE;
ALTER TABLE "hms_encounter" DROP COLUMN IF EXISTS "hms_admission" CASCADE;
ALTER TABLE "hms_encounter" DROP COLUMN IF EXISTS "hms_invoice" CASCADE;
ALTER TABLE "hms_holiday" DROP COLUMN IF EXISTS "users" CASCADE;
ALTER TABLE "hms_imaging_order" DROP COLUMN IF EXISTS "hms_imaging_study" CASCADE;
ALTER TABLE "hms_imaging_series" DROP COLUMN IF EXISTS "hms_imaging_image" CASCADE;
ALTER TABLE "hms_imaging_study" DROP COLUMN IF EXISTS "hms_imaging_series" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_invoice_lines" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_invoice_payments" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_payment_allocations" CASCADE;
ALTER TABLE "hms_invoice" DROP COLUMN IF EXISTS "hms_sales_return" CASCADE;
ALTER TABLE "hms_invoice_lines" DROP COLUMN IF EXISTS "hms_sales_return_line" CASCADE;
ALTER TABLE "hms_invoice_payments" DROP COLUMN IF EXISTS "hms_payment_allocations" CASCADE;
ALTER TABLE "hms_lab_order" DROP COLUMN IF EXISTS "hms_lab_order_lines" CASCADE;
ALTER TABLE "hms_lab_sample" DROP COLUMN IF EXISTS "hms_lab_order_lines" CASCADE;
ALTER TABLE "hms_lab_test" DROP COLUMN IF EXISTS "hms_lab_order_lines" CASCADE;
ALTER TABLE "hms_patient" DROP COLUMN IF EXISTS "hms_appointments" CASCADE;
ALTER TABLE "hms_patient" DROP COLUMN IF EXISTS "hms_vitals" CASCADE;
ALTER TABLE "hms_product" DROP COLUMN IF EXISTS "hms_invoice_lines" CASCADE;
ALTER TABLE "hms_product" DROP COLUMN IF EXISTS "hms_stock_levels" CASCADE;
ALTER TABLE "hms_product" DROP COLUMN IF EXISTS "prescription_items" CASCADE;
ALTER TABLE "hms_product" DROP COLUMN IF EXISTS "product_tax_rules" CASCADE;
ALTER TABLE "hms_purchase_invoice" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "hms_purchase_return" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "hms_purchase_return" DROP COLUMN IF EXISTS "lines" CASCADE;
ALTER TABLE "hms_role" DROP COLUMN IF EXISTS "hms_role_permissions" CASCADE;
ALTER TABLE "hms_role" DROP COLUMN IF EXISTS "hms_user_roles" CASCADE;
ALTER TABLE "hms_roles" DROP COLUMN IF EXISTS "hms_clinicians" CASCADE;
ALTER TABLE "hms_sales_return" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "hms_sales_return" DROP COLUMN IF EXISTS "lines" CASCADE;
ALTER TABLE "hms_specializations" DROP COLUMN IF EXISTS "hms_clinicians" CASCADE;
ALTER TABLE "hms_staff_shift" DROP COLUMN IF EXISTS "work_days" CASCADE;
ALTER TABLE "hms_stock_adjustment" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "hms_stock_adjustment" DROP COLUMN IF EXISTS "lines" CASCADE;
ALTER TABLE "journal_entries" DROP COLUMN IF EXISTS "journal_entry_lines" CASCADE;
ALTER TABLE "journal_entries" DROP COLUMN IF EXISTS "journal_lines" CASCADE;
ALTER TABLE "journal_types" DROP COLUMN IF EXISTS "posting_rules" CASCADE;
ALTER TABLE "journals" DROP COLUMN IF EXISTS "journal_entries" CASCADE;
ALTER TABLE "lead" DROP COLUMN IF EXISTS "tags" CASCADE;
ALTER TABLE "menu_items" DROP COLUMN IF EXISTS "company_menu_overrides" CASCADE;
ALTER TABLE "menu_items" DROP COLUMN IF EXISTS "tenant_menu_overrides" CASCADE;
ALTER TABLE "payments" DROP COLUMN IF EXISTS "payment_lines" CASCADE;
ALTER TABLE "prescription" DROP COLUMN IF EXISTS "prescription_items" CASCADE;
-- NOTE: role.permissions is PRESERVED (legitimate array)
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "company_settings" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "company_tax_maps" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "country_tax_mappings" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "hms_invoice_lines" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "product_tax_rules" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "tax_gl_accounts" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "tax_posting_rules" CASCADE;
ALTER TABLE "tax_rates" DROP COLUMN IF EXISTS "tenant_enabled_tax_rates" CASCADE;
ALTER TABLE "tax_types" DROP COLUMN IF EXISTS "company_settings" CASCADE;
ALTER TABLE "tax_types" DROP COLUMN IF EXISTS "company_tax_maps" CASCADE;
ALTER TABLE "tax_types" DROP COLUMN IF EXISTS "country_tax_mappings" CASCADE;
ALTER TABLE "tax_types" DROP COLUMN IF EXISTS "tax_rates" CASCADE;
ALTER TABLE "tenant" DROP COLUMN IF EXISTS "company_settings" CASCADE;
ALTER TABLE "tenant" DROP COLUMN IF EXISTS "domain_mappings" CASCADE;
ALTER TABLE "tenant" DROP COLUMN IF EXISTS "domain_policies" CASCADE;
ALTER TABLE "tenant" DROP COLUMN IF EXISTS "tenant_menu_overrides" CASCADE;

-- Step 3: Recreate any views that may have been dropped by CASCADE
CREATE OR REPLACE VIEW "invoices" AS 
 SELECT id,
    tenant_id,
    company_id,
    patient_id,
    encounter_id,
    invoice_number,
    issued_at,
    due_at,
    currency,
    currency_rate,
    subtotal,
    total_tax,
    total_discount,
    total,
    total_paid,
    status,
    line_items,
    billing_metadata,
    locked,
    created_by,
    created_at,
    updated_at
   FROM public.hms_invoice;

CREATE OR REPLACE VIEW "vw_hms_invoice_finance" AS 
 SELECT i.id AS invoice_id,
    i.tenant_id,
    i.company_id,
    i.invoice_number,
    i.issued_at,
    i.currency,
    i.total,
    i.total_tax,
    i.subtotal,
    i.line_items,
    jsonb_agg(jsonb_build_object('line_id', l.id, 'ref', l.line_ref, 'desc', l.description, 'qty', l.quantity, 'unit_price', l.unit_price, 'net', l.net_amount, 'account_code', l.account_code) ORDER BY l.line_idx) AS normalized_lines
   FROM public.hms_invoice i
     LEFT JOIN public.hms_invoice_lines l ON i.id = l.invoice_id
  GROUP BY i.id;

-- Step 4: Restore triggers on hms_invoice
DO $$
DECLARE
    trigger_def_rec RECORD;
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'saved_invoice_triggers') THEN
        FOR trigger_def_rec IN SELECT trigger_def FROM saved_invoice_triggers
        LOOP
            EXECUTE trigger_def_rec.trigger_def;
            RAISE NOTICE 'Restored trigger';
        END LOOP;
        DROP TABLE IF EXISTS saved_invoice_triggers;
    END IF;
END $$;

-- Step 5: Verify the cleanup
DO $$
DECLARE
    phantom_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO phantom_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND (data_type = 'ARRAY' OR udt_name LIKE '_%')
    AND NOT (
        (table_name = 'hms_clinicians' AND column_name = 'working_days') OR
        (table_name = 'role' AND column_name = 'permissions')
    );
    
    IF phantom_count > 0 THEN
        RAISE WARNING 'WARNING: % phantom array columns still remain in the database', phantom_count;
    ELSE
        RAISE NOTICE 'SUCCESS: All phantom array columns have been removed. Database schema is now clean.';
    END IF;
END $$;

