
-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- 2. Supporting Tables
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    currency_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS country_tax_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL,
    tax_type_id UUID,
    tax_rate_id UUID,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS company_tax_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    country_id UUID NOT NULL,
    tax_type_id UUID,
    tax_rate_id UUID,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS company_accounting_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    currency_id UUID,
    ar_account_id UUID,
    ap_account_id UUID,
    sales_account_id UUID,
    purchase_account_id UUID,
    inventory_asset_account_id UUID,
    output_tax_account_id UUID,
    input_tax_account_id UUID,
    stock_adjustment_account_id UUID,
    fiscal_year_start TIMESTAMPTZ,
    fiscal_year_end TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "role" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenant_module (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    module_key TEXT NOT NULL,
    module_id UUID,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hms_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS hms_product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    sku TEXT,
    name TEXT NOT NULL,
    description TEXT,
    is_service BOOLEAN DEFAULT false,
    is_stockable BOOLEAN DEFAULT true,
    uom TEXT,
    price DECIMAL(15,2),
    currency TEXT DEFAULT 'INR',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure primary keys and unique indexes for ON CONFLICT
ALTER TABLE modules DROP CONSTRAINT IF EXISTS modules_module_key_key;
ALTER TABLE modules ADD CONSTRAINT modules_module_key_key UNIQUE (module_key);

-- Fix for Type "company" is neither a composite type... (if it was an enum, but here it's a table)
-- Just making sure schema is clean.
